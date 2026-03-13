import axios from 'axios'
import React, { useState } from 'react'
import axiosInstance from '../../AxiosInstance'


const FormBatchCreation = () => {
  const [BatchData, setBatchData] = useState({
    name: '',
    address: '',
    email: '',
    mobile: ''
  })

  const handleSave = async (e) => {
    e.preventDefault()

    try {
      const res = await axiosInstance.post(
        '/batch-insert',
        BatchData
      )
      alert(res.data.message)
      window.location.reload()
    } catch (err) {
      alert('Error creating Batch')
    }
  }

  return (
    <div className='admin-creation'>
      <div>
        <h1>Batch Creation</h1>
        <p className='head-para'>
          Manage and track all institute Batches
        </p>
      </div>

      <form className="add-admin-card" onSubmit={handleSave}>
        <div className="top-add-admin">
          <i class="fa-solid fa-plus"></i>
          <p>Add New Batch</p>
        </div>

        <div className="middle-add-admin">
          <div className="form-fields">
            <label>Batch Name </label>
            <input
              type="text"
              placeholder="Takshila Main Batch"
              value={BatchData.name}
              required
              onChange={(e) =>
                setBatchData(prev => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          
        </div>

        <div className="bottom-add-admin">
          <button type="submit">+ Add Batch</button>
        </div>
      </form>
    </div>
  )
}

export default FormBatchCreation
