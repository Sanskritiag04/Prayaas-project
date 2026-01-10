import "./EventCard.css";

export default function EventCard({ event }) {
  return (
    <div className="event-card">
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
