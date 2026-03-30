const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const NGO = require("../models/NGO");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// LOGIN Method
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, "PRAYAAS_SECRET", { expiresIn: "1d" });
    res.json({ token, role: "admin" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// verifyNGO Method
router.put("/verify-ngo/:id", auth("admin"), async (req, res) => {
  const { status, remarks } = req.body; 
  try {
    await NGO.findByIdAndUpdate(req.params.id, { 
      status, 
      adminRemarks: remarks || "" 
    });
    res.json({ message: `NGO ${status} successfully` });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
});

// Get Pending NGOs for the Admin Dashboard
router.get("/pending-ngos", auth("admin"), async (req, res) => {
  try {
    const ngos = await NGO.find({ status: "pending" });
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch NGOs" });
  }
});

// Get All NGOs (Both verified, pending, and rejected)
router.get("/all-ngos", auth("admin"), async (req, res) => {
  try {
    const ngos = await NGO.find().select("-password").sort({ createdAt: -1 });
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch NGO list" });
  }
});

// Delete NGO (Cascade delete events and registrations)
router.delete("/delete-ngo/:id", auth("admin"), async (req, res) => {
  try {
    const Event = require("../models/Event");
    const EventRegistration = require("../models/EventRegistration");
    const ngoId = req.params.id;

    // 1. Find all events by this NGO
    const events = await Event.find({ ngo_id: ngoId });
    const eventIds = events.map(e => e._id);

    // 2. Delete all volunteer registrations for those events
    await EventRegistration.deleteMany({ event_id: { $in: eventIds } });

    // 3. Delete the events and the NGO
    await Event.deleteMany({ ngo_id: ngoId });
    await NGO.findByIdAndDelete(ngoId);

    res.json({ message: "NGO and all related data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed" });
  }
});

// Admin delete any event (Moderation)
router.delete("/delete-event/:eventId", auth("admin"), async (req, res) => {
  try {
    const Event = require("../models/Event");
    const EventRegistration = require("../models/EventRegistration");

    // Remove registrations first
    await EventRegistration.deleteMany({ event_id: req.params.eventId });
    // Remove event
    await Event.findByIdAndDelete(req.params.eventId);

    res.json({ message: "Event removed by Admin for policy violation." });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove event." });
  }
});

// GET SYSTEM STATS
router.get("/stats", auth("admin"), async (req, res) => {
  try {
    const Volunteer = require("../models/volunteer");
    const NGO = require("../models/NGO");
    const Event = require("../models/Event");

    const [volunteerCount, ngoCount, eventCount] = await Promise.all([
      Volunteer.countDocuments(),
      NGO.countDocuments(),
      Event.countDocuments()
    ]);

    res.json({
      volunteers: volunteerCount,
      ngos: ngoCount,
      events: eventCount
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

// Get all reported events
router.get("/reported-events", auth("admin"), async (req, res) => {
  try {
    const Event = require("../models/Event");
    const events = await Event.find({ isReported: true })
      .populate("ngo_id", "ngoName email")
      .sort({ reportCount: -1 }); // Show most reported first
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reported events" });
  }
});

// Admin Dismisses Report (If the event is actually okay)
router.put("/dismiss-report/:id", auth("admin"), async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, {
      isReported: false,
      reportCount: 0,
      reportReason: []
    });
    res.json({ message: "Reports dismissed." });
  } catch (err) {
    res.status(500).json({ message: "Action failed" });
  }
});


module.exports = router;