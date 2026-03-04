import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NGODashboard.css";

export default function NGODashboard() {
  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();
  const [ngo, setNgo] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
    navigate("/login");
    return;
  }
    axios.get("http://localhost:5000/api/ngo/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setNgo(res.data.ngo))
    .catch(() => navigate("/login"));

    axios.get("http://localhost:5000/api/events/ngo-events", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(res => setEvents(res.data))
.catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  navigate("/login");
};

  // const upcomingEvents = [
  //   { id: 1, title: "Tree Plantation Drive", date: "20 Feb 2026" },
  //   { id: 2, title: "Health Checkup Camp", date: "5 Mar 2026" },
  //   { id: 3, title: "Education Workshop", date: "18 Mar 2026" }
  // ];

  // const pastEvents = [
  //   { id: 4, title: "Blood Donation Camp", date: "10 Jan 2026" },
  //   { id: 5, title: "Cleanliness Drive", date: "22 Dec 2025" }
  // ];

  // const eventsToShow =
  //   filter === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="ngo-dashboard">

      <div className="ngo-left">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="NGO"
          className="ngo-photo"
        />

        <h3>{ngo?.ngoName}</h3>
        <p className="ngo-category">Category: Education & Health</p>

       <button
  className="edit-btn"
  onClick={() => navigate("/ngo/edit-profile")}
>
  Edit NGO Details
</button>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <p className="status verified">✔ Verified</p>
      </div>

      <div className="ngo-right">

        {/* Top Bar */}
        <div className="ngo-topbar">
          <div className="filters">
            <button
              className={filter === "upcoming" ? "active" : ""}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming Events
            </button>

            <button
              className={filter === "past" ? "active" : ""}
              onClick={() => setFilter("past")}
            >
              Past Events
            </button>
          </div>

          <button className="post-btn" onClick={() => navigate("/ngo/post-event")}>+ Post Event</button>
        </div>

        {/* Events List */}
        <div className="events-list">
  {events
    .filter(e => e.status === filter)
    .map(event => (
      <div className="event-card" key={event._id}>
        <img
          src={`http://localhost:5000${event.image}`}
          alt={event.title}
        />

        <div className="event-info">
          <h3>{event.title}</h3>

          <p>📍 {event.location}</p>

          <p>
            📅 {new Date(event.start_date).toLocaleDateString()}
          </p>

          <p>Status: {event.status}</p>
        </div>
      </div>
  ))}
</div>
      </div>

    </div>
  );
}
