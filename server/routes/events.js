const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadEventImage");
const auth = require("../middleware/auth");
const Event = require("../models/Event");

const eventController = require("../controllers/eventController");

// CREATE EVENT (NGO)
router.post(
  "/create",
  auth("ngo"),
  upload.single("image"),
  eventController.createEvent
);

// GET EVENTS FOR VOLUNTEERS
router.get("/upcoming", eventController.getUpcomingEvents);
router.get("/past", eventController.getPastEvents);

// EVENT DETAILS
router.get("/details/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch {
    res.status(404).json({ message: "Event not found" });
  }
});

// NGO EVENTS (dashboard)
router.get("/ngo-events", auth("ngo"), eventController.getNgoEvents);

module.exports = router;