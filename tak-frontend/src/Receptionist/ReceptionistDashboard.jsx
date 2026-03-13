import React, { useEffect } from 'react'
import { useBranchId } from '../Context/BranchContext';
import { Outlet, useNavigate } from 'react-router-dom';
import axiosInstance from '../AxiosInstance';
import NavReceptionist from './components/NavReceptionist';
import takshilaLogo from '../assets/takshilaLogo.png'
import Background from '../assets/Takshila_Web_Bg.png'

const ReceptionistDashboard = () => {
    const { BranchId } = useBranchId();
    const navigate = useNavigate()
    useEffect(() => {
        const isValidUser = async () => {
            try {
                let { userId, userRole } = JSON.parse(localStorage.getItem('LoggedInUserTakshila'))


                if (userId || userRole) {
                    let logedInUserDb = await axiosInstance.get(`/UserTakshila-fetch-id/${userId}`)
                    if (logedInUserDb && logedInUserDb.data.UserTakshila.role === 'receptionist') {
                        return
                    } else {
                        localStorage.removeItem('LoggedInUserTakshila')
                        navigate('/', { replace: true })
                    }
                } else {
                    localStorage.removeItem('LoggedInUserTakshila')
                    navigate('/', { replace: true })
                }
            } catch (error) {
                localStorage.removeItem('LoggedInUserTakshila')
                navigate('/', { replace: true })
            }
        }
        isValidUser()
    }, [BranchId, navigate])
    return (
        <div>
            <NavReceptionist />
            <div className='content-dashboards'>
                <div className="backgroundImageLogo">
                    <img src={Background} alt="takshila-institute-logo" />
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default ReceptionistDashboard
