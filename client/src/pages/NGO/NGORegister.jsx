import { useState } from "react";
import axios from "axios";
import "./NGORegister.css";

export default function NGORegister() {
  const [form, setForm] = useState({
    ngoName: "",
    email: "",
    pan: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: "",
    panFile: null
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
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
    });
  };

  const validateForm = () => {
    // Email
    if (!form.email.includes("@")) {
      alert("Invalid email");
      return false;
    }

    // PAN (ABCDE1234F)
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panPattern.test(form.pan)) {
      alert("Invalid PAN number format");
      return false;
    }

    // Pincode
    if (!/^\d{6}$/.test(form.pincode)) {
      alert("Pincode must be exactly 6 digits");
      return false;
    }

    // Password rules
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

    if (!passwordPattern.test(form.password)) {
      alert(
        "Password must contain:\n• One letter\n• One digit\n• One special character\n• Min 6 characters"
      );
      return false;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    if (!form.panFile) {
      alert("Please upload PAN card");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ngo/register",
        data
      );
      alert(res.data.message);
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

        <label>PAN Number</label>
        <input
          name="pan"
          placeholder="ABCDE1234F"
          onChange={handleChange}
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
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          onChange={handleChange}
          required
        />

        <label>Upload PAN CARD</label>
        <input
          type="file"
          name="panFile"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
          required
        />

        <button type="submit">Register NGO</button>
      </form>
    </div>
  );
}
