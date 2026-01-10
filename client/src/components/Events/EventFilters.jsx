import "./EventFilters.css";

export default function EventFilters() {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search events by name, description, or location..."
      />

      <div className="filter-buttons">
        <button className="active">All</button>
        <button>Environment</button>
        <button>Community</button>
        <button>Education</button>
        <button>Health</button>
      </div>
    </div>
  );
}
