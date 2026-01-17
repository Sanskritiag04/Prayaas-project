import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./EditProfile.css";

export default function EditProfile() {
  const navigate= useNavigate();
  const [form, setForm] = useState({});
  const [editable, setEditable] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/volunteer/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => setForm(res.data));
  }, []);

  const enableEdit = (field) => {
    setEditable({ ...editable, [field]: true });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/volunteer/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      alert("Profile updated successfully");
      navigate("/dashboard")
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="edit-profile-container">
       
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        {["name", "phone", "age", "city", "state", "pincode"].map(field => (
          <div key={field} className="edit-row">
            <label>{field.toUpperCase()}</label>

            <input
              name={field}
              value={form[field] || ""}
              disabled={!editable[field]}
              onChange={handleChange}
            />

            <span className="edit-icon" onClick={() => enableEdit(field)}>
              ✏️
            </span>
          </div>
        ))}

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
