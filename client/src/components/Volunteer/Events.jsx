import React from 'react';
import './Events.css';

const Events = () => {
  const eventList = [
    { title: "Beach Cleanup Drive", cat: "Environment", pts: "50 pts", img: "https://images.unsplash.com/photo-1618477461853-cf6ed80fbe5e?q=80&w=2070&auto=format&fit=crop" },
    { title: "Food Distribution Camp", cat: "Community", pts: "40 pts", img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" },
    { title: "Tree Plantation Drive", cat: "Environment", pts: "60 pts", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" }
  ];

  return (
    <section className="events-section">
      <div className="section-header">
        <h2>Upcoming <span>Events</span></h2>
        <button className="view-all">View All Events →</button>
      </div>
      <div className="event-grid">
        {eventList.map((ev, i) => (
          <div key={i} className="event-card">
            <div className="card-img" style={{backgroundImage: `url(${ev.img})`}}>
              <span className="cat-tag">{ev.cat}</span>
              <span className="pts-tag">{ev.pts}</span>
            </div>
            <div className="card-content">
              <h3>{ev.title}</h3>
              <p>Join us to make a difference in your city. Your small effort can create a big impact.</p>
              <button className="details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;