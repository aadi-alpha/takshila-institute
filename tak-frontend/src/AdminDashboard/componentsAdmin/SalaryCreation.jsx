import React, { useEffect, useState } from 'react'
import axiosInstance from '../../AxiosInstance'
import { useBranchId } from '../../Context/BranchContext'

const SalaryCreation = () => {
    const { BranchId } = useBranchId()
    const [allEmployees, setAllEmployees] = useState()
    let [SalaryData, setSalaryData] = useState({
        name: '',
        userId: '',
        branchId: '',
        role: "",
        TotalSalary: "",
        paidAmount: '',
        month: '',
    })


    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const user = await axiosInstance.get(`/UserTakshila-fetch-id/${BranchId}`)

                setSalaryData((prev) => ({
                    ...prev,
                    branchId: branches?.data.BranchData._id,
                    branch: branches?.data.BranchData.name
                }
                )

                )

            } catch (error) {
                alert(error)
            }

        }
        fetchBranches()
    }, [])

    useEffect(() => {
        const fetchAllStaff = async () => {
            let users = await axiosInstance.get(`/role-based-users?role=teacher,receptionist&branch=${BranchId}`)
            setAllEmployees(users.data.Users)

        }
        fetchAllStaff()
    }, [BranchId])
    const handleSave = async (e) => {
        e.preventDefault()


        if (SalaryData.name && SalaryData.userId && SalaryData.branchId && SalaryData.role && SalaryData.TotalSalary && SalaryData.paidAmount && SalaryData.month) {
            try {
                let res = await axiosInstance.post('/insert-salary', SalaryData)
                if (res.status == 201) {
                    alert(res.data.message)
                    window.location.reload()
                }
            } catch (err) {
                alert(err, "please try agin later ")
            }

        } else {
            alert('Please fill all fields')
        }
    }
    return (
        <>
            <div className='admin-creation'>
                <h1 >Salary Management</h1>
                <p className='head-para'>Manage and track all institute admissions and payment statuses</p>
                <form className="add-admin-card" onSubmit={(e) => {
                    handleSave(e)
                }}>
                    <div className="top-add-admin">
                        <i className="fa-solid fa-user-plus"></i>
                        <p>Add New Salary</p>
                    </div>
                    <div className="middle-add-admin">
                        <div className="form-fields">
                            <label htmlFor='role'>Select Staff:- </label>
                            <select name="user" id="user" required onChange={(e) => {
                                const selectedUser = allEmployees.find(
                                    (emp) => emp._id === e.target.value
                                )
                                if (!selectedUser) return
                                setSalaryData((prev) => ({
                                    ...prev,
                                    userId: selectedUser._id,
                                    name: selectedUser.name,
                                    branchId: selectedUser.branchId,
                                    role: selectedUser.role,
                                    TotalSalary: selectedUser.TotalSalary
                                }))

                            }}>
                                <option value=''>Select Users</option>
                                {allEmployees?.length > 0 ? (allEmployees.map((emp, index) => {
                                    return <option key={emp._id} value={emp._id}>{emp.name.toUpperCase()} ({emp.mobile})</option>
                                })) : (<option disabled>No users Exists</option>)}
                            </select>
                        </div>
                        {/*  */}
                        <div className="form-fields">
                            <label >Role:-</label>
                            <input type="text" placeholder='role' value={SalaryData.role.toLocaleUpperCase()} required readOnly />
                        </div>



                        <div className="form-fields">
                            <label>Total Salary</label>
                            <input type="text" placeholder='Total salary (20000)' value={SalaryData.TotalSalary} readOnly />
                        </div>
                        <div className="form-fields">
                            <label >Paid Amount</label>
                            <input type="number" placeholder='paid amount' value={SalaryData.paidAmount} required onChange={(e) => {
                                setSalaryData((prev) => ({
                                    ...prev,
                                    paidAmount: e.target.value.trim()

                                }))

                            }} />
                        </div>
                        <div className="form-fields">
                            <label htmlFor="month">Select Month:-</label>

                            <select
                                name="month"
                                id="month"
                                required
                                value={SalaryData.month || ""}
                                onChange={(e) =>
                                    setSalaryData((prev) => ({
                                        ...prev,
                                        month: e.target.value,
                                    }))
                                }
                            >
                                <option value="">Select Month</option>

                                <option value="january">January</option>
                                <option value="february">February</option>
                                <option value="march">March</option>
                                <option value="april">April</option>
                                <option value="may">May</option>
                                <option value="june">June</option>
                                <option value="july">July</option>
                                <option value="august">August</option>
                                <option value="september">September</option>
                                <option value="october">October</option>
                                <option value="november">November</option>
                                <option value="december">December</option>
                            </select>
                        </div>

                    </div>
                    <div className="bottom-add-admin" >
                        <button type='submit'>+ Add Salary</button>
                    </div>
                </form >
            </div>

        </>

    )
}

export default SalaryCreation

