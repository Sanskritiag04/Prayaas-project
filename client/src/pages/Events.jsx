import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Events.css";

export default function Events() {
  const navigate = useNavigate();
  const [type, setType] = useState("upcoming");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/events/${type}`)
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, [type]);

  return (
    <div className="events-page">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

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
        {events.map(event => (
          <div className="event-card" key={event._id}>
            <img src={event.image} alt={event.name} />

            <div className="event-info">
              <h3>{event.name}</h3>
              <p>{event.date}</p>
              <button className="details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
