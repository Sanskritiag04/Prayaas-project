const Event = require("../models/Event");

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      ngo_id: req.user.id,
      image: `/uploads/events/${req.file.filename}`
    });

    await event.save();

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET UPCOMING EVENTS
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "upcoming" })
      .populate("ngo_id", "ngoName");

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET PAST EVENTS
exports.getPastEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "past" })
      .populate("ngo_id", "ngoName");

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET EVENTS OF LOGGED IN NGO
exports.getNgoEvents = async (req, res) => {
  try {
    const events = await Event.find({ ngo_id: req.user.id });

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};