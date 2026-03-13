import React, { useEffect, useState } from "react";
import { useBranchId } from "../Context/BranchContext";
import axiosInstance from "../AxiosInstance";
import Select from "react-select";
import UpdateAttendance from "./UpdateAttendance";


const ViewAttendance = () => {
  const { BranchId } = useBranchId();

  const [BatchesList, setBatchesList] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [monthDates, setMonthDates] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [TableLoader, setTableLoader] = useState(false);
  const [UpdateAttMode, setUpdateAttMode] = useState()
  const [updateAttData, setUpdateAttData] = useState({
    open: false,
    studentId: null,
    date: null,
    currentStatus: null,
  });

  const [queryData, setQueryData] = useState({
    branchId: BranchId || "",
    batchId: "",
    subject: "",
    month: "",
    year: new Date().getFullYear(),
  });

  /* =========================
     FETCH BATCHES
  ========================== */
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

  /* =========================
     FETCH STUDENTS
  ========================== */
  useEffect(() => {
    setTableLoader(true);
    const fetchStudents = async () => {
      if (!queryData.branchId || !queryData.batchId) return;
      try {
        const res = await axiosInstance.get(
          `/studentsForTestdropDown?branchId=${queryData.branchId}&batchId=${queryData.batchId}`
        );
        setStudents(res.data.students || []);
        setTableLoader(false);
      } catch (error) {
        console.error("Failed to fetch students", error);
        setTableLoader(false);
      }
      setTableLoader(false);
    };
    fetchStudents();
  }, [queryData.branchId, queryData.batchId]);

  /* =========================
     GENERATE MONTH DATES
  ========================== */
  useEffect(() => {
    if (!queryData.month || !queryData.year) return;

    const monthMap = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };

    const monthIndex = monthMap[queryData.month.toLowerCase()];
    const year = Number(queryData.year);
    const numDays = new Date(year, monthIndex + 1, 0).getDate();

    const datesArray = Array.from({ length: numDays }, (_, i) => {
      const d = new Date(year, monthIndex, i + 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    });

    setMonthDates(datesArray);
  }, [queryData.month, queryData.year]);

  /* =========================
     FETCH ATTENDANCE
  ========================== */
  useEffect(() => {
    const fetchAttendance = async () => {
      if (
        !queryData.branchId ||
        !queryData.batchId ||
        !queryData.subject ||
        !queryData.month ||
        !queryData.year
      )
        return;

      try {
        const url = `/attendance-fetch?branchId=${queryData.branchId}&batchId=${queryData.batchId}&subject=${queryData.subject.toLowerCase()}&month=${queryData.month.toLowerCase()}&year=${queryData.year}${selectedStudent ? `&studentId=${selectedStudent}` : ""
          }`;

        const res = await axiosInstance.get(url);
        setAttendanceData(res.data.attendance || []);
      } catch (error) {
        console.error("Failed to fetch attendance", error);
      }
    };
    fetchAttendance();
  }, [
    queryData.branchId,
    queryData.batchId,
    queryData.subject,
    queryData.month,
    queryData.year,
    selectedStudent,
    updateAttData.open
  ]);

  /* =========================
     HELPERS
  ========================== */
  const getStatus = (studentId, date) => {
    const record = attendanceData.find(
      (att) =>
        att.StudentId === studentId &&
        att.Date.slice(0, 10) === date
    );
    return record ? record.status : "-";
  };

  const getTotals = (studentId) => {
    let P = 0,
      A = 0,
      L = 0;

    attendanceData.forEach((att) => {
      if (att.StudentId === studentId) {
        if (att.status === "P") P++;
        if (att.status === "A") A++;
        if (att.status === "L") L++;
      }
    });

    return { P, A, L };
  };

  // ✅ ADDED (nothing else changed)
  const getDateWiseTotal = (date) => {
    let total = 0;
    attendanceData.forEach((att) => {
      if (
        att.Date.slice(0, 10) === date &&
        att.status === "P"
      ) {
        total++;
      }
    });
    return total;
  };
  // ✅ react-select options (ADD THIS)
  const studentOptions = students.map((stu) => ({
    value: stu._id,
    label: `(${stu.rollNo}) ${stu.st_firstName} ${stu.st_lastName}`,
  }));


  /* =========================
     UI
  ========================== */
  return (
    <div>
      <br />

      {/* ================= FILTERS ================= */}
      <div className="filter-by">
        <div className="filters-row">
          <label>SELECT BATCH</label>
          <select
            value={queryData.batchId}
            onChange={(e) =>
              setQueryData((prev) => ({
                ...prev,
                batchId: e.target.value,
              }))
            }
          >
            <option value="">Select Batch</option>
            {BatchesList.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="filters-row">
          <label>SELECT SUBJECT</label>
          <select
            value={queryData.subject}
            onChange={(e) =>
              setQueryData((prev) => ({
                ...prev,
                subject: e.target.value,
              }))
            }
          >
            <option value="">Select Subject</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
          </select>
        </div>

        <div className="filters-row">
          <label>SELECT YEAR</label>
          <select
            value={queryData.year}
            onChange={(e) =>
              setQueryData((prev) => ({
                ...prev,
                year: e.target.value,
              }))
            }
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>

        <div className="filters-row">
          <label>SELECT MONTH</label>
          <select
            value={queryData.month}
            onChange={(e) =>
              setQueryData((prev) => ({
                ...prev,
                month: e.target.value,
              }))
            }
          >
            <option value="">Select Month</option>
            {[
              "january", "february", "march", "april", "may", "june",
              "july", "august", "september", "october", "november", "december",
            ].map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>


        <div className="filters-row">
          <label>FILTER BY STUDENT</label>

          <Select
            placeholder="Search Student...."
            isClearable
            options={studentOptions}
            value={
              studentOptions.find(
                (opt) => opt.value === selectedStudent
              ) || null
            }
            onChange={(selectedOption) =>
              setSelectedStudent(
                selectedOption ? selectedOption.value : ""
              )
            }
            className="my-select"
            classNamePrefix='my-select'
          />
        </div>



        <div className="filters-head">
          <i className="fa-solid fa-filter"></i>&nbsp;Filters
        </div>
      </div>

      <br />

      {/* ================= TABLE ================= */}
      <div className="table-card-admin-test" style={{ overflowX: "auto" }}>
        <table className="admin-table-list attendance-body">
          <thead>
            <tr>
              <th >Roll No</th>
              <th className="fixed-cols">Name</th>
              <th>F Name</th>
              <th>P</th>
              <th>A</th>
              <th>L</th>
              {monthDates.map((date) => (
                <th key={date}>{new Date(date).getDate()}</th>
              ))}
            </tr>
          </thead>

          <tbody  >
            {TableLoader === false ? (
              students.length > 0 ? (
                <>
                            {/* ✅ DATE-WISE TOTAL PRESENT (ADDED ONLY) */}
                  <tr style={{ background: "#f5f7fa", fontWeight: "bold" }} className="datewise-att-row">
                    <td colSpan={3} style={{ textAlign: "right" }}>
                      TOTAL PRESENT →
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    {monthDates.map((date) => (
                      <td
                        key={date}
                        style={{ textAlign: "center", color: "green" }}
                      >
                        {getDateWiseTotal(date)}
                      </td>
                    ))}
                  </tr>
                  {students
                    .filter(
                      (stu) =>
                        !selectedStudent || stu._id === selectedStudent
                    )
                    .map((stu) => {
                      const totals = getTotals(stu._id);
                      return (
                        <tr key={stu._id}>
                          <td >{stu.rollNo}</td>
                          <td className="fixed-cols">
                            {stu.st_firstName} {stu.st_lastName}
                          </td>
                          <td>{stu.f_name}</td>

                          <td style={{ color: "green", fontWeight: "bold" }}>
                            {totals.P}
                          </td>
                          <td style={{ color: "red", fontWeight: "bold" }}>
                            {totals.A}
                          </td>
                          <td style={{ color: "orange", fontWeight: "bold" }}>
                            {totals.L}
                          </td>

                          {monthDates.map((date) => (
                            <td key={date} style={{ textAlign: "center" }}>
                              {getStatus(stu._id, date)}&nbsp;{getStatus(stu._id, date) != '-' ? (
                                <button className="edit-attendance" onClick={() => setUpdateAttData({
                                  open: true,
                                  studentId: stu._id,
                                  date: date,
                                  currentStatus: getStatus(stu._id, date),
                                })}><i class="fa-solid fa-pen-to-square"></i></button>
                              ) : ('')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}

      
                </>
              ) : (
                <tr>
                  <td colSpan={monthDates.length + 6}>
                    No students found
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={monthDates.length + 6}>Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {updateAttData.open && (
        <UpdateAttendance
          studentId={updateAttData.studentId}
          date={updateAttData.date}
          subject={queryData.subject}
          currentStatus={updateAttData.currentStatus}
          onClose={() =>
            setUpdateAttData({
              open: false,
              studentId: null,
              date: null,
              currentStatus: null,
            })
          }
          onUpdated={() => {
            refreshAttendance();
            setUpdateAttData({
              open: false,
              studentId: null,
              date: null,
              currentStatus: null,
            });
          }}
        />
      )}

    </div>
  );
};

export default ViewAttendance;
