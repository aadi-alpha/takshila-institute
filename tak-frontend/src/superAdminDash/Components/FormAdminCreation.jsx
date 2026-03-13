import axios from 'axios'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../AxiosInstance'
// name , email , mobile, password , role , branch id 
const FormAdminCreation = () => {
  let [adminData, setAdminData] = useState({
    name: '',
    mobile: '',
    password: '',
    email: '',
    branchId: '',
    branch: '',
    role: "admin"
  })
  const [Branches, setAllBranches] = useState()
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branches = await axiosInstance.get('/branch-fetch')
        setAllBranches(branches.data.allBranches)
      } catch (error) {
        console.log(error.response.message)
      }
    }
    fetchBranches()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()


    if (adminData) {
      try {
        let insertRes = await axiosInstance.post("/UserTakshila-insert", adminData)
        alert(insertRes?.data?.message)
        window.location.reload()
      } catch (error) {
        alert(error.response?.message)
      }
    }


  }
  return (
    <div className='admin-creation'>
      <div>
        <h1>Admin Creation</h1>
        <p className='head-para'>Manage and track all institute admissions and payment statuses</p>
      </div>
      <form className="add-admin-card" onSubmit={(e) => {
        handleSave(e)
      }}>
        <div className="top-add-admin">
          <i className="fa-solid fa-user-plus"></i>
          <p>Add New Admin</p>
        </div>
        <div className="middle-add-admin">
          <div className="form-fields">
            <label >Full Name</label>
            <input type="text" placeholder='Aadi Nagpal' value={adminData.name} required onChange={(e) => {
              setAdminData((prev) => ({
                ...prev,
                name: e.target.value

              }))

            }} />
          </div>
          <div className="form-fields">
            <label >Mobile</label>
            <input type="text" placeholder='9354xxxxxx' value={adminData.mobile} required minLength={10} maxLength={10} onChange={(e) => {
              setAdminData((prev) => ({
                ...prev,
                mobile: e.target.value.trim()

              }))

            }} />
          </div>
          <div className="form-fields">
            <label >email</label>
            <input type="text" placeholder='aadi@gmail.com' value={adminData.email} required onChange={(e) => {
              setAdminData((prev) => ({
                ...prev,
                email: e.target.value.trim()

              }))

            }} />
          </div>
          <div className="form-fields">
            <label >Password</label>
            <input type="text" value={adminData.password} required onChange={(e) => {
              setAdminData((prev) => ({
                ...prev,
                password: e.target.value.trim()

              }))

            }} />
          </div>
          <div className="form-fields">
            <label >Branch</label>
            <select name="" id="branch" required onChange={(e) => {
              const selectedOption = e.target.selectedOptions[0]
              setAdminData((prev) => ({

                ...prev,
                branchId: e.target.value,
                branch: selectedOption.dataset.branchName
              }))

            }}>
              <option value="">Select Branch</option>
              {Branches ? (Branches.map((value, index) => {
                return <option key={index} value={`${value._id}`} data-branch-name={value.name}>{value.name}</option>
              })) : (<option>No branches exists</option>)}
            </select>
          </div>
        </div>
        <div className="bottom-add-admin" >
          <button type='submit'>+ Add Admin</button>
        </div>
      </form >
    </div>


  )
}

export default FormAdminCreation
