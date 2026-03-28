import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

export default function NGORegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [panFile, setPanFile] = useState(null);

  const [form, setForm] = useState({
    ngoName: "",
    email: "",
    registrationId: "",
    panNumber: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: ""
  });

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar",
    "Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh",
    "Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
    "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
    "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
  const namePattern = /^(?![0-9]+$)[A-Za-z0-9\s.-]{3,}$/;
  if (!namePattern.test(form.ngoName.trim())) {
    alert("NGO Name must be at least 3 characters and cannot be only numbers.");
    return false;
  }

  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panPattern.test(form.panNumber.toUpperCase().trim())) {
    alert("Invalid PAN Number format (e.g., ABCDE1234F)");
    return false;
  }

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return false;
  }

  return true;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append("ngoName", form.ngoName);
    formData.append("email", form.email.trim().toLowerCase());
    formData.append("registrationId", form.registrationId.trim());
    formData.append("panNumber", form.panNumber.toUpperCase().trim());
    formData.append("state", form.state);
    formData.append("pincode", form.pincode);
    formData.append("password", form.password);
    formData.append("confirmPassword", form.confirmPassword);
    formData.append("panCard", panFile);

    try {
      await axios.post("http://localhost:5000/api/ngo/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("NGO Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="ngo-register-container">
      <h2>NGO Registration</h2>

      <form onSubmit={handleSubmit}>
        <label>NGO Name</label>
        <input name="ngoName" onChange={handleChange} required />

        <label>Email</label>
        <input name="email" onChange={handleChange} required />

        <label>Registration ID</label>
        <input name="registrationId" onChange={handleChange} required />

        <label>PAN Number</label>
        <input
          name="panNumber"
          placeholder="ABCDE1234F"
          onChange={handleChange}
          required
        />
        <label>Upload PAN Card (JPG/PNG)</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setPanFile(e.target.files[0])} 
          required 
        />

        <label>State</label>
        <select name="state" onChange={handleChange} required>
          <option value="">Select State</option>
          {states.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>

        <label>Pincode</label>
        <input
          name="pincode"
          type="number"
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <label>Confirm Password</label>
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Register NGO</button>
      </form>
    </div>
  );
}
