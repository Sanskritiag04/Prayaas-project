const express = require("express");
const router = express.Router();
const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event");
const auth = require("../middleware/auth");


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


// ===================================
// MARK ATTENDANCE (NGO)
// ===================================
router.put("/attendance", auth("ngo"), async (req, res) => {
  const { registrationId, attended } = req.body;

  if (!registrationId) {
    return res.status(400).json({ message: "Registration ID required" });
  }

  try {
    const updated = await EventRegistration.findByIdAndUpdate(
      registrationId,
      { attended },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Attendance update failed" });
  }
});


// ===================================
module.exports = router;