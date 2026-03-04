import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PostEvent.css";

export default function PostEvent() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "",
    start_date: "",
    end_date: "",
    location: "",
    status: "upcoming"
  });

  const [image, setImage] = useState(null);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // HANDLE IMAGE
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // HANDLE SUBMIT
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
          </select>

          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            onChange={handleChange}
            required
          />

          <label>End Date</label>
          <input
            type="date"
            name="end_date"
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

          <label>Status</label>
          <select name="status" onChange={handleChange}>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>

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