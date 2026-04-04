import { useState, useEffect } from "react";
import axios from "axios";
import "./Leaderboard.css";
import NavbarDashboard from "../components/common/NavbarDashboard";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/volunteer/leaderboard")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  const getBadgeName = (points) => {
    if (points >= 500) return "Community Hero";
    if (points >= 200) return "Pro Philanthropist";
    if (points >= 50) return "Active Volunteer";
    return "Beginner";
  };

  return (
    <div className="leaderboard-container">
      {/* <NavbarDashboard/> */}
      <h2>Volunteer Leaderboard</h2>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Volunteer Name</th>
            <th>Total Points</th>
            <th>Current Rank</th>
          </tr>
        </thead>

        <tbody>
          {users
            .sort((a, b) => b.points - a.points)
            .map((user, index) => {
              const badgeName = getBadgeName(user.points || 0);
              const badgeClass = badgeName.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <tr key={user._id} className={index === 0 ? "top-rank" : ""}>
                  <td className="rank-cell">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </td>
                  <td className="name-cell">
                    <strong>{user.name}</strong>
                  </td>
                  <td className="points-cell">
                    <span className="points-pill">{user.points || 0} pts</span>
                  </td>
                  <td>
                    <span className={`badge-pill ${badgeClass}`}>
                      {badgeName}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
