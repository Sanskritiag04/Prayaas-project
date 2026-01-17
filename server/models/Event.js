const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    // IDS
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true
    },

    // BASIC INFO
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    event_type: {
      type: String, // environment, education, health, etc.
      required: true
    },

    // DATES
    start_date: {
      type: Date,
      required: true
    },

    end_date: {
      type: Date,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    // STATUS DECIDES UPCOMING / PAST
    status: {
      type: String,
      enum: ["upcoming", "past"],
      required: true
    },

    // IMAGE (DO NOT REMOVE)
    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
