import "./EventCard.css";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {

  const navigate = useNavigate();

  return (
    <div className="event-card">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <img src={event.image} alt={event.title} />

      <div className="event-body">
        <span className="category">{event.category}</span>
        <span className="points">{event.points} pts</span>

        <h3>{event.title}</h3>
        <p>{event.date}</p>
        <p>{event.location}</p>
        <p>{event.volunteers} volunteers</p>

        <div className="progress">
          <div className="progress-bar"></div>
        </div>

        <div className="event-footer">
          <span>by {event.org}</span>
          <button>View Details</button>
        </div>
      </div>
    </div>
  );
}
