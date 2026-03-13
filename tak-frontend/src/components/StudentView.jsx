import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import axiosInstance from "../AxiosInstance";


const StudentView = () => {
  const navigate = useNavigate()
  const { idSt } = useParams()
  const [studentBio, setStudentBio] = useState()
  useEffect(() => {
    const fetchStudentDetails = async () => {
      let ThisStudentData = await axiosInstance.get(`/fetchById-student/${idSt}`)
      setStudentBio(ThisStudentData.data.StudentDetails)
    }
    fetchStudentDetails()
  }, [idSt])

  // /fetchById-student/:id
  const handleGeneratePDF = () => {
    const element = document.getElementById("student-pdf");

    const options = {
      margin: 0.3,
      filename: `${studentBio.st_firstName}_Profile.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait"
      }
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <>

      {studentBio ? (<div className="student-view " key={studentBio._id}>
        <div className="student-header">

          <div style={{ display: "flex", gap: "20px" }}>
            <button style={{ background: "none", border: "0", fontWeight: "bold" }} onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate(`/admin/${adminId}`);
              }
            }}>   <i class="fa-solid fa-arrow-left"></i></button>
            <div><h2>{studentBio.st_firstName}</h2>
              <p className="sub-text">
                Class {studentBio.st_class} • {studentBio.batchDetails.toUpperCase()}
              </p></div>
          </div>
          <div className="header-actions">
            <Link to={`../student-edit/${studentBio._id}`}><button className="btn-outline">Edit Profile</button></Link>
            <button className="btn-primary" onClick={handleGeneratePDF}>Generate PDF</button>
          </div>
        </div>

        <div className="student-grid " id="student-pdf">

          <div className="card profile-card">
            <img
              src={studentBio.stuPhotoUrl}
              alt="student"
              className="avatar"
            />
            <h3>{studentBio.st_firstName} {studentBio.st_lastName}</h3>
            <span className="role">Student</span>

            <div className="status">

              <span className="badge pending">{studentBio.st_payment_status}</span>
            </div>

            <div className="info">

              <p>📞 +91 {studentBio.st_whatsappNo}</p>
              <p>📍 {studentBio.st_res_city}, {studentBio.st_res_state}</p>
            </div>
          </div>


          <div className="details">

            <div className="card">
              <h4>Personal Information</h4>
              <div className="two-col">
                <p><strong>DOB:</strong> {studentBio.st_DOB}</p>
                <p><strong>Gender:</strong> {studentBio.st_gender.toUpperCase()}</p>

                <p><strong>Category:</strong> {studentBio.st_category}</p>
                <p >
                  <strong>Address:</strong> {studentBio.st_res_address}
                </p>
              </div>
            </div>


            <div className="card">
              <h4>Parent / Guardian Details</h4>
              <div className="two-col">
                <p><strong>Father:</strong> {studentBio.f_name} ({studentBio.f_occupation})</p>
                <p><strong>Mother:</strong> {studentBio.m_name} ({studentBio.m_occupation})</p>
                <p><strong>Parent Mobile:</strong> +91 {studentBio.f_contact} , {studentBio.m_contact}</p>
              </div>
            </div>


            <div className="card">
              <h4>Fee Summary</h4>
              <p>Total Paid Fee: {studentBio.st_payment_amount} </p>

            </div>


            <div className="card">
              <h4>Academic Records</h4>
              <table>
                <thead>
                  <tr>
                    <th>Class (current)</th>
                    <th>School / Board</th>

                    <th>Percentage (last year)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{studentBio.st_class}</td>
                    <td>{studentBio.st_school_name}</td>

                    <td>{studentBio.st_per_last_year} %</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>) : (<p>Fetching student</p>)}
    </>

  );
};

export default StudentView;
