import "./EventFilters.css";
import { useNavigate } from "react-router-dom";

export default function EventFilters() {

  const navigate = useNavigate();

  return (
    <div className="filters">

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

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
