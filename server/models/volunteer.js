const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  volunteerId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true }
});

/* Auto generate ID before saving */
volunteerSchema.pre("save", async function (next) {
  if (!this.volunteerId) {
    const count = await mongoose.model("Volunteer").countDocuments();
    this.volunteerId = "VOL" + (count + 1).toString().padStart(4, "0");
  }
  next();
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
