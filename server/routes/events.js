const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const upload = require("../middleware/uploadEventImage");

/* CREATE EVENT WITH IMAGE */
router.post(
  "/create",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        ngo_id,
        title,
        description,
        event_type,
        start_date,
        end_date,
        location,
        status
      } = req.body;

      const event = new Event({
        ngo_id,
        title,
        description,
        event_type,
        start_date,
        end_date,
        location,
        status,
        image: `/uploads/events/${req.file.filename}`
      });

      await event.save();
      res.status(201).json({ message: "Event created successfully" });

    } catch (err) {
      res.status(500).json({ message: "Event creation failed" });
    }
  }
);

/* GET EVENTS BY STATUS */
router.get("/:status", async (req, res) => {
  const events = await Event.find({ status: req.params.status });
  res.json(events);
});

router.get("/details/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(404).json({ message: "Event not found" });
  }
});

module.exports = router;
