const Event = require("../models/Event");

// CREATE EVENT
// exports.createEvent = async (req, res) => {
//   try {
//     const event = new Event({
//       ...req.body,
//       ngo_id: req.user.id,
//       image: `/uploads/events/${req.file.filename}`
//     });

//     await event.save();

//     res.status(201).json({
//       message: "Event created successfully",
//       event
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
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

// deadline already passed
if (new Date(registration_deadline) < today) {
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

// GET UPCOMING EVENTS
// exports.getUpcomingEvents = async (req, res) => {
//   try {
//     const events = await Event.find({ status: "upcoming" })
//       .populate("ngo_id", "ngoName");

//     res.json(events);

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getUpcomingEvents = async (req, res) => {
  try {

    // ✅ automatically update old events
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

// GET PAST EVENTS
// exports.getPastEvents = async (req, res) => {
//   try {
//     const events = await Event.find({ status: "past" })
//       .populate("ngo_id", "ngoName");

//     res.json(events);

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

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

// GET EVENTS OF LOGGED IN NGO
exports.getNgoEvents = async (req, res) => {
  try {
    const events = await Event.find({ ngo_id: req.user.id });

    res.json(events);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};