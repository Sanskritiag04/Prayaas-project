import { useState, useEffect } from "react";
import axios from "axios";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [msg, setMsg] = useState("");

  // ⏱ TIMER
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const sendOtp = async () => {
    const url =
      role === "volunteer"
        ? "http://localhost:5000/api/volunteer/forgot-password"
        : "http://localhost:5000/api/ngo/forgot-password";

    const res = await axios.post(url, { email });
    setMsg(res.data.message);
    setStep(2);
  };

  const verifyOtp = async () => {
    const url =
      role === "volunteer"
        ? "http://localhost:5000/api/volunteer/verify-otp"
        : "http://localhost:5000/api/ngo/verify-otp";

    const res = await axios.post(url, { email, otp });
    setMsg(res.data.message);
  };

  return (
    <div className="login-card">
      <h2>Forgot Password</h2>

      {step === 1 && (
        <>
          <div className="role-toggle">
            <button onClick={() => setRole("volunteer")}>Volunteer</button>
            <button onClick={() => setRole("ngo")}>NGO</button>
          </div>

          {role && (
            <>
              <input
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button onClick={sendOtp}>Send OTP</button>
            </>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <p>⏱ {timeLeft}s remaining</p>
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      <p>{msg}</p>
    </div>
  );
}
