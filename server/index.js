const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
// app.use("/api/ngo", require("./routes/ngo"));
app.use("/api/events", require("./routes/events"));
app.use("/api/volunteer", require("./routes/volunteer"));
app.use("/uploads", express.static("uploads"));
app.use("/api/event-registration", require("./routes/eventRegistration"));
app.use("/uploads", express.static("uploads"));




/* 🔗 MongoDB Connection */
mongoose.connect("mongodb://127.0.0.1:27017/prayaas")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
