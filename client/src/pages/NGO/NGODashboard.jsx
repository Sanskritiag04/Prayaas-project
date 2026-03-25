import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NGODashboard.css";

export default function NGODashboard() {

  const [filter, setFilter] = useState("upcoming");
  const navigate = useNavigate();
  const [ngo, setNgo] = useState(null);
  const [events, setEvents] = useState([]);

  // const [volunteers, setVolunteers] = useState([]);
  // const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ FETCH NGO DATA
    axios.get("http://localhost:5000/api/ngo/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      //console.log("NGO DATA:", res.data.ngo); // 🔍 DEBUG
      setNgo(res.data.ngo);
    })
    .catch(() => navigate("/login"));

    // ✅ FETCH EVENTS
    axios.get("http://localhost:5000/api/events/ngo-events", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setEvents(res.data))
    .catch(err => console.log(err));

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // ============================
  // FETCH VOLUNTEERS
  // ============================
  // const handleViewVolunteers = async (eventId) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const res = await axios.get(
  //       `http://localhost:5000/api/event-registration/event/${eventId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` }
  //       }
  //     );

  //     setVolunteers(res.data);
  //     setSelectedEvent(eventId);

  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // ============================
  // MARK ATTENDANCE
  // ============================
  // const markAttendance = async (registrationId, status) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     await axios.put(
  //       "http://localhost:5000/api/event-registration/attendance",
  //       {
  //         registrationId,
  //         attended: status
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` }
  //       }
  //     );

  //     setVolunteers(prev =>
  //       prev.map(v =>
  //         v._id === registrationId ? { ...v, attended: status } : v
  //       )
  //     );

  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div className="ngo-dashboard">

      {/* LEFT */}
      <div className="ngo-left">

        {/* ✅ PROFILE IMAGE FIXED */}
        <img
          src={
            ngo?.photo
              ? `http://localhost:5000${ngo.photo}`
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="NGO"
          className="ngo-photo"
          onError={(e) => {
            e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
          }}
        />

        <h3>{ngo?.ngoName || "NGO Name"}</h3>

        <button
          className="edit-btn"
          onClick={() => navigate("/ngo/edit-profile")}
        >
          Edit NGO Details
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>

      {/* RIGHT */}
      <div className="ngo-right">

        {/* FILTER */}
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

          <button
            className="post-btn"
            onClick={() => navigate("/ngo/post-event")}
          >
            + Post Event
          </button>

        </div>

        {/* EVENTS */}
        <div className="events-list">

          {events
            .filter(e => e.status === filter)
            .map(event => (

              <div className="event-card" key={event._id}>

                {/* ✅ EVENT IMAGE SAFE */}
                <img
                  src={`http://localhost:5000${event.image}`}
                  alt={event.title}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200";
                  }}
                />

                <div className="event-info">

                  <h3>{event.title}</h3>

                  <p>📍 {event.location}</p>

                  <p>
                    📅 {new Date(event.start_date).toLocaleDateString()}
                  </p>

                  <p>Status: {event.status}</p>

                  <button
  className="view-btn"
  onClick={() => navigate(`/ngo/volunteers/${event._id}`)}
>
  See Volunteers
</button>

                </div>

              </div>

          ))}

        </div>

      </div>

    </div>
  );
}