import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./VolunteersPage.css";

export default function VolunteersPage() {
  const { eventId } = useParams();

  const [volunteers, setVolunteers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [certificatesIssued, setCertificatesIssued] = useState(false);

  // ================= FETCH DATA =================
  useEffect(() => {
    const token = localStorage.getItem("token");

    // fetch volunteers
    axios
      .get(`http://localhost:5000/api/event-registration/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setVolunteers(res.data));

    // fetch event status
    axios
  .get(`http://localhost:5000/api/events/details/${eventId}`)
  .then(res => {
    if (res.data.attendanceSubmitted)
      setSubmitted(true);

    if (res.data.certificatesIssued)
      setCertificatesIssued(true);
  });

  }, [eventId]);

  // ================= MARK PRESENT (ONLY UI) =================
  const handleMarkPresent = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // ================= SUBMIT ALL =================
  const handleSubmitAttendance = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5000/api/event-registration/attendance-bulk",
        {
          attendance,
          eventId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("✅ Attendance submitted!");

      setSubmitted(true);

      // update UI
      setVolunteers(prev =>
        prev.map(v =>
          attendance[v._id]
            ? { ...v, attended: true }
            : v
        )
      );

      setAttendance({});

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

const handleIssueCertificates = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.put(
      `http://localhost:5000/api/event-registration/issue-certificates/${eventId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert(res.data.message);
    setCertificatesIssued(true);

  } catch (err) {
    alert("Certificate issuing failed");
  }
};

  // ================= UI =================
  return (
    <div className="volunteers-container">
      <h2>Volunteers List</h2>

      {volunteers.map(v => (
        <div key={v._id} className="volunteer-card">

          <div className="volunteer-info">
            <span>{v.v_id?.name}</span>
            <small>{v.v_id?.email}</small>
          </div>

          {/* BUTTON STATES */}
          {v.attended ? (
            <span className="present-tag">✔ Present</span>

          ) : attendance[v._id] ? (
            <span className="selected-tag">✔ Selected</span>

          ) : (
            <button
              className="mark-btn"
              onClick={() => handleMarkPresent(v._id)}
              disabled={submitted}
            >
              Mark Present
            </button>
          )}

        </div>
      ))}

      {/* ACTION BUTTONS */}
      <div className="action-buttons">

        <button
          className="submit-btn"
          onClick={handleSubmitAttendance}
          disabled={submitted || Object.keys(attendance).length === 0}
        >
          {submitted ? "Submitted ✔" : "Submit Attendance"}
        </button>

        {submitted && (
          <button
  className="certificate-btn"
  onClick={handleIssueCertificates}
  disabled={certificatesIssued}
>
  {certificatesIssued ? "Certificates Issued ✔" : "Issue Certificates"}
</button>
        )}

      </div>
    </div>
  );
}