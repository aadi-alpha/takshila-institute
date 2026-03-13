import React, { useEffect, useState } from 'react'
import axios from 'axios'

import EditUser from '../../components/EditUser'
import axiosInstance from '../../AxiosInstance'

const TableAdminList = () => {
    const [adminList, setAdminList] = useState([])
    const [EditUserDisplay, setEditUserDisplay] = useState({
        display: false,
        userId: ""
    })

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                let AdminList = await axiosInstance.get(`/role-based-users?role=admin`)
                if (AdminList && AdminList.data?.Users?.length) {
                    setAdminList(AdminList.data.Users)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAdminData()
    }, [])
    return (
        <div>
            <div className='table-card-admin'>
                <div className="table-card-admin-top">
                    <p>Admin Directory</p>
                </div>
                <table className='admin-table-list'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Full Name</th>
                            <th>Mobile</th>
                            <th>Branch</th>
                            <th>Actions</th>
                        </tr>

                    </thead>
                    <tbody>
                        {adminList.length > 0 ? (adminList.map((value, index) => {
                            return <tr key={value._id}>
                                <td>{index + 1}</td>
                                <td>{value.name}</td>
                                <td>{value.mobile}</td>
                                <td>{value.branch}</td>
                                <td><button onClick={async () => {
                                    if (!window.confirm("Are You sure you want to delete")) return
                                    let deletedUser = await axiosInstance.delete(`/delete-user-takshila/${value._id}`)
                                    alert(deletedUser.data.message)
                                    window.location.reload()
                                }} className='icon-red'><i className="fa-solid fa-circle-minus"></i></button>
                                    {/* edit */}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <button onClick={() => {
                                        setEditUserDisplay(prev => ({
                                            ...prev,
                                            display: true,
                                            userId: value._id
                                        }))
                                    }}
                                        className='icon-blue'  ><i className="fa-solid fa-pen-to-square"></i></button>
                                </td>
                            </tr>
                        })) : (<tr><td>No Admins Exists</td></tr>)}
                    </tbody>
                </table>

            </div>
            {EditUserDisplay.display === true && EditUserDisplay.userId ? (<EditUser UserId={EditUserDisplay.userId} />) : (<p></p>)}

        </div >
    )
}

export default TableAdminList
