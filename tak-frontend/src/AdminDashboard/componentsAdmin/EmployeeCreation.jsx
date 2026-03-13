
import React, { useEffect, useState } from 'react'
import { useBranchId } from '../../Context/BranchContext'
import axiosInstance from '../../AxiosInstance'
const EmployeeCreation = () => {
  const { BranchId } = useBranchId()
  const [countsData, setCountsData] = useState()
  let [staffData, setStaffData] = useState({
    name: '',
    mobile: '',
    password: '',
    email: '',
    branchId: '',
    branch: '',
    role: "",
    TotalSalary: ''
  })

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branches = await axiosInstance.get(`/branch-get-ById/${BranchId}`)
        setStaffData((prev) => ({
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
    const fetchCounts = async () => {
      let counts = await axiosInstance.get('/data-count-fetch')

      setCountsData(counts.data.countData)
    }
    fetchCounts()
  }, [])
  console.log(countsData)

  const handleSave = async (e) => {
    e.preventDefault()


    if (staffData.name && staffData.mobile && staffData.password && staffData.email && staffData.branch && staffData.branchId && staffData.role) {
      try {
        const res = await axiosInstance.post("/UserTakshila-insert", staffData);
        console.log(res)

        if (res.data.status === 1) {
          alert("User Created Successfully");
        }
      } catch (err) {
        if (err.response?.status === 409) {
          alert("Mobile number already registered");
          window.location.reload()
        } else {
          console.log(err)
          alert("please try again after some time ");
        }
      }

    } else {
      alert('Please fill all fields')
    }


  }
  return (
    <div className='admin-creation'>
      <h1 >Staff Creation</h1>
      <p className='head-para'>Manage and track all institute admissions and payment statuses</p>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon icon-orange"><i class="fa-solid fa-clipboard-user"></i></div>
          <div>
            <div class="stat-title">Total&nbsp;Staff</div>
            <div class="stat-value">{countsData?.totalTeachers + countsData?.totalReceptionists}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon icon-green"><i class="fa-solid fa-graduation-cap"></i></div>
          <div>
            <div class="stat-title">Teachers</div>
            <div class="stat-value">{countsData?.totalTeachers}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon icon-purple"><i class="fa-solid fa-shield"></i></div>
          <div>
            <div class="stat-title">Receptionists</div>
            <div class="stat-value">{countsData?.totalReceptionists}</div>
          </div>
        </div>
      </div>
      <br />
      <form className="add-admin-card" onSubmit={(e) => {
        handleSave(e)
      }}>
        <div className="top-add-admin">
          <i className="fa-solid fa-user-plus"></i>
          <p>Add New staff</p>
        </div>
        <div className="middle-add-admin">
          <div className="form-fields">
            <label htmlFor='role'>Role:- </label>
            <select name="role" id="role" required onChange={(e) => {
              setStaffData((prev) => ({
                ...prev,
                role: e.target.value.trim()
              }))
            }}>
              <option value="">Select Role</option>
              <option value="receptionist">Receptionist</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div className="form-fields">
            <label >Full Name</label>
            <input type="text" placeholder='Aadi Nagpal' value={staffData.name} required onChange={(e) => {
              setStaffData((prev) => ({
                ...prev,
                name: e.target.value

              }))


            }} />
          </div>



          <div className="form-fields">
            <label >Mobile</label>
            <input type="text" placeholder='9354xxxxxx' value={staffData.mobile} required minLength={10} maxLength={10} onChange={(e) => {
              setStaffData((prev) => ({
                ...prev,
                mobile: e.target.value.trim()

              }))

            }} />
          </div>
          <div className="form-fields">
            <label >Email</label>
            <input type="text" placeholder='aadi@gmail.com' value={staffData.email} required onChange={(e) => {
              setStaffData((prev) => ({
                ...prev,
                email: e.target.value.trim()

              }))

            }} />
          </div>
          <div className="form-fields">
            <label >Salary (per Month)</label>
            <input type="text" value={staffData.TotalSalary} required onChange={(e) => {
              setStaffData((prev) => ({
                ...prev,
                TotalSalary: e.target.value.trim()

              }))

            }} />
          </div>
          <div className="form-fields">
            <label >Password</label>
            <input type="text" value={staffData.password} required onChange={(e) => {
              setStaffData((prev) => ({
                ...prev,
                password: e.target.value.trim()

              }))

            }} />
          </div>

        </div>
        <div className="bottom-add-admin" >
          <button type='submit'>+ Add staff</button>
        </div>
      </form >
    </div>


  )
}

export default EmployeeCreation
