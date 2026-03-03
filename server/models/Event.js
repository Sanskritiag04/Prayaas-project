const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true
    },
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
    status: {
      type: String,
      enum: ["upcoming", "past"],
      required: true
    },
    image: {
      type: String,
      required: true
    },
//     max_volunteers: {
//   type: Number,
//   required: true
// },

// current_volunteers: {
//   type: Number,
//   default: 0
// }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
