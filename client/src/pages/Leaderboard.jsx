import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

export default function Leaderboard() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([
    { id: 1, name: "Amit", points: 90 },
    { id: 2, name: "Amisha", points: 40 },
    { id: 3, name: "Rahul", points: 20 }
  ]);

  // Badge logic
  const getBadge = (points) => {
    if (points >= 80) return "Elite";
    if (points >= 40) return "Intermediate";
    return "Beginner";
  };

  return (
    <div className="leaderboard-container">

      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>🏆 Volunteer Leaderboard</h2>

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
            <th>Badge</th>
          </tr>
        </thead>

        <tbody>
          {users
            .sort((a, b) => b.points - a.points)
            .map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.points}</td>
                <td>
                  <span className={`badge ${getBadge(user.points).toLowerCase()}`}>
                    {getBadge(user.points)}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

    </div>
  );
}
