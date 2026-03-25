const express = require("express");
const router = express.Router();
const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event");
const auth = require("../middleware/auth");
const Volunteer = require("../models/volunteer");
const generateCertificate = require("../utils/generateCertificate");


router.post("/register", auth("volunteer"), async (req, res) => {
  const { event_id } = req.body;

  if (!event_id) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  try {
    const event = await Event.findById(event_id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // check already registered
    const alreadyRegistered = await EventRegistration.findOne({
      v_id: req.user.id,
      event_id
    });

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered" });
    }

    // create registration
    const registration = new EventRegistration({
      reg_id: "REG-" + Date.now(),
      v_id: req.user.id,
      event_id,
      attended: false   // ✅ important for attendance
    });

    await registration.save();
    await Volunteer.findByIdAndUpdate(req.user.id, {
      $inc: { points: 10 }
    });
    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// GET VOLUNTEER REGISTERED EVENTS
router.get("/my-events", auth("volunteer"), async (req, res) => {
  try {
    const registrations = await EventRegistration.find({
      v_id: req.user.id
    }).populate("event_id");

    const events = registrations.map(r => r.event_id);

    res.json(events);

  } catch (err) {
    res.status(500).json({ message: "Failed to load registered events" });
  }
});


// ===================================
// GET VOLUNTEERS OF A SPECIFIC EVENT (NGO)
// ===================================
router.get("/event/:eventId", auth("ngo"), async (req, res) => {
  try {
    const registrations = await EventRegistration.find({
      event_id: req.params.eventId
    }).populate("v_id", "name email");

    res.json(registrations);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load volunteers" });
  }
});



// router.put("/attendance", auth("ngo"), async (req, res) => {
//   const { registrationId, attended } = req.body;

//   if (!registrationId) {
//     return res.status(400).json({ message: "Registration ID required" });
//   }

//   try {
//     const updated = await EventRegistration.findByIdAndUpdate(
//       registrationId,
//       { attended },
//       { new: true }
//     );

//     res.json(updated);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Attendance update failed" });
//   }
// });

// router.put("/attendance", auth("ngo"), async (req, res) => {
//   const { registrationId, attended } = req.body;

//   if (!registrationId) {
//     return res.status(400).json({ message: "Registration ID required" });
//   }

//   try {
//     const registration = await EventRegistration.findById(registrationId);

//     if (!registration) {
//       return res.status(404).json({ message: "Registration not found" });
//     }

//     // ✅ Give points ONLY first time
//     if (!registration.attended && attended === true) {

//       registration.attended = true;
//       await registration.save();

//       // ⭐ ADD 20 POINTS
//       await Volunteer.findByIdAndUpdate(registration.v_id, {
//         $inc: { points: 20 }
//       });

//     } else {
//       // normal update (no extra points)
//       registration.attended = attended;
//       await registration.save();
//     }

//     res.json(registration);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Attendance update failed" });
//   }
// });

router.put("/attendance-bulk", auth("ngo"), async (req, res) => {
  const { attendance, eventId } = req.body;

  try {
    const event = await Event.findById(eventId);

    // ❌ STOP if already submitted
    if (event.attendanceSubmitted) {
      return res.status(400).json({
        message: "Attendance already submitted"
      });
    }

    for (let regId in attendance) {
      if (attendance[regId]) {
        const reg = await EventRegistration.findById(regId);

        if (reg && !reg.attended) {
          reg.attended = true;
          await reg.save();

          await Volunteer.findByIdAndUpdate(reg.v_id, {
            $inc: { points: 20 }
          });
        }
      }
    }

    // ✅ MARK EVENT AS DONE
    event.attendanceSubmitted = true;
    await event.save();

    res.json({ message: "Attendance submitted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error saving attendance" });
  }
});

router.get("/certificate/:registrationId", auth("ngo"), async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.registrationId)
      .populate("v_id", "name")
      .populate("event_id", "title ngo_id");

    if (!registration || !registration.attended) {
      return res.status(400).json({ message: "Not eligible" });
    }

    const volunteerName = registration.v_id.name;
    const eventName = registration.event_id.title;

    const ngo = await require("../models/NGO").findById(
      registration.event_id.ngo_id
    );

    const ngoName = ngo.ngoName;

    // ✅ SAVE FILE PATH
    const filePath = `uploads/certificates/${registration._id}.pdf`;

    // ✅ GENERATE + SAVE
    generateCertificate(filePath, volunteerName, eventName, ngoName);

    // ✅ STORE IN DB
    registration.certificate = filePath;
    await registration.save();

    res.json({ message: "Certificate issued" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Certificate error" });
  }
});
module.exports = router;