const Event = require("../models/Event");
const NGO= require("../models/NGO")

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {

    const ngo = await NGO.findById(req.user.id);

    if (ngo.status !== "verified") {
      return res.status(403).json({ 
        message: "Your account is pending verification. You cannot post events yet." 
      });
    }

    const {
      title,
      description,
      event_type,
      start_date,
      end_date,
      registration_deadline,
      location
    } = req.body;

    const today = new Date();
    today.setHours(0,0,0,0);
    const deadlineDate = new Date(registration_deadline);
deadlineDate.setHours(0, 0, 0, 0);

    //  validation 1 — start date cannot be past
    if (new Date(start_date) < today) {
      return res.status(400).json({
        message: "Start date cannot be in the past"
      });
    }

    //  validation 2 — end date after start
    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({
        message: "End date must be after start date"
      });
    }

    //  registration deadline after start
if (new Date(registration_deadline) >= new Date(start_date)) {
  return res.status(400).json({
    message: "Registration must close before event starts"
  });
}

if (deadlineDate < today) {
  return res.status(400).json({
    message: "Registration deadline cannot be in past"
  });
}

    // AUTO STATUS
    const status =
      new Date(end_date) < new Date()
        ? "past"
        : "upcoming";

    const event = new Event({
      title,
      description,
      event_type,
      start_date,
      end_date,
      registration_deadline,
      location,
      status,
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


exports.getUpcomingEvents = async (req, res) => {
  try {

    await Event.updateMany(
      { end_date: { $lt: new Date() } },
      { status: "past" }
    );

    const events = await Event.find({
      end_date: { $gte: new Date() }
    }).populate("ngo_id", "ngoName");

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPastEvents = async (req, res) => {
  try {

    await Event.updateMany(
      { end_date: { $lt: new Date() } },
      { status: "past" }
    );

    const events = await Event.find({
      end_date: { $lt: new Date() }
    }).populate("ngo_id", "ngoName");

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getNgoEvents = async (req, res) => {
  try {
    const events = await Event.find({ ngo_id: req.user.id });

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.ngo_id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized to delete this event" });
    }

  
    const today = new Date();
    const deadline = new Date(event.registration_deadline);
    deadline.setHours(23, 59, 59, 999); 

    if (today > deadline) {
      return res.status(400).json({ 
        message: "Cannot delete event after registration has ended" 
      });
    }

    const EventRegistration = require("../models/EventRegistration");
    await EventRegistration.deleteMany({ event_id: req.params.id });

    
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event and registrations deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};