const express = require("express");
const router = express.Router();

const {
  createEvent,
  getUpcomingEvents,
  getPastEvents
} = require("../controllers/eventController");

/* Create Event */
router.post("/create", createEvent);

/* Filters */
router.get("/upcoming", getUpcomingEvents);
router.get("/past", getPastEvents);

module.exports = router;
