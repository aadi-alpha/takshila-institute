import { Link, Outlet, useNavigate } from "react-router-dom";
import NavSuperAdmin from "./Components/NavSuperAdmin";
import { useBranchId } from "../Context/BranchContext";
import { useEffect } from "react";
import axiosInstance from "../AxiosInstance";
import takshilaLogo from '../assets/takshilaLogo.png'
import Background from '../assets/Takshila_Web_Bg.png'

const SuperAdminDashboard = () => {
  const { BranchId } = useBranchId();
  const navigate = useNavigate()
  useEffect(() => {
    const isValidUser = async () => {
      try {
        let { userId, userRole } = JSON.parse(localStorage.getItem('LoggedInUserTakshila'))


        if (userId || userRole) {
          let logedInUserDb = await axiosInstance.get(`/UserTakshila-fetch-id/${userId}`)
          if (logedInUserDb && logedInUserDb.data.UserTakshila.role === 'superAdmin') {
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
    <div className="dashboard">
      <NavSuperAdmin />
      <div className='content-dashboards'>
        <div className="backgroundImageLogo">
          <img src={Background} alt="takshila-institute-logo" />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
