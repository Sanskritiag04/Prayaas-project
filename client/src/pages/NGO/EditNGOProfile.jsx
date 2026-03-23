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

  const [image, setImage] = useState(null); // ✅ moved inside

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

  const data = new FormData();

  data.append("ngoName", formData.ngoName);
  data.append("state", formData.state);
  data.append("pincode", formData.pincode);

  if (image) {
    data.append("photo", image);
  }

  // ✅ ADD DEBUG HERE
  for (let pair of data.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    await axios.put(
      "http://localhost:5000/api/ngo/profile",
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    alert("Updated successfully");
    navigate("/ngo/dashboard");

  } catch (err) {
    console.log(err.response); // ✅ ALSO ADD THIS
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
          value={formData.ngoName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        />

        {/* ✅ ADD THIS (MOST IMPORTANT) */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}