const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadEventImage");
const auth = require("../middleware/auth");
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");
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
router.delete("/delete-event/:id", auth("ngo"), eventController.deleteEvent);

// EVENT DETAILS
router.get("/details/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch {
    res.status(404).json({ message: "Event not found" });
  }
});


router.get("/ngo-events", auth("ngo"), eventController.getNgoEvents);

router.post("/report-event/:id", auth("volunteer"), async (req, res) => {
  try {
    const { reason } = req.body;
    await Event.findByIdAndUpdate(req.params.id, {
      isReported: true,
      $inc: { reportCount: 1 },
      $push: { reportReason: reason }
    });
    res.json({ message: "Event reported to Admin. Thank you for keeping Prayaas safe." });
  } catch (err) {
    res.status(500).json({ message: "Failed to report event" });
  }
});

// GET TRENDING EVENTS (Top 3 by registration count)
router.get("/trending", async (req, res) => {
  try {
    const now = new Date();

    const trendingData = await EventRegistration.aggregate([
      { $group: { _id: "$event_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const eventIds = trendingData.map(item => item._id);
    const allPotentialEvents = await Event.find({ _id: { $in: eventIds } })
      .populate("ngo_id", "ngoName");

   
    const trendingEvents = allPotentialEvents
      .filter(event => new Date(event.start_date) >= now)
      .slice(0, 3); 

    res.json(trendingEvents);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trending events" });
  }
});

module.exports = router;