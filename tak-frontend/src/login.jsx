import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Loader from './Loader'
import axiosInstance from './AxiosInstance'

import { useBranchId } from './Context/BranchContext'
import RegNav from './components/reg-nav'
import LoginNav from './LoginNav'
import Background from './assets/Takshila_Web_Bg.png'


const Login = () => {
    const { setBranchId } = useBranchId()
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false)
    const [formData, setFormData] = useState({
        mobile: '',
        password: ''
    })
    const submitHandler = async (e) => {
        e.preventDefault()
        setLoader(true)
        try {
            if (formData.mobile && formData.password) {
                let res = await axiosInstance.post("/UserTakshila-fetch-login", formData)
                console.log(res)
                if (res.status === 200 && res.data?.user) {
                    const LoggedInUserTakshila = {
                        userId: res.data.user.id,
                        userRole: res.data.user.role,

                        token: res.data.token
                    }
                    
                    if (res.data.user.branchId) {
                        LoggedInUserTakshila.branchId = res.data.user.branchId
                    }
                    localStorage.setItem(
                        "LoggedInUserTakshila",
                        JSON.stringify(LoggedInUserTakshila)
                    );
                    if (res?.data?.user?.branchId) {
                        setBranchId(res.data.user.branchId);
                    }


                    let MyDetails = JSON.parse(localStorage.getItem("LoggedInUserTakshila"))


                    if (MyDetails.userId && MyDetails.userRole.toString() == "superAdmin") {
                        navigate(`/super-admin/${MyDetails.userId}`);
                        return
                    }
                    if (MyDetails.userId && MyDetails.userRole.toString() == "admin") {
                        navigate(`/admin/${MyDetails.userId}`);
                        return
                    }
                     if (MyDetails.userId && MyDetails.userRole.toString() == "receptionist") {
                        navigate(`/receptionist/${MyDetails.userId}`);
                        return
                    }
                    


                }
            } else {

                alert("fill all fields")
            }

        } catch (error) {
            console.log(error)
            alert(error.response.data.message)
            alert("please fill correct details", error)
        }
        setLoader(false)
    }
    return (
       <>
       <LoginNav />
        <div className='login-takshila'>
          <div className="backgroundImageLogo">
                            <img src={Background} alt="takshila-institute-logo" />
                        </div>
            {loader == true ? (<Loader value={'logging in..'} />) : (<p></p>)}
            <form className="login-outer" onSubmit={submitHandler}>
           
                <div className="secured">
                    <i className="fa-solid fa-key"></i>
                    <p>Secured Portal</p>
                </div>
                <h2>Takshilian Login</h2>
                <p className='welcome-text'>Welcome back. Please enter your credentials to access the Takshila Management Portal.</p>
                <div className="login-fields">
                    <label >Username or ID</label>
                    <input type="text" placeholder='Enter your Username' value={formData.mobile} required minLength={10} maxLength={10} onChange={(e) => {
                        setFormData((prev) => ({
                            ...prev,
                            mobile: e.target.value.trim()
                        }))
                    }} />
                </div>
                <div className="login-fields">
                    <div className="password-top">
                        <label >Password</label>
                       
                    </div>
                    <input type="text" placeholder='Enter your password' value={formData.password} required onChange={(e) => {
                        setFormData((prev) => ({
                            ...prev,
                            password: e.target.value.trim()
                        }))

                    }} />
                    <button type='submit' className='submit-login'>Login&nbsp;Now&nbsp;<i className="fa-solid fa-arrow-right-from-bracket"></i></button>
                </div>
                <p className='trouble-login'>Have trouble logging in? <br /> <span style={{ color: "black" }}>Contact IT support</span></p>
                <p className='copyright-login'>  © 2026 | Takshila Institute. All Rights Reserved.</p>
                <p className='copyright-login'>--Aadi--</p>
            </form>
            

        </div>
       </>
    )
}

export default Login
