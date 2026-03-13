import axios from 'axios'
import React, { useState } from 'react'
import axiosInstance from '../../AxiosInstance'


const FormBranchCreation = () => {
  const [branchData, setBranchData] = useState({
    name: '',
    address: '',
    email: '',
    mobile: ''
  })

  const handleSave = async (e) => {
    e.preventDefault()

    try {
      const res = await axiosInstance.post(
        '/branch-insert',
        branchData
      )
      alert(res.data.message)
      window.location.reload()
    } catch (err) {
      alert('Error creating branch')
    }
  }

  return (
    <div className='admin-creation'>
      <div>
        <h1>Branch Creation</h1>
        <p className='head-para'>
          Manage and track all institute branches
        </p>
      </div>

      <form className="add-admin-card" onSubmit={handleSave}>
        <div className="top-add-admin">
          <i className="fa-solid fa-building"></i>
          <p>Add New Branch</p>
        </div>

        <div className="middle-add-admin">
          <div className="form-fields">
            <label>Branch Name (city name)</label>
            <input
              type="text"
              placeholder="Takshila Main Branch"
              value={branchData.name}
              required
              onChange={(e) =>
                setBranchData(prev => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="form-fields">
            <label>Address</label>
            <input
              type="text"
              placeholder="Delhi, India"
              value={branchData.address}
              required
              onChange={(e) =>
                setBranchData(prev => ({ ...prev, address: e.target.value }))
              }
            />
          </div>

          <div className="form-fields">
            <label>Email</label>
            <input
              type="email"
              placeholder="branch@takshila.com"
              value={branchData.email}
              required
              onChange={(e) =>
                setBranchData(prev => ({ ...prev, email: e.target.value.trim() }))
              }
            />
          </div>

          <div className="form-fields">
            <label>Mobile</label>
            <input
              type="text"
              placeholder="9876543210"
              value={branchData.mobile}
              minLength={10}
              maxLength={10}
              required
              onChange={(e) =>
                setBranchData(prev => ({ ...prev, mobile: e.target.value.trim() }))
              }
            />
          </div>
        </div>

        <div className="bottom-add-admin">
          <button type="submit">+ Add Branch</button>
        </div>
      </form>
    </div>
  )
}

export default FormBranchCreation
