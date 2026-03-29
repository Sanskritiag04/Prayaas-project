import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PostEvent.css";

export default function PostEvent() {

  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "",
    start_date: "",
    end_date: "",
    registration_deadline: "",
    location: "",
    status: "upcoming"
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const data = new FormData();

    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    data.append("image", image);
//     const ngo_id = localStorage.getItem("ngo_id");
// data.append("ngo_id", ngo_id);

    try {

      await axios.post(
        "http://localhost:5000/api/events/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Event created successfully");

      navigate("/ngo/dashboard");

    } catch (err) {
      console.log(err);
      alert("Failed to create event");
    }
  };

  return (

    <div className="post-event-container">

      <div className="post-event-card">

        <h2>Create New Event</h2>

        <form onSubmit={handleSubmit}>

          <label>Event Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter event title"
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe the event"
            onChange={handleChange}
            required
          />

          <label>Event Type</label>
          <select name="event_type" onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="environment">Environment</option>
            <option value="food">Food</option>
            <option value="animal_welfare">Animal Welfare</option>
            <option value="other">Other</option>
          </select>

          <label>Start Date</label>
          <input
  type="date"
  name="start_date"
  min={today}
  onChange={handleChange}
  required
/>

          <label>End Date</label>
          <input
  type="date"
  name="end_date"
  min={formData.start_date || today}
  onChange={handleChange}
  required
/>

<label>Registration Deadline</label>
<input
  type="date"
  name="registration_deadline"
  min={today}
  max={formData.start_date || ""}
  onChange={handleChange}
  required
/>

          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            onChange={handleChange}
            required
          />

          {/* <label>Status</label>
          <select name="status" onChange={handleChange}>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select> */}

          <label>Event Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          <button type="submit" className="create-btn">
            Create Event
          </button>

        </form>

      </div>

    </div>
  );
}