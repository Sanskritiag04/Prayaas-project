const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const volunteerRoutes = require("./routes/volunteer");

const app = express();
app.use(cors());
app.use(express.json());

/* 🔗 MongoDB Connection */
mongoose.connect("mongodb://127.0.0.1:27017/prayaas")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/volunteer", volunteerRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
