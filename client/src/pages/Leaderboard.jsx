import { useState } from "react";
 import { useEffect} from "react";
import axios from "axios";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/volunteer/leaderboard")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  // Badge logic
  const getBadge = (points) => {
    if (points >= 150) return "Elite";
    if (points >= 80) return "Intermediate";
    return "Beginner";
  };

  return (
    <div className="leaderboard-container">

      <h2>Volunteer Leaderboard</h2>

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
              <tr key={user._id}>
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
