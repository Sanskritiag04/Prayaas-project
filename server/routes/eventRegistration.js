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

    // AUTO CLOSE REGISTRATION
const today = new Date();
//today.setHours(0,0,0,0);

const deadline = new Date(event.registration_deadline);
deadline.setHours(23,59,59,999);

if (today > deadline) {
  return res.status(400).json({
    message: "Registration closed for this event"
  });
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
      attended: false   
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

router.put("/attendance-bulk", auth("ngo"), async (req, res) => {
  const { attendance, eventId } = req.body;

  try {
    const event = await Event.findById(eventId);

    const now = new Date();
    if (now < new Date(event.end_date)) {
      return res.status(400).json({
        message: "Cannot take attendance until the event has ended."
      });
    }

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

    event.attendanceSubmitted = true;
    await event.save();

    res.json({ message: "Attendance submitted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error saving attendance" });
  }
});

router.put("/issue-certificates/:eventId", auth("ngo"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    const now = new Date();
    if (now < new Date(event.end_date)) {
      return res.status(400).json({
        message: "Certificates can only be issued after the event ends."
      });
    }

    if (event.certificatesIssued) {
      return res.json({ message: "Already issued" });
    }

    const registrations = await EventRegistration.find({
      event_id: req.params.eventId,
      attended: true
    })
      .populate("v_id", "name")
      .populate("event_id", "title ngo_id start_date");

    for (let reg of registrations) {

      if (reg.certificate) continue;

      const ngo = await require("../models/NGO")
        .findById(reg.event_id.ngo_id);

      const filePath = `uploads/certificates/${reg._id}.pdf`;

      generateCertificate(
        reg.v_id.name,
        reg.event_id.title,
        ngo.ngoName,
        reg.event_id.start_date,
        filePath
      );

      reg.certificate = filePath;
      await reg.save();
    }

    // ✅ LOCK FOREVER
    event.certificatesIssued = true;
    await event.save();

    res.json({ message: "Certificates issued successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error issuing certificates" });
  }
});
module.exports = router;