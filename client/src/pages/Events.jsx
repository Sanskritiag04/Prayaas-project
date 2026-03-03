import { useEffect, useState } from "react";
import axios from "axios";
import "./Events.css";

export default function Events() {
  const [type, setType] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/events/${type}`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, [type]);

 const handleRegister = async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
console.log("Active event:", activeEvent);
console.log("Event ID:", activeEvent?._id);
  if (!token || role !== "volunteer") {
    alert("Please login first");
    return;
  }

  const confirmRegister = window.confirm(
    "Do you want to register for this event?"
  );
  if (!confirmRegister) return;

  try {
    await axios.post(
      "http://localhost:5000/api/event-registration/register",
      { event_id: activeEvent._id },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Registered successfully");
  } catch (err) {
    alert(err.response?.data?.message || "Registration failed");
  }
};

  return (
    <>
      <div className={`events-page ${activeEvent ? "blurred" : ""}`}>
        <h1 className="events-heading">Discover Events</h1>
        <p className="events-subheading">
          Join hands, make an impact, and be the reason for someone’s smile.
        </p>

        <div className="event-filters">
          <button
            className={type === "upcoming" ? "active" : ""}
            onClick={() => setType("upcoming")}
          >
            Upcoming Events
          </button>

          <button
            className={type === "past" ? "active" : ""}
            onClick={() => setType("past")}
          >
            Past Events
          </button>
        </div>

        <div className="events-container">
          {events.map((event) => (
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

                <button
                  className="details-btn"
                  onClick={() => setActiveEvent(event)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeEvent && (
        <div className="event-overlay">
          <div className="expanded-card">
            <button
              className="close-btn"
              onClick={() => setActiveEvent(null)}
            >
              ✕
            </button>

            <img
              src={`http://localhost:5000${activeEvent.image}`}
              alt={activeEvent.title}
            />

            <div className="expanded-content">
              <span className="event-type">{activeEvent.event_type}</span>
              <h2>{activeEvent.title}</h2>

              <p className="description">
                {activeEvent.description}
              </p>

              <div className="meta">
                <p><strong>📍 Location:</strong> {activeEvent.location}</p>
                <p><strong>📅 Start:</strong> {new Date(activeEvent.start_date).toDateString()}</p>

                {activeEvent.end_date && (
                  <p><strong>📅 End:</strong> {new Date(activeEvent.end_date).toDateString()}</p>
                )}

                <p><strong>Status:</strong> {activeEvent.status}</p>
              </div>

              {type === "upcoming" && (
                <button className="register-btn" onClick={handleRegister}>
                  Register as Volunteer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


