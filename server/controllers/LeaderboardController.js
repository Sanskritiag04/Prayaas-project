const Leaderboard = require("../models/Leaderboard");

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await Leaderboard
      .find()
      .sort({ points: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add user to leaderboard
exports.addUser = async (req, res) => {
  try {
    const { name, points } = req.body;

    const user = new Leaderboard({ name, points });
    await user.save();

    res.status(201).json({
      message: "User added to leaderboard",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
