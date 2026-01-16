import { useState } from "react";
import axios from "axios";
import "./OTPModal.css";

export default function OTPModal({ role, close }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");

  const baseURL =
    role === "volunteer"
      ? "http://localhost:5000/api/volunteer"
      : "http://localhost:5000/api/ngo";

  const sendOTP = async () => {
    const res = await axios.post(`${baseURL}/forgot-password`, { email });
    setMsg(res.data.message);
    setStep(2);
  };

  const verifyOTP = async () => {
    const res = await axios.post(`${baseURL}/verify-otp`, { email, otp });
    setMsg(res.data.message);
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <button className="close" onClick={close}>✖</button>

        {step === 1 && (
          <>
            <h3>Enter Email</h3>
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <button onClick={sendOTP}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Enter OTP (valid 1 min)</h3>
            <input placeholder="OTP" onChange={e => setOtp(e.target.value)} />
            <button onClick={verifyOTP}>Verify OTP</button>
          </>
        )}

        <p>{msg}</p>
      </div>
    </div>
  );
}
