import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();
  // Initialize with empty strings to prevent uncontrolled input errors
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [editable, setEditable] = useState({});

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/volunteer/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      const userData = res.data.volunteer || res.data;
      
      //console.log("Setting form with:", userData);
      
      setForm({
        name: userData.name || "",
        phone: userData.phone || "",
        age: userData.age || "",
        city: userData.city || "",
        state: userData.state || "",
        pincode: userData.pincode || ""
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };
  fetchProfile();
}, []);

  const enableEdit = (field) => {
    setEditable({ ...editable, [field]: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  //console.log("Data being sent to server:", form); // Check this in your Browser Console
  
  try {
    const token = localStorage.getItem("token");
    await axios.put("http://localhost:5000/api/volunteer/profile", form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Profile updated!");
    navigate("/dashboard");
  } catch (err) {
    console.error("Update failed:", err.response?.data);
    alert("Update failed: " + (err.response?.data?.message || "Check fields"));
  }
};

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {["name", "phone", "age", "city", "state", "pincode"].map((field) => (
          <div key={field} className="edit-row">
            <label>{field.toUpperCase()}</label>
            <div className="input-wrapper">
              <input
                type="text"
                name={field}
                value={form[field] || ""}
                disabled={!editable[field]}
                onChange={handleChange}
                className={editable[field] ? "active-input" : ""}
              />
              <span className="edit-icon" onClick={() => enableEdit(field)}>
                ✏️
              </span>
            </div>
          </div>
        ))}
        <button type="submit" className="save-changes-btn">Save Changes</button>
      </form>
    </div>
  );
}
