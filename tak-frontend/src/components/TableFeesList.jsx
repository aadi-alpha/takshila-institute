import React, { useEffect, useState } from "react";
import { useBranchId } from "../Context/BranchContext";
import axiosInstance from "../AxiosInstance";
import Select from "react-select";
import EditFees from "./EditFees";
// <-- create/import this

const TableFeesInfo = () => {
    const { BranchId } = useBranchId();

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [feesList, setFeesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [TableLoader, setTableLoader] = useState(false)
    const [editFees, setEditFees] = useState({
        open: false,
        feesId: "",
        studentName: ""
    });
    const [generalDetails, setGeneralDetails] = useState({
        totalPaidAmt: 0,
        totalduration: 0
    })
    var totalPaidAmt = 0;
    var totalduration = 0;
    const studentOptions =
        students?.map((stu) => ({
            value: stu._id,
            label: `${stu.rollNo} ${stu.st_firstName} ${stu.st_lastName}`,
            data: stu
        })) || [];
    /* ================= FETCH STUDENTS ================= */
    useEffect(() => {
        if (!BranchId) return;

        const fetchStudents = async () => {
            try {
                const res = await axiosInstance.get(
                    `/students-by-branch?branchId=${BranchId}`
                );
                setStudents(res.data.students || []);
            } catch (error) {
                console.error("Failed to fetch students", error);
            }
        };

        fetchStudents();
    }, [BranchId]);

    /* ================= FETCH FEES BY STUDENT ================= */
    useEffect(() => {
        if (!selectedStudent) {
            setFeesList([]);
            return;
        }

        const fetchFees = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(
                    `/fees-record-fetch?studentId=${selectedStudent}`
                );
                setFeesList(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch fees", error);
                setFeesList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, [selectedStudent]);

    return (
        <div>
            {/* ================= FILTER ================= */}
            <div className="admin-filters" style={{ marginInline: "3vw" }}>
                <div className="filter-by">
                    <div className="filters-row">
                        <label >SELECT STUDENT</label>

                        <Select
                            placeholder="Search Student..."
                            isClearable
                            options={studentOptions}
                            className="my-select"
                            classNamePrefix="my-select"
                            value={
                                studentOptions.find((opt) => opt.value === selectedStudent) || null
                            }
                            onChange={(selectedOption) =>
                                setSelectedStudent(selectedOption ? selectedOption.value : "")
                            }
                        />
                    </div>
                    < div className='filters-head'>
                        <i class="fa-solid fa-filter"></i>&nbsp;Filters
                    </div>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="table-card-admin">
                <table className="admin-table-list">
                    <thead>
                        <tr>
                            <th>S.No.</th>


                            <th>PAID AMOUNT</th>
                            <th>FROM DATE</th>
                            <th>TO DATE</th>
                            <th>DURATION</th>

                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: "center" }}>
                                    Loading...
                                </td>
                            </tr>
                        ) : feesList.length > 0 ? (
                            feesList.map((item, index) => {
                                // Calculate totals
                                totalPaidAmt = feesList.reduce(
                                    (sum, item) => sum + Number(item.paidAmount || 0),
                                    0
                                );

                                totalduration = feesList.reduce(
                                    (sum, item) => sum + Number((item.duration / 30) || 0),
                                    0
                                );

                                return <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.paidAmount}</td>
                                    <td>{item.fromDate.slice(0, 10) || 'NaN'}</td>
                                    <td>{item.toDate.slice(0, 10) || 'NaN'}</td>
                                    <td>{(item.duration / 30).toFixed(2) || 0} M or {item.duration || 0} D</td>
                                </tr>
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    No fees records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>

                        <tr >
                            <td style={{ fontSize: "14px" }}>Total Amt</td>
                            <td style={{ fontSize: "14px" }}>{totalPaidAmt}</td>
                            <td style={{ fontSize: "14px" }} colSpan={2}>Total Duration</td>

                            <td style={{ fontSize: "14px" }} >{totalduration.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* ================= EDIT MODAL ================= */}
            {editFees.open && (
                <EditFees
                    feesId={editFees.feesId}
                    studentName={editFees.studentName}
                    onClose={() =>
                        setEditFees({ open: false, feesId: "", studentName: "" })
                    }
                    refresh={() => setSelectedStudent(selectedStudent)}
                />
            )}
        </div>
    );
};

export default TableFeesInfo;
