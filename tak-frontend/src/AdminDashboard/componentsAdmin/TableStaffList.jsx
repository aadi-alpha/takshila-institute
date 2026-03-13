import React, { useEffect, useState } from 'react'
import axios from 'axios'

import EditUser from '../../components/EditUser'
import axiosInstance from '../../AxiosInstance'
import { useBranchId } from '../../Context/BranchContext'

const TableStaffList = () => {
    const { BranchId } = useBranchId()
    const [TableLoader, setTableloader] = useState(false)
    const [StaffList, setStaffList] = useState([])
    const [EditUserDisplay, setEditUserDisplay] = useState({
        display: false,
        userId: ""
    })
    useEffect(() => {
        const fetchStaffData = async () => {
            setTableloader(true)
            try {
                let res = await axiosInstance.get(
                    `/role-based-users?role=teacher,receptionist&branch=${BranchId}`
                );
                if (res.data?.Users?.length > 0) {
                    setStaffList(res.data.Users);
                    setTableloader(false)
                } else {
                    console.log("No users found for this branch and roles");
                    setStaffList([]);
                    setTableloader(false)// clear previous list
                }


            } catch (error) {
                console.error("Error fetching staff:", error);
            }
            setTableloader(false)
        }

        fetchStaffData();
    }, [BranchId]);


    return (
        <div>
            <div className='table-card-admin' style={{ marginTop: "30px" }}>

                <table className='admin-table-list'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Full Name</th>
                            <th>Mobile</th>
                            <th>Branch</th>
                            <th>Role</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>

                    </thead>
                    <tbody>
                        {TableLoader === false ? (
                            StaffList.length > 0 ? (StaffList.map((value, index) => {
                                return <tr key={value._id}>
                                    <td>{index + 1}</td>
                                    <td>{value.name}</td>
                                    <td>{value.mobile}</td>

                                    <td>{value.branch.toUpperCase()}</td>
                                    <td>{value.role.toUpperCase()}</td>
                                    <td>{value.TotalSalary}</td>
                                    <td><button onClick={async () => {
                                        if (!window.confirm("Are You sure you want to delete")) return
                                        let deletedUser = await axiosInstance.delete(`/delete-user-takshila/${value._id}`)
                                        alert(deletedUser.data.message)
                                        window.location.reload()
                                    }} className='icon-red'><i className="fa-solid fa-circle-minus"></i></button>
                                        {/* edit */}
                                        &nbsp; &nbsp;
                                        <button onClick={() => {
                                            setEditUserDisplay(prev => ({
                                                ...prev,
                                                display: true,
                                                userId: value._id
                                            }))
                                        }}
                                            className='icon-blue'><i className="fa-solid fa-pen-to-square"></i></button>
                                    </td>
                                </tr>
                            })) : (<tr><td colSpan={7}>No Staffs Exists</td></tr>)
                        ) : (<tr><td colSpan={7} style={{ fontSize: "clamp(16px,2vw,18px)", fontWeight: "bold", textAlign: "center", }}>Loading...</td></tr>)}
                    </tbody>
                </table>

            </div>
            {EditUserDisplay.display === true && EditUserDisplay.userId ? (<EditUser UserId={EditUserDisplay.userId} />) : ('')}

        </div >
    )
}

export default TableStaffList