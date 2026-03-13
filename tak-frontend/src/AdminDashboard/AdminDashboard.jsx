import React, { useEffect } from 'react'
import NavAdmin from './NavAdmin'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useBranchId } from '../Context/BranchContext';
import axiosInstance from '../AxiosInstance';
import takshilaLogo from '../assets/takshilaLogo.png'
import Background from '../assets/Takshila_Web_Bg.png'

const AdminDashboard = () => {
  const { BranchId } = useBranchId();
  const navigate = useNavigate()
  useEffect(() => {
    const isValidUser = async () => {
      try {
        let { userId, userRole } = JSON.parse(localStorage.getItem('LoggedInUserTakshila'))

        if (userId || userRole) {
          let logedInUserDb = await axiosInstance.get(`/UserTakshila-fetch-id/${userId}`)

          if (logedInUserDb && logedInUserDb.data.UserTakshila.role === 'admin' && logedInUserDb.data.UserTakshila.branchId === BranchId) {
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
        console.log(error)
        localStorage.removeItem('LoggedInUserTakshila')
        navigate('/', { replace: true })
      }
    }
    isValidUser()
  }, [BranchId, navigate])


  return (
    // create view edit receptionsists
    // '' teachers 
    // salary record of all receptionsists and teachers 
    // students view by batch edit and delete
    // attendance of students 
    // test marks upload of all students 
    // students fees management (date , month )

    <div>
      <NavAdmin />
      <div className='content-dashboards'>
        <div className="backgroundImageLogo">
          <img src={Background} alt="takshila-institute-logo" />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard
