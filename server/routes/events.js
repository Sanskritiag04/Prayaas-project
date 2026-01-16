const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

/* GET EVENTS BY TYPE */
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const events = await Event.find({ type });
    res.status(200).json(events);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
