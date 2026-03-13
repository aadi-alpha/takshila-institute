import axios from 'axios'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../AxiosInstance'



const EditBranch = ({ BranchId }) => {
    const [EditBranchData, setEditBranchData] = useState({
        name: '',
        email: '',
        mobile: '',
    })

    useEffect(() => {
        const fetchBranch = async () => {
            try {
                let currentData = await axiosInstance.get(`/branch-get-ById/${BranchId}`)
                setEditBranchData(currentData.data.BranchData)
            } catch (error) {
                alert(error.response?.message)
            }
        }
        fetchBranch()
    }, [BranchId])

    const handleSave = async (e) => {
        e.preventDefault()

        try {
            const res = await axiosInstance.put(
                `/update-branch/${BranchId}`,
                EditBranchData
            )
            alert(res.data.message)
            window.location.reload()

        } catch (err) {
            alert('error in editing Branch')
            console.log(err)
        }
    }

    return (
        <div className='admin-creation ' style={{ marginTop: "0px" }}>
            <form className="add-admin-card" onSubmit={handleSave}>
                <div className="top-add-admin">
                    <i className="fa-solid fa-building"></i>
                    <p>Edit Branch {EditBranchData.name}</p>
                </div>

                <div className="middle-add-admin">
                    <div className="form-fields">
                        <label>Branch Name (city name)</label>
                        <input
                            type="text"
                            placeholder=" name"
                            value={EditBranchData.name}
                            required
                            onChange={(e) =>
                                setEditBranchData(prev => ({ ...prev, name: e.target.value }))
                            }
                        />
                    </div>
                    <div className="form-fields">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="EditBranch@takshila.com"
                            value={EditBranchData.email}
                            required
                            onChange={(e) =>
                                setEditBranchData(prev => ({ ...prev, email: e.target.value.trim() }))
                            }
                        />
                    </div>

                    <div className="form-fields">
                        <label>Mobile</label>
                        <input
                            type="text"
                            placeholder="9876543210"
                            value={EditBranchData.mobile}
                            minLength={10}
                            maxLength={10}
                            required
                            onChange={(e) =>
                                setEditBranchData(prev => ({ ...prev, mobile: e.target.value.trim() }))
                            }
                        />
                    </div>
                </div>

                <div className="bottom-add-admin">
                    <button type="submit">Update Branch</button>
                </div>
            </form>
        </div>
    )
}

export default EditBranch
