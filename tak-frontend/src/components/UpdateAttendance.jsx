import React, { useState } from "react";
import axiosInstance from "../AxiosInstance";

const UpdateAttendance = ({ studentId, date, currentStatus,subject, onClose }) => {
  const [status, setStatus] = useState(currentStatus || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (newStatus) => {
    try {
      setLoading(true);
      setError("");

      await axiosInstance.put("/attendance-update", {
        studentId,
        date,
        subject,
        status: newStatus,
      });

      setStatus(newStatus);
   
    } catch (err) {
      setError("Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-attendance-overlay">
      <div className="update-attendance-card">
        <h3>Update Attendance</h3>

        <p>
          <strong>Date:</strong> {new Date(date).toLocaleDateString()}
        </p>
        <p>
          <strong>Current Status:</strong>{" "}
          <span className={`status ${status}`}>
            {status || "Not Marked"}
          </span>
        </p>

        <div className="attendance-buttons">
          <button
            className="btn present"
            disabled={loading}
            onClick={() => handleUpdate("P")}
          >
            P
          </button>

          <button
            className="btn absent"
            disabled={loading}
            onClick={() => handleUpdate("A")}
          >
            A
          </button>

          <button
            className="btn leave"
            disabled={loading}
            onClick={() => handleUpdate("L")}
          >
            L
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UpdateAttendance;
