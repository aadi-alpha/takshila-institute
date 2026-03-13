import React, { useEffect, useState } from 'react'
import axios from 'axios'

import EditBranch from './EditBranch'
import axiosInstance from '../../AxiosInstance'

const TableBranchList = () => {
  const [branchList, setBranchList] = useState([])
  const [EditBranchDisplay, setEditBranchDisplay] = useState({
    display: false,
    BranchId: ""
  })
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axiosInstance.get('/branch-fetch')
        if (res && res.data?.allBranches?.length) {
          setBranchList(res.data.allBranches)
        }
      } catch (error) {
       
      }
    }
    fetchBranches()
  }, [])

  return (
    <div>
      <div className='table-card-admin'>
         <div className="table-card-admin-top">
                    <p>Branch Directory</p>
                </div>
        <table className='admin-table-list'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Branch Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {branchList.length > 0 ? (
              branchList.map((value, index) => (
                <tr key={value._id}>
                  <td>{index + 1}</td>
                  <td>{value.name}</td>
                  <td>{value.mobile}</td>
                  <td>{value.email}</td>
                  <td>
                    <button
                      onClick={async () => {
                        const res = await axiosInstance.delete(
                          `/branch-delete/${value._id}`
                        )
                        alert(res.data.message)
                        window.location.reload()
                      }}
className='icon-red'
                    >
                      <i className="fa-solid fa-circle-minus"></i>
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={() => {
                      setEditBranchDisplay(prev => ({
                        ...prev,
                        display: true,
                        BranchId: value._id
                      }))
                    }}
                      className='icon-blue'><i className="fa-solid fa-pen-to-square"></i></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No Branches Exists</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {EditBranchDisplay.display === true && EditBranchDisplay.BranchId ? (<EditBranch BranchId={EditBranchDisplay.BranchId} />) : (<p></p>)}
    </div>
  )
}

export default TableBranchList
