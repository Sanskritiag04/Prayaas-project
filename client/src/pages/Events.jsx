import { useEffect, useState } from "react";
import axios from "axios";
import "./Events.css";

export default function Events() {
  const [type, setType] = useState("upcoming");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/${type}`)
      .then(res => setEvents(res.data));
  }, [type]);

  return (
    <div className="events-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>Filters</h3>
        <button onClick={() => setType("upcoming")}>Upcoming Events</button>
        <button onClick={() => setType("past")}>Past Events</button>
      </div>

      {/* EVENTS */}
      <div className="events-list">
        <h2>{type === "upcoming" ? "Upcoming Events" : "Past Events"}</h2>

        {events.map((e, i) => (
          <div className="event-card" key={i}>
            <img src={e.image} alt={e.title} />
            <div className="event-info">
              <h3>{e.title}</h3>
              <p><b>Category:</b> {e.category}</p>
              <p><b>Date:</b> {e.date}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
