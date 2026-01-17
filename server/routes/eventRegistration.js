const express = require("express");
const router = express.Router();
const EventRegistration = require("../models/EventRegistration");
const auth = require("../middleware/auth"); // volunteer auth

router.post("/register", auth, async (req, res) => {
  const { event_id } = req.body;

  try {
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
    res.status(500).json({ message: "Registration failed" });
  }
});

module.exports = router;
