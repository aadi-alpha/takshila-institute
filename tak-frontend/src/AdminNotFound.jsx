import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "50px",
          borderRadius: "12px",
          textAlign: "center",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            fontSize: "72px",
            margin: "0",
            color: "#2c5364",
          }}
        >
          404
        </h1>

        <h2
          style={{
            marginTop: "10px",
            marginBottom: "15px",
            color: "#333",
          }}
        >
          Page Not Found
        </h2>

        <p
          style={{
            fontSize: "15px",
            color: "#666",
            marginBottom: "30px",
            lineHeight: "1.6",
          }}
        >
          The page you are trying to access does not exist in this Panel.
        </p>

        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#2c5364",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Go Back
        </button>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#0f2027",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default AdminNotFound;
