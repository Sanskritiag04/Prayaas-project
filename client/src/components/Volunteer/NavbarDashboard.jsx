import "./NavbarDashboard.css";
import { FaUserCircle } from "react-icons/fa";

export default function NavbarDashboard() {
  return (
    <nav className="dash-navbar">
      <div className="nav-left">Prayaas</div>

      <div className="nav-center">
        <a href="/events">Events</a>
        <a href="/leaderboard">Leaderboard</a>
      </div>

      <div className="nav-right">
        <FaUserCircle size={26} />
      </div>
    </nav>
  );
}
