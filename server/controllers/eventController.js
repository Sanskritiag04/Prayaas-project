const Event = require("../models/Event");

/* =========================
   CREATE EVENT (NGO / ADMIN)
   ========================= */
exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: "Event created", event });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET UPCOMING EVENTS
   ========================= */
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      eventDate: { $gte: new Date() }
    }).sort({ eventDate: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET PAST EVENTS
   ========================= */
exports.getPastEvents = async (req, res) => {
  try {
    const events = await Event.find({
      eventDate: { $lt: new Date() }
    }).sort({ eventDate: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
