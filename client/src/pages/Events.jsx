import { useEffect, useState } from "react";
import axios from "axios";
import "./Events.css";

export default function Events() {

  const [type, setType] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activeEvent, setActiveEvent] = useState(null);

  // LOAD EVENTS
  useEffect(() => {

    axios
      .get(`http://localhost:5000/api/events/${type}`)
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
      axios.get(`http://localhost:5000/api/events/trending`)
      .then(res => setTrending(res.data))
      .catch(err => console.log(err));

  }, [type]);


  // REGISTER FOR EVENT
  const handleRegister = async () => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "volunteer") {
      alert("Please login as a volunteer first");
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

      // close popup after register
      setActiveEvent(null);

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Registration failed"
      );

    }

  };

  const handleReport = async (eventId) => {
  const reason = prompt("Why are you reporting this event?");
  if (!reason) return;

  try {
    await axios.post(`http://localhost:5000/api/events/report-event/${eventId}`, 
      { reason }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    alert("Reported successfully.");
  } catch (err) {
    alert("Error reporting event.");
  }
};

const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "All" || e.event_type === category;
    return matchesSearch && matchesCategory;
  });

//   return (
//     <>

//       <div className={`events-page ${activeEvent ? "blurred" : ""}`}>

//         <h1 className="events-heading">Discover Events</h1>

//         <p className="events-subheading">
//           Join hands, make an impact, and be the reason for someone’s smile.
//         </p>


//         {/* FILTER BUTTONS */}

//         <div className="event-filters">

//           <button
//             className={type === "upcoming" ? "active" : ""}
//             onClick={() => setType("upcoming")}
//           >
//             Upcoming Events
//           </button>

//           <button
//             className={type === "past" ? "active" : ""}
//             onClick={() => setType("past")}
//           >
//             Past Events
//           </button>

//         </div>


//         {/* EVENTS LIST */}

//         <div className="events-container">

//           {events.map((event) => (

//             <div className="event-card" key={event._id}>

//               <img
//                 src={`http://localhost:5000${event.image}`}
//                 alt={event.title}
//               />

//               <div className="event-info">

//                 <h3>{event.title}</h3>

//                 <p>📍 {event.location}</p>

//                 <p>
//                   📅 {new Date(event.start_date).toLocaleDateString()}
//                 </p>

//                 <button
//                   className="details-btn"
//                   onClick={() => setActiveEvent(event)}
//                 >
//                   View Details
//                 </button>

//               </div>

//             </div>

//           ))}

//         </div>

//       </div>


//       {/* EVENT DETAILS POPUP */}

//       {activeEvent && 
//         (() => {

//   const registrationClosed =
//     new Date() > new Date(activeEvent.registration_deadline);

//   return (

//         <div className="event-overlay">

//           <div className="expanded-card">

//             <button
//               className="close-btn"
//               onClick={() => setActiveEvent(null)}
//             >
//               ✕
//             </button>

//             <img
//               src={`http://localhost:5000${activeEvent.image}`}
//               alt={activeEvent.title}
//             />

//             <div className="expanded-content">

//               <span className="event-type">
//                 {activeEvent.event_type}
//               </span>

//               <h2>{activeEvent.title}</h2>

//               <p className="description">
//                 {activeEvent.description}
//               </p>

//               <div className="meta">
//   <p>
//     <strong>🏢 Hosted By:</strong> {activeEvent.ngo_id?.ngoName || "Prayaas Partner"}
//   </p>
//   <p>
//     <strong>📍 Location:</strong> {activeEvent.location}
//   </p>
//   <p>
//     <strong>📅 Registration Deadline:</strong>{" "}
//     <span style={{ color: registrationClosed ? "#dc3545" : "#2e8b57", fontWeight: "bold" }}>
//       {new Date(activeEvent.registration_deadline).toDateString()}
//     </span>
//   </p>
//   <p>
//     <strong>📅 Event Starts:</strong>{" "}
//     {new Date(activeEvent.start_date).toDateString()}
//   </p>
//   {activeEvent.end_date && (
//     <p>
//       <strong>📅 Event Ends:</strong>{" "}
//       {new Date(activeEvent.end_date).toDateString()}
//     </p>
//   )}
//   <p>
//     <strong>Status:</strong> {activeEvent.status}
//   </p>
// </div>


//               {/* REGISTER BUTTON */}

//               <div className="action-row">
//   {type === "upcoming" && (
//     <button
//       className={`register-btn ${registrationClosed ? "disabled" : ""}`}
//       onClick={handleRegister}
//       disabled={registrationClosed}
//     >
//       {registrationClosed ? "Registration Closed" : "Register as Volunteer"}
//     </button>
//   )}

//   <button 
//     className="report-btn-styled" 
//     onClick={() => handleReport(activeEvent._id)}
//   >
//     🚩 Report Event
//   </button>
// </div>

//             </div>

//           </div>

//         </div>
//   )})()}

//     </>
//   );
// }

return (
    <>
      <div className={`events-page ${activeEvent ? "blurred" : ""}`}>
        <h1 className="events-heading">Discover Events</h1>
        <p className="events-subheading">
          Join hands, make an impact, and be the reason for someone’s smile.
        </p>

        {/* UPCOMING/PAST TABS */}
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

        {/* 🔍 SEARCH & CATEGORY FILTERS (Moved below tabs) */}
        <div className="filter-controls">
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Search by title or location..." 
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="category-select" onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
            <option value="Health">Health</option>
            <option value="Food">Food</option>
            <option value="Animal Welfare">Animal Welfare</option>
          </select>
        </div>

        {/* 📅 MAIN EVENTS LIST */}
        <div className="events-container">
          {filteredEvents.length === 0 ? (
            <p className="no-results">No events found matching your criteria.</p>
          ) : (
            filteredEvents.map((event) => {
              // Check if this specific event is in the trending list
              const isTrending = trending.some(t => t._id === event._id);

              return (
                <div className={`event-card ${isTrending ? "trending-highlight" : ""}`} key={event._id}>
                  {isTrending && <div className="trending-fire-badge">🔥 Trending</div>}
                  
                  <img
                    src={`http://localhost:5000${event.image}`}
                    alt={event.title}
                  />
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p>📍 {event.location}</p>
                    <p>📅 {new Date(event.start_date).toLocaleDateString()}</p>
                    <button
                      className="details-btn"
                      onClick={() => setActiveEvent(event)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 🖼️ EVENT DETAILS POPUP */}
      {activeEvent && 
        (() => {
          const registrationClosed = new Date() > new Date(activeEvent.registration_deadline);

          return (
            <div className="event-overlay">
              <div className="expanded-card">
                <button className="close-btn" onClick={() => setActiveEvent(null)}>✕</button>
                <img src={`http://localhost:5000${activeEvent.image}`} alt={activeEvent.title} />
                <div className="expanded-content">
                  <span className="event-type">{activeEvent.event_type}</span>
                  <h2>{activeEvent.title}</h2>
                  <p className="description">{activeEvent.description}</p>
                  <div className="meta">
                    <p><strong>🏢 Hosted By:</strong> {activeEvent.ngo_id?.ngoName || "Prayaas Partner"}</p>
                    <p><strong>📍 Location:</strong> {activeEvent.location}</p>
                    <p><strong>📅 Deadline:</strong>{" "}
                      <span style={{ color: registrationClosed ? "#dc3545" : "#2e8b57", fontWeight: "bold" }}>
                        {new Date(activeEvent.registration_deadline).toDateString()}
                      </span>
                    </p>
                    <p><strong>📅 Starts:</strong> {new Date(activeEvent.start_date).toDateString()}</p>
                  </div>

                  <div className="action-row">
                    {type === "upcoming" && (
                      <button
                        className={`register-btn ${registrationClosed ? "disabled" : ""}`}
                        onClick={handleRegister}
                        disabled={registrationClosed}
                      >
                        {registrationClosed ? "Registration Closed" : "Register as Volunteer"}
                      </button>
                    )}
                    <button className="report-btn-styled" onClick={() => handleReport(activeEvent._id)}>
                      🚩 Report Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      }
    </>
  );
}