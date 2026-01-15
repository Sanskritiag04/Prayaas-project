import { useState } from "react";
import ".NGODashboard.css";

export default function NGODashboard() {
  const [filter, setFilter] = useState("upcoming");

  const upcomingEvents = [
    { id: 1, title: "Tree Plantation Drive", date: "20 Feb 2026" },
    { id: 2, title: "Health Checkup Camp", date: "5 Mar 2026" },
    { id: 3, title: "Education Workshop", date: "18 Mar 2026" }
  ];

  const pastEvents = [
    { id: 4, title: "Blood Donation Camp", date: "10 Jan 2026" },
    { id: 5, title: "Cleanliness Drive", date: "22 Dec 2025" }
  ];

  const eventsToShow =
    filter === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="ngo-dashboard">

      {/* LEFT 1/4 SECTION */}
      <div className="ngo-left">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="NGO"
          className="ngo-photo"
        />

        <h3>Prayaas Foundation</h3>
        <p className="ngo-category">Category: Education & Health</p>

        <button className="edit-btn">Edit NGO Details</button>

        <p className="status verified">✔ Verified</p>
      </div>

      {/* RIGHT 3/4 SECTION */}
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

          <button className="post-btn">+ Post Event</button>
        </div>

        {/* Events List */}
        <div className="events-list">
          {eventsToShow.map((event) => (
            <div className="event-card" key={event.id}>
              <h4>{event.title}</h4>
              <p>{event.date}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
