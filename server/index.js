const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/ngo", require("./routes/ngo"));
app.use("/api/events", require("./routes/events"));
app.use("/api/volunteer", require("./routes/volunteer"));
app.use("/api/admin", require("./routes/admin"));
app.use("/uploads", express.static("uploads"));
app.use("/api/event-registration", require("./routes/eventRegistration"));


mongoose.connect("mongodb://127.0.0.1:27017/prayaas")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");

const createFirstAdmin = async () => {
  const hashed = await bcrypt.hash("admin123", 10);
  await Admin.create({
    email: "prayaas59@gmail.com",
    password: hashed
  });
  console.log("Admin Created!");
};
//createFirstAdmin();

// mongoose.connect(
//   "mongodb+srv://sanskritiag04:%23iti0405@cluster0.1raolau.mongodb.net/?appName=Cluster0/prayaasDB"
// )
// .then(() => console.log("MongoDB Atlas Connected"))
// .catch(err => console.log(err));
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
