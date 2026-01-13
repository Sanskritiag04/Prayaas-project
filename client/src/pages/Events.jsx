import { useState } from "react";
import "./Events.css";

export default function Events() {
  const [activeFilter, setActiveFilter] = useState("upcoming");

  const upcomingEvents = [
    { id: 1, title: "Tree Plantation Drive", category: "Environment", date: "25 Jan 2026" },
    { id: 2, title: "Free Health Camp", category: "Healthcare", date: "28 Jan 2026" },
    { id: 3, title: "Teaching Underprivileged Kids", category: "Education", date: "30 Jan 2026" },
    { id: 4, title: "Animal Shelter Volunteering", category: "Animal Welfare", date: "02 Feb 2026" },
    { id: 5, title: "Clean City अभियान", category: "Community Service", date: "05 Feb 2026" },
    { id: 6, title: "Women Skill Workshop", category: "Women Empowerment", date: "10 Feb 2026" }
  ];

  const pastEvents = [
    { id: 7, title: "Blood Donation Camp", category: "Healthcare", date: "10 Dec 2025" },
    { id: 8, title: "Winter Clothes Drive", category: "Social Welfare", date: "18 Dec 2025" },
    { id: 9, title: "Beach Cleanup Drive", category: "Environment", date: "22 Dec 2025" }
  ];

  const eventsToShow =
    activeFilter === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="events-page">

      {/* SIDEBAR */}
      <div className="events-sidebar">
        <h3>Filters</h3>

        <button
          className={activeFilter === "upcoming" ? "active" : ""}
          onClick={() => setActiveFilter("upcoming")}
        >
          Upcoming Events
        </button>

        <button
          className={activeFilter === "past" ? "active" : ""}
          onClick={() => setActiveFilter("past")}
        >
          Past Events
        </button>
      </div>

      {/* EVENTS LIST */}
      <div className="events-content">
        <h2>
          {activeFilter === "upcoming" ? "Upcoming Events" : "Past Events"}
        </h2>

        <div className="events-grid">
          {eventsToShow.map(event => (
            <div className="event-card" key={event.id}>
              <h4>{event.title}</h4>
              <p><strong>Category:</strong> {event.category}</p>
              <p><strong>Date:</strong> {event.date}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
