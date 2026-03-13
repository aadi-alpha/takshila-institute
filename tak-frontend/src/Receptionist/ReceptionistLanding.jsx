import React, { useEffect, useState } from 'react'
import { Link, Outlet, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import AdmissionManagement from '../components/AdmissionManagement'
import axiosInstance from '../AxiosInstance'
import { useBranchId } from '../Context/BranchContext'



const ReceptionistLanding = () => {
  const navigate = useNavigate()
  const [students, seStudents] = useState();
  const [searchParams] = useSearchParams()
  const q = searchParams.get("q")
  const [totalStudents, setTotalStudents] = useState()
  const limit = 5
  const totalPages = Math.ceil(totalStudents / limit);

  const [page, setPage] = useState(1)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // fallback to 'all' if q is null
        const batch = q || 'all';
        let studentsData = await axiosInstance.get(`/students-batchwise?batch=all&page=${page}&limit=${limit}`);
        seStudents(studentsData.data.Students)

        setTotalStudents(studentsData.data.TotalStudents)

      } catch (error) {
        seStudents([])
      }
    }

    fetchStudents()
  }, [page, limit])

  useEffect(() => {
    if (!q) {
      navigate("?q=all", { replace: true })
      return;
    }
    const fetchStudents = async () => {
      try {
        let studentsData = await axiosInstance.get(`/students-batchwise?batch=${q}&page=${page}&limit=${limit}`);
        seStudents(studentsData.data.Students)
      } catch (error) {
        seStudents([])
      }
    }
    fetchStudents()
  }, [q, navigate, page, limit])
  return (
    <div >

      <div className="content-admin">
        <AdmissionManagement students={students?.reverse()} page={page} limit={limit} q={q} canDelete={false} canView={true} role={'receptionist'}/>
        <div style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "40px"
        }}>

          {/* LEFT BUTTON */}
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              border: "2px solid #d3d3d3",
              background: "#FFFFFF",
              cursor: page === 1 ? "not-allowed" : "pointer",
              fontSize: "18px",
              color: "#6B7280",
              opacity: page === 1 ? 0.7 : 1
            }}
          >
            ‹
          </button>

          {/* CURRENT PAGE */}
          <button
            disabled
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              border: "none",
              background: "#1F2937",
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "default"
            }}
          >
            {page}
          </button>

          {/* RIGHT BUTTON */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              border: "1px solid #d3d3d3",
              background: "#FFFFFF",
              cursor: page === totalPages ? "not-allowed" : "pointer",
              fontSize: "18px",
              color: "#6B7280",
              opacity: page === totalPages ? 0.7 : 1
            }}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReceptionistLanding


