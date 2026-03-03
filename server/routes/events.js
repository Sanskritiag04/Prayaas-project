// const express = require("express");
// const router = express.Router();
// const Event = require("../models/Event");
// const upload = require("../middleware/uploadEventImage");

// router.post(
//   "/create",
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const {
//         ngo_id,
//         title,
//         description,
//         event_type,
//         start_date,
//         end_date,
//         location,
//         status
//       } = req.body;

//       const event = new Event({
//         ngo_id,
//         title,
//         description,
//         event_type,
//         start_date,
//         end_date,
//         location,
//         status,
//         image: `/uploads/events/${req.file.filename}`
//       });

//       await event.save();
//       res.status(201).json({ message: "Event created successfully" });

//     } catch (err) {
//       res.status(500).json({ message: "Event creation failed" });
//     }
//   }
// );

// router.get("/:status", async (req, res) => {
//   const events = await Event.find({ status: req.params.status });
//   res.json(events);
// });


//module.exports = router;

const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadEventImage");
const auth = require("../middleware/auth");
const Event = require("../models/Event");

const eventController = require("../controllers/eventController");

// CREATE EVENT (NGO)
router.post(
  "/create",
  auth,
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
router.get("/ngo-events", auth, eventController.getNgoEvents);

module.exports = router;