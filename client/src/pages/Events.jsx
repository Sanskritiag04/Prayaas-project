import "./Events.css";
import EventCard from "../components/Events/EventCard";
import EventFilters from "../components/Events/EventFilters";

const events = [
  {
    id: 1,
    title: "Beach Cleanup Drive",
    category: "Environment",
    points: 50,
    date: "Thu, Jan 15 at 8:00 AM",
    location: "Marina Beach, Chennai",
    volunteers: "45/100",
    image: "/event1.jpg",
    org: "Clean Earth Foundation"
  },
  {
    id: 2,
    title: "Food Distribution Camp",
    category: "Community",
    points: 40,
    date: "Tue, Jan 20 at 10:00 AM",
    location: "Community Center, Delhi",
    volunteers: "30/50",
    image: "/event2.jpg",
    org: "Feeding India"
  },
  {
    id: 3,
    title: "Tree Plantation Drive",
    category: "Environment",
    points: 60,
    date: "Sun, Jan 25 at 7:00 AM",
    location: "City Forest Park, Bangalore",
    volunteers: "80/150",
    image: "/event3.jpg",
    org: "Green Warriors"
  }
];

export default function Events() {
  return (
    <div className="events-page">
      <h1>Discover <span>Events</span></h1>
      <p className="subtitle">
        Find volunteer opportunities that match your interests and availability.
      </p>

      <EventFilters />

      <div className="event-grid">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
