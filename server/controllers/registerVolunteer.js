import Volunteer from "../models/volunteer.js";

export const registerVolunteer = async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();

    res.status(201).json({
      message: "Registration successful",
      volunteerId: volunteer.volunteerId
    });

  } catch (err) {
    res.status(400).json({
      message: "Registration failed",
      error: err.message
    });
  }
};
