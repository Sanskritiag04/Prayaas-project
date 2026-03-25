const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    reg_id: {
      type: String,
      required: true,
      unique: true
    },

    v_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      required: true
    },

    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    attended: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered"
    },
    certificate: {
  type: String,   // file path or URL
  default: null
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
