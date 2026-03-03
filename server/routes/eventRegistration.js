// const express = require("express");
// const router = express.Router();
// const EventRegistration = require("../models/EventRegistration");
// const Event = require("../models/Event");
// const auth = require("../middleware/auth");

// // REGISTER FOR EVENT
// router.post("/register", auth, async (req, res) => {
//   const { event_id } = req.body;

//   if (!event_id) {
//     return res.status(400).json({ message: "Event ID is required" });
//   }

//   try {
//     const event = await Event.findById(event_id);
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     // check limit
//     if (event.current_volunteers >= event.max_volunteers) {
//       return res.status(400).json({ message: "Registration closed" });
//     }

//     const alreadyRegistered = await EventRegistration.findOne({
//       v_id: req.user.id,
//       event_id
//     });

//     if (alreadyRegistered) {
//       return res.status(400).json({ message: "Already registered" });
//     }

//     const registration = new EventRegistration({
//       reg_id: "REG-" + Date.now(),
//       v_id: req.user.id,
//       event_id
//     });

//     await registration.save();

//     // increment count
//     event.current_volunteers += 1;
//     await event.save();

//     res.json({ message: "Registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// });

// module.exports = router;


// router.get("/my-events", auth, async (req, res) => {
//   try {
//     const registrations = await EventRegistration.find({
//       v_id: req.user.id,
//       status: "registered"
//     }).populate("event_id");

//     const events = registrations.map(r => r.event_id);

//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load registered events" });
//   }
// });



// module.exports = router;

const express = require("express");
const router = express.Router();
const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// REGISTER FOR EVENT
router.post("/register", auth, async (req, res) => {
  const { event_id } = req.body;
console.log("Received event_id:", event_id);
  if (!event_id) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  try {
    const event = await Event.findById(event_id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyRegistered = await EventRegistration.findOne({
      v_id: req.user.id,
      event_id
    });

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered" });
    }

    const registration = new EventRegistration({
      reg_id: "REG-" + Date.now(),
      v_id: req.user.id,
      event_id
    });

    await registration.save();

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// GET VOLUNTEER REGISTERED EVENTS
router.get("/my-events", auth, async (req, res) => {
  try {
    const registrations = await EventRegistration.find({
      v_id: req.user.id
    }).populate("event_id");

    const events = registrations.map(r => r.event_id);

    res.json(events);

  } catch {
    res.status(500).json({ message: "Failed to load registered events" });
  }
});

module.exports = router;