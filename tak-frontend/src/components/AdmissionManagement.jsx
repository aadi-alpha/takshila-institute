import React, { useEffect, useState } from 'react'

import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios'
import BatchCards from './BatchCards';
import axiosInstance from '../AxiosInstance';
import { useBranchId } from '../Context/BranchContext';



const AdmissionManagement = ({ students, page, limit, q, canDelete = false, role }) => {

    const [TableLoader, setTableLoader] = useState(false)
    const [requiredStudentData, setRequiredStudentData] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");
    const currentDate = new Date();

    const navigate = useNavigate()
    const { BranchId } = useBranchId()
    // DD-MM-YYYY
    const currentDateObj = currentDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Kolkata"
    });

    const [countsData, setCountsData] = useState()
    useEffect(() => {
        if (students) {
            const updatedArray = []
            students.forEach((stu) => {
                const dateObj = new Date(stu.createdAt);
                updatedArray.push({
                    id: stu._id,

                    regDate: dateObj.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        timeZone: "Asia/Kolkata"
                    }),
                    regTime: dateObj.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata"
                    }),
                    name: `${stu.st_firstName} ${stu.st_lastName || ""}`.trim(),
                    whatsappNo: stu.st_whatsappNo,
                    Batch: stu.batchDetails,
                    classSt: stu.st_class,
                    Payment: stu.st_payment_status,
                    rollNo: stu.rollNo
                });
            })
            setRequiredStudentData(updatedArray)
        }
        else {
            setRequiredStudentData([])
        }
    }, [students])
    useEffect(() => {
        const fetchCounts = async () => {
            let counts = await axiosInstance.get('/data-count-fetch')

            setCountsData(counts.data.countData)
        }
        fetchCounts()
    }, [])


    useEffect(() => {
        const fetchSearchedStudents = async () => {
            setTableLoader(true)
            if (searchTerm || paymentFilter) {

                try {

                    let studentsData = await axiosInstance.get(`/students-batchwise?batch=${q}&page=${page}&limit=${limit}&search=${searchTerm}&paymentFilter=${paymentFilter}`);
                    if (studentsData.data.status == 1) {
                        const updatedArray = []
                        studentsData.data.Students.forEach((stu) => {
                            const dateObj = new Date(stu.createdAt);
                            updatedArray.push({
                                id: stu._id,

                                regDate: dateObj.toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    timeZone: "Asia/Kolkata"
                                }),
                                regTime: dateObj.toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                    timeZone: "Asia/Kolkata"
                                }),
                                name: `${stu.st_firstName} ${stu.st_lastName || ""}`.trim(),
                                whatsappNo: stu.st_whatsappNo,
                                Batch: stu.batchDetails,
                                classSt: stu.st_class,
                                Payment: stu.st_payment_status,
                                rollNo: stu.rollNo
                            });
                        })

                        setRequiredStudentData(updatedArray)
                        setTableLoader(false)

                    } else {
                        setRequiredStudentData([])
                        setTableLoader(false)
                    }

                } catch (error) {
                    setRequiredStudentData([])
                    setTableLoader(false)
                }
            }
            setTableLoader(false)
        }
        fetchSearchedStudents()

    }, [searchTerm, paymentFilter, navigate, BranchId, page, limit, q]);





    return (
        <div>
            <div className="admission-management">
                <div className="admission-management-top">
                    <h1>Admission Management</h1>
                    <p className='head-para'>Manage and track all institute admissions and payment statuses</p>
                  {role && role=='admin'?(  <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon icon-green"><i class="fa-solid fa-graduation-cap"></i></div>
                            <div>
                                <div class="stat-title">Total&nbsp;Students</div>
                                <div class="stat-value">{countsData?.totalStudents || 0}</div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon icon-purple"><i class="fa-solid fa-comment-dollar"></i></div>
                            <div>
                                <div class="stat-title">Fee&nbsp;Collection</div>
                                <div class="stat-value">{(countsData?.totalEarnings / 1000) || 0}k</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon icon-purple"><i class="fa-regular fa-money-bill-1"></i></div>
                            <div>
                                <div class="stat-title">Paid&nbsp;Amt.</div>
                                <div class="stat-value">{(countsData?.totalPaidAmount / 1000) || 0}k</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon icon-orange"><i class="fa-solid fa-clipboard-user"></i></div>
                            <div>
                                <div class="stat-title">Total&nbsp;Staff</div>
                                <div class="stat-value">{countsData?.totalTeachers + countsData?.totalReceptionists}</div>
                            </div>
                        </div>


                    </div>):('')}

                    <div className=" admin-filters">
                        <div className="search-by ">
                            <label>SEARCH STUDENTS</label>
                            <input type="search" placeholder='Search by Name...' value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} />
                            <i className="fa-solid fa-magnifying-glass" style={{ backgroundColor: "white" }}></i>
                        </div>

                        <div className="filter-by ">


                            <div className='filters-row'>
                                <label>PAYMENT FILTER</label>
                                <select name="" id=""
                                    onChange={(e) => setPaymentFilter(e.target.value)} style={{ paddingInline: '10x' }} >
                                    <option value=" ">--- Select Filter Fees ---</option>
                                    <option value="paid">paid</option>
                                    <option value="pending">cash</option>
                                </select>
                            </div>
                            <div className='filters-row'>
                                <label>BATCH FILTER</label>
                                <BatchCards />
                            </div>
                            < div className='filters-head'>
                                <i class="fa-solid fa-filter"></i>&nbsp;Filters</div>

                        </div>
                    </div>
                </div>
                <div >
                    <div className="table-card-admin">
                        <table className="admin-table-list">
                            <thead>
                                <tr>
                                    <th>ROLL.No.</th>
                                    <th>REG DATE</th>
                                    <th>STUDENT NAME</th>
                                    <th>MOBILE</th>
                                    <th>BATCH</th>
                                    <th>CLASS</th>
                                    <th>PAYMENT</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/*  */}

                                {TableLoader === false ? (
                                    requiredStudentData.length > 0 ? ([...requiredStudentData].reverse().map((item, index) => {
                                        return <tr key={item.id}>
                                            <td>{item.rollNo}</td>
                                            <td className='reg-date'>
                                                <div className="date-main">{item.regDate}</div>
                                                <div className="date-sub">{item.regTime}</div>
                                            </td>

                                            <td className="name-cell">{item.name}&nbsp;&nbsp;&nbsp;{currentDateObj && currentDateObj == item.regDate ? (<div style={{ height: "8px", width: "8px", fontSize: "clamp(10px,1.5vw,12px)", backgroundColor: "#33970b", borderRadius: "70px", display: "inline-block" }}></div>) : (<span></span>)}</td>

                                            <td className="mobile-cell">
                                                +91 {item.whatsappNo}
                                            </td>

                                            <td>{item.Batch}</td>
                                            <td>
                                                {item.classSt}
                                            </td>

                                            <td>
                                                <span className="status pending">{item.Payment.toUpperCase()}</span>
                                            </td>

                                            {item.Payment == 'paid' ? (<td className="action-cell">

                                                <Link to={`student-view/${item.id}`}><i className="fa-solid fa-eye blue"></i></Link>
                                                {canDelete && canDelete == true ? (<button onClick={async () => {
                                                    if (!window.confirm("Are you sure you want to delete this student?")) return;

                                                    const res = await axiosInstance.delete(
                                                        `/delete-student/${item.id}`
                                                    );

                                                    alert(res.data.message);
                                                    setRequiredStudentData(prev => prev.filter(stu => stu.id !== item.id));
                                                }}><i className="fa-solid fa-circle-xmark red" ></i></button>) : ('')}
                                            </td>) : (<td className="action-cell">
                                                <button onClick={async () => {
                                                    let res = await axiosInstance.put(`/approve-student/${item.id}`)
                                                    alert(res.data.message)
                                                    window.location.reload()
                                                }}><i className="fa-solid fa-circle-check green"></i></button>


                                                {canDelete && canDelete == true ? (<button onClick={async () => {
                                                    if (!window.confirm("Are you sure you want to delete this student?")) return;

                                                    const res = await axiosInstance.delete(
                                                        `/delete-student/${item.id}`
                                                    );

                                                    alert(res.data.message);
                                                    setRequiredStudentData(prev => prev.filter(stu => stu.id !== item.id));
                                                }}><i className="fa-solid fa-circle-xmark red" ></i></button>) : ('')}
                                                <Link to={`student-view/${item.id}`}><i className="fa-solid fa-eye blue"></i></Link>

                                            </td>)}
                                        </tr>
                                    })) : <tr><td colSpan={8} style={{ fontSize: "clamp(16px,2vw,18px)", fontWeight: "bold", textAlign: "center", }}>No students Exist</td></tr>
                                ) : (<tr><td colSpan={8} style={{ fontSize: "clamp(16px,2vw,18px)", fontWeight: "bold", textAlign: "center", }}>Loading...</td></tr>)}
                            </tbody>
                        </table>

                    </div>
                </div>


            </div>
        </div>
    )
}

export default AdmissionManagement
