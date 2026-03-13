import React, { useEffect, useState } from 'react'
import axiosInstance from '../AxiosInstance'
import { useBranchId } from '../Context/BranchContext'
import Select from "react-select";

const FeesCreation = () => {
    const { BranchId } = useBranchId()

    let [FeesData, setFeesData] = useState({
        name: '',
        studentId: '',
        studentRollNo: '',
        branchId: BranchId,
        TotalFees: "",
        paidAmount: '',
        fromDate: '',
        toDate: '',
        duration: ''
    })
    // /students-by-branch
    const [studentsDropDownList, setStudentsDropDownList] = useState()
    const studentOptions = studentsDropDownList?.map((student) => ({
  value: student._id,
  label: `${student.rollNo} (${student.st_firstName} ${student.st_lastName})`,
  data: student
})) || [];

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                let res = await axiosInstance.get(`/students-by-branch?branchId=${BranchId}`)
                if (res.status === 201) {
                    setStudentsDropDownList(res.data.students)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchStudents()
    }, [BranchId])

    useEffect(() => {
        if (FeesData.fromDate && FeesData.toDate) {
            const from = new Date(FeesData.fromDate);
            const to = new Date(FeesData.toDate);

            const differenceInTime = to - from; // milliseconds
            const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

            setFeesData((prev) => ({
                ...prev,
                duration: differenceInDays
            }))
        }
    }, [FeesData.fromDate, FeesData.toDate])
    const handleSave = async (e) => {
        e.preventDefault()

        if (FeesData.paidAmount && FeesData.name && FeesData.studentId && FeesData.studentRollNo && FeesData.fromDate && FeesData.toDate && FeesData.duration) {
            try {
                let FeesInsert = await axiosInstance.post('/fees-insert', FeesData)

                if (FeesInsert.status == 201) {
                    return alert('fees successfully inserted')
                }
            } catch (error) {
                alert(error.response.data.message)
            }
        }
        else {
            alert("Fill all fields properly")
        }
    }
    return (
        <div>
            <div className='admin-creation'>
                <h1 >Fees Management</h1>
                <p className='head-para'>Manage and track all institute admissions and payment statuses</p>
                <form className="add-admin-card" onSubmit={(e) => {
                    handleSave(e)
                }}>
                    <div className="top-add-admin">
                        <i className="fa-solid fa-user-plus"></i>
                        <p>Add New Fees</p>
                    </div>
                    <div className="middle-add-admin">
                        <div className="form-fields">
                            <label htmlFor='role'>Select Student </label>
                            <Select
                                placeholder="Search Student..."
                                isClearable
                                options={studentOptions}
                                className="my-select"
                                classNamePrefix="my-select"

                                onChange={(selectedOption) => {
                                    if (!selectedOption) return;

                                    const selectedUser = selectedOption.data;

                                    setFeesData((prev) => ({
                                        ...prev,
                                        studentId: selectedUser._id,
                                        name: selectedUser.st_firstName + " " + selectedUser.st_lastName,
                                        studentRollNo: selectedUser.rollNo,
                                    }));
                                }}
                            />
                        </div>
                        {/*  */}
                        <div className="form-fields">
                            <label htmlFor="year">From Date:-</label>
                            <input type="date" required onChange={(e) => {
                                setFeesData((prev) => ({
                                    ...prev,
                                    fromDate: e.target.value
                                }))
                            }} />
                        </div>
                        <div className="form-fields">
                            <label htmlFor="year">To Date:-</label>
                            <input type="date" required onChange={(e) => {
                                setFeesData((prev) => ({
                                    ...prev,
                                    toDate: e.target.value
                                }))
                            }} />
                        </div>
                        {/* paid */}
                        <div className="form-fields">
                            <label >Paid Amount</label>
                            <input type="number" placeholder='paid amount' value={FeesData.paidAmount} required onChange={(e) => {
                                setFeesData((prev) => ({
                                    ...prev,
                                    paidAmount: e.target.value.trim()

                                }))

                            }} />
                        </div>
                        {/* month */}
                        <div className="form-fields">
                            <label >Duration</label>
                            <input type="number" placeholder='duration' value={(FeesData.duration / 30).toFixed(2)} readOnly />
                        </div>

                    </div>
                    <div className="bottom-add-admin" >
                        <button type='submit'>+ Add Fees</button>
                    </div>
                </form >
            </div>
        </div>
    )
}

export default FeesCreation
