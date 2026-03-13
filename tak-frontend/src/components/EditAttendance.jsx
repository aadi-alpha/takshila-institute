import React, { useEffect, useState } from "react";
import { useBranchId } from "../Context/BranchContext";
import axiosInstance from "../AxiosInstance";

const EditAttendance = () => {
  const { BranchId } = useBranchId();

  const [BatchesList, setBatchesList] = useState([]);
  const [students, setStudents] = useState([]);
  const [TableLoader,setTableLoader]=useState(false)
  const [queryData, setQueryData] = useState({
    batchId: "", // batchId included
    subject: "",
    date: "",
    month: "",
  });

  const [attendanceData, setAttendanceData] = useState([]); // array of individual records

  // Fetch Batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axiosInstance.get("/batch-fetch");
        setBatchesList(res.data.AllBatches || []);
      } catch (error) {
        console.error("Failed to fetch batches", error);
      }
    };
    fetchBatches();
  }, []);

  // Fetch Students for selected batch & subject
  useEffect(() => {
    const fetchStudents = async () => {
      setTableLoader(true)
      if (!queryData.batchId || !queryData.subject) return;
      try {
        const res = await axiosInstance.get(
          `/students-tests?branchId=${BranchId}&batchId=${queryData.batchId}&subject=${queryData.subject}`
        );
        setStudents(res.data.students || []);
        setTableLoader(false)
      } catch (error) {
        console.error("Failed to fetch students", error);
         setTableLoader(false)
      }
       setTableLoader(false)
    };
    fetchStudents();
  }, [BranchId, queryData.batchId, queryData.subject]);

  // Initialize attendanceData whenever students change
  useEffect(() => {
    if (!students.length) return;

    const newAttendanceData = students.map((stu) => ({
      BranchId,
      batchId: queryData.batchId, // <-- include batchId
      month: queryData.month,
      year: queryData.date ? new Date(queryData.date).getFullYear() : "",
      Date: queryData.date,
      StudentId: stu._id,
      Name: `${stu.st_firstName} ${stu.st_lastName}`,
      F_NAME: stu.f_name,
      RollNo: stu.rollNo,
      subject: queryData.subject,
      status: "", // empty initially
    }));

    setAttendanceData(newAttendanceData);
  }, [BranchId, queryData.batchId, queryData.subject, queryData.date, queryData.month, students]);

  // Handle attendance button click
  const handleAttendanceChange = (index, value) => {
    const updatedStatus = [...attendanceData];
    updatedStatus[index].status = value;
    setAttendanceData(updatedStatus);
  };

  // Save attendance
  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!queryData.batchId || !queryData.subject || !queryData.date || !queryData.month) {
      return alert("Please select batch, subject, date, and month");
    }
    if (attendanceData.some((s) => s.status === "")) {
      return alert("Please mark attendance for all students");
    }

    try {
      const res = await axiosInstance.post("/attendance-insert", attendanceData);
      if (res.status === 200 || res.status === 201) {
        alert("Attendance saved successfully ✅");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save attendance");
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="admin-filters-test">
        {/* Batch */}
<div className="filter-by">
        <div className="filters-row">
          <label >SELECT BATCH</label>
          <select
            value={queryData.batchId}
            onChange={(e) => setQueryData((prev) => ({ ...prev, batchId: e.target.value }))}
          >
            <option value="">Select Batch</option>
            {BatchesList.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
     
        <div className="filters-row">
             <label>SELECT SUBJECT</label>
          <select
            value={queryData.subject}
            onChange={(e) => setQueryData((prev) => ({ ...prev, subject: e.target.value }))}
          >
            <option value="">Select Subject</option>
            <option value="math">Maths</option>
            <option value="science">Science</option>
          </select>
        </div>

        {/* Date */}
    
        <div className="filters-row">
          <label>SELECT DATE</label>
          <input
            type="date"
            value={queryData.date}
            onChange={(e) => setQueryData((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>

        {/* Month */}
      
        <div className="filters-row">
            <label>SELECT MONTH</label>
          <select
            value={queryData.month}
            onChange={(e) => setQueryData((prev) => ({ ...prev, month: e.target.value }))}
          >
            <option value="">Select Month</option>
            {[
              "january","february","march","april","may","june",
              "july","august","september","october","november","december"
            ].map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>
        </div>
         < div className='filters-head'>

                        <i class="fa-solid fa-filter"></i>&nbsp;Filters</div>
        </div>
      </div>

      {/* Attendance Table */}
      <form onSubmit={handleSaveAttendance} className="table-card-admin-test">
        <table className="admin-table-list">
          <thead>
            <tr>
              <th>Roll.No.</th>
              <th>Name</th>
              <th>F_Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TableLoader===false?(
              students?.length > 0 ? (
              students.map((stu, index) => (
                <tr key={stu._id}>
                  <td>{stu.rollNo}</td>
                  <td>{stu.st_firstName} {stu.st_lastName}</td>
                  <td>{stu.f_name}</td>
                  <td className="attendance-buttons">
                    {["P", "A", "L"].map((status) => (
                      <button
                        type="button"
                        key={status}
                        className={`att-btn ${
                          attendanceData[index]?.status === status
                            ? status === "P"
                              ? "present"
                              : status === "A"
                              ? "absent"
                              : "leave"
                            : ""
                        }`}
                        onClick={() => handleAttendanceChange(index, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ fontSize: "clamp(16px,2vw,18px)", fontWeight: "bold", textAlign: "center", }} colSpan={4}>No students found</td>
              </tr>
            )
            ):( <tr>
                <td style={{ fontSize: "clamp(16px,2vw,18px)", fontWeight: "bold", textAlign: "center", }} colSpan={4}>Loading...</td>
              </tr>)}
          </tbody>
        </table>
        <div className="save-btn-test">
          <button type="submit">Save Attendance</button>
        </div>
      </form>

      {/* Styles */}
      <style>{`
        .att-btn {
          padding: 5px 12px;
          margin-right: 5px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          border: 1px solid #ccc;
          background-color: #f0f0f0;
          color: #000;
          transition: all 0.2s ease;
        }
        .att-btn.present { background-color: green; color: white; }
        .att-btn.absent { background-color: red; color: white; }
        .att-btn.leave { background-color: blue; color: white; }
      `}</style>
    </div>
  );
};

export default EditAttendance;
