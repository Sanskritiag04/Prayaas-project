const express = require("express");
const router = express.Router();

const {
  getLeaderboard,
  addUser
} = require("../controllers/leaderboardController");

// GET leaderboard
router.get("/", getLeaderboard);

// POST new user
router.post("/add", addUser);

module.exports = router;
