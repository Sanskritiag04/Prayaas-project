import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditNGOProfile.css";

export default function EditNGOProfile() {
  const [formData, setFormData] = useState({
    ngoName: "",
    state: "",
    pincode: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/ngo/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setFormData({
          ngoName: res.data.ngo.ngoName,
          state: res.data.ngo.state,
          pincode: res.data.ngo.pincode
        });
      })
      .catch(() => navigate("/login"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:5000/api/ngo/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Profile updated successfully");
      navigate("/ngo/dashboard");

    } catch (error) {
      alert("Update failed");
    }
  };

  return (
    <div className="edit-ngo-container">
      <form className="edit-ngo-form" onSubmit={handleSubmit}>
        <h2>Edit NGO Profile</h2>

        <input
          type="text"
          name="ngoName"
          placeholder="NGO Name"
          value={formData.ngoName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}