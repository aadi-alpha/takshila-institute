import axios from 'axios'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../AxiosInstance'



const EditUser = ({ UserId }) => {
    const [EditUserData, setEditUserData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    })
    console.log(UserId)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                let currentData = await axiosInstance.get(`/UserTakshila-fetch-id/${UserId}`)
                if (currentData.data.UserTakshila) {
                    console.log(currentData.data.UserTakshila)
                    setEditUserData(currentData.data.UserTakshila)
                }
            } catch (error) {
                alert(error.respone?.message)
            }
        }
        fetchUser()
    }, [UserId])

    const handleSave = async (e) => {
        e.preventDefault()

        try {
            console.log(EditUserData)
            const res = await axiosInstance.put(
                `/UserTakshila-update/${UserId}`,
                EditUserData
            )
            alert(res.data.message)
            window.location.reload()

        } catch (err) {
            alert('error in editing user')
            console.log(err)
        }
    }

    return (
        <div className='admin-creation ' style={{ marginTop: "0px" }}>
            <form className="add-admin-card" onSubmit={handleSave}>
                <div className="top-add-admin">
                    <i className="fa-solid fa-building"></i>
                    <p>Edit User {EditUserData.name}</p>
                </div>

                <div className="middle-add-admin">
                    <div className="form-fields">
                        <label htmlFor='role'>Role:- </label>
                        <select name="role" id="role" value={EditUserData.role} onChange={(e) => {
                            setEditUserData((prev) => ({
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
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder=" name"
                            value={EditUserData.name}
                            required
                            onChange={(e) =>
                                setEditUserData(prev => ({ ...prev, name: e.target.value }))
                            }
                        />
                    </div>

                    <div className="form-fields">
                        <label>Password</label>
                        <input
                            type="text"
                            placeholder="password"
                            value={EditUserData.password}
                            required
                            onChange={(e) =>
                                setEditUserData(prev => ({ ...prev, password: e.target.value }))
                            }
                        />
                    </div>

                    <div className="form-fields">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="EditUser@takshila.com"
                            value={EditUserData.email}
                            required
                            onChange={(e) =>
                                setEditUserData(prev => ({ ...prev, email: e.target.value.trim() }))
                            }
                        />
                    </div>

                    <div className="form-fields">
                        <label>Mobile</label>
                        <input
                            type="text"
                            placeholder="9876543210"
                            value={EditUserData.mobile}
                            minLength={10}
                            maxLength={10}
                            required
                            onChange={(e) =>
                                setEditUserData(prev => ({ ...prev, mobile: e.target.value.trim() }))
                            }
                        />
                    </div>
                </div>

                <div className="bottom-add-admin">
                    <button type="submit">Update User</button>
                </div>
            </form>
        </div>
    )
}

export default EditUser
