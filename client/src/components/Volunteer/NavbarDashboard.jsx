import "./NavbarDashboard.css";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function NavbarDashboard({ activeView, setActiveView }) {
  return (
    <nav className="dash-navbar">
      <div className="nav-left">Prayaas</div>

      <div className="nav-center">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/community">Community Feed</Link>
        <Link to="/events">Events</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>

      <div className="nav-right">
        <FaUserCircle size={26} />
      </div>
    </nav>
  );
}
