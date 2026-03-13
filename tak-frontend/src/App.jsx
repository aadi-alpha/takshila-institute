import React, { useEffect } from 'react'
import { Routes, Route, BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import StuReg from './StuReg';
import './app.css';
import Login from './login';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import AdminLanding from './AdminDashboard/AdminLanding';
import AdminCreation from './superAdminDash/AdminCreation';
import AdminNotFound from './AdminNotFound';
import StudentView from './components/StudentView'
import StudentEdit from './AdminDashboard/componentsAdmin/EditStudent';
import SuperAdminDashboard from './superAdminDash/SuperAdminDashboard';

import ProtectedRoute from './ProtectedRoute';
import BranchCreation from './superAdminDash/CreateBranch';
import EmployeeInfo from './AdminDashboard/EmployeeInfo';
import SalaryInfo from './AdminDashboard/SalaryInfo';
import TestsLanding from './components/TestsLanding';
import AttendanceLanding from './AdminDashboard/AttendanceLanding';
import FeeRecordLanding from './components/FeeRecordLanding';
import ReceptionistDashboard from './Receptionist/ReceptionistDashboard';
import ReceptionistLanding from './Receptionist/ReceptionistLanding';
import BatchInsertion from './superAdminDash/Components/BatchInsertion';



const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    let MyDetails = JSON.parse(localStorage.getItem("LoggedInUserTakshila"))
    if (!MyDetails) return
    const user = MyDetails.userId
    const role = MyDetails.userRole
    if (
      user &&
      role === "superAdmin" &&
      (location.pathname === "/" || location.pathname === "/login")
    ) {
      navigate(`/super-admin/${user}`, { replace: true });
      return
    }
    if (
      user &&
      role === "admin" &&
      (location.pathname === "/" || location.pathname === "/login")
    ) {
      navigate(`/admin/${user}`, { replace: true });
      return
    }
    if (
      user &&
      role === "receptionist" &&
      (location.pathname === "/" || location.pathname === "/login")
    ) {
      navigate(`/receptionist/${user}`, { replace: true });
      return
    }
  }, [navigate, location.pathname]);

  return (

    <Routes>
      <Route path="/" element={<Login />} />
      {/* super admin paths */}
      <Route element={<ProtectedRoute allowedRole="superAdmin" />}>
        <Route path='/super-admin/:id/*' element={<SuperAdminDashboard />} >
          <Route index element={<AdminCreation />} />
          <Route path='register-student' element={<StuReg />} />
          <Route path="create-branch" element={<BranchCreation />} />
          <Route path="*" element={<AdminNotFound />} />
          <Route path="batch-create" element={<BatchInsertion />} />
        </Route>
      </Route>

      {/* admin paths */}
      <Route element={<ProtectedRoute allowedRole="admin" />} >
        <Route path='/admin/:id/*' element={<AdminDashboard />} >
          <Route path='register-student' element={<StuReg />} />
          <Route index element={<AdminLanding />} />
          <Route path='student-view/:idSt' element={<StudentView />} />
          <Route path='student-edit/:idSt' element={<StudentEdit />} />
          <Route path='employee-info' element={<EmployeeInfo />} />
          <Route path='employee-salary' element={<SalaryInfo />} />
          <Route path='test-record' element={<TestsLanding />} />
          <Route path='attendance-record' element={<AttendanceLanding />} />
          <Route path='fee-record' element={<FeeRecordLanding />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>
      </Route>
      {/* receptionist paths */}
      <Route element={<ProtectedRoute allowedRole={"receptionist"} />}>
        <Route path='/receptionist/:id/*' element={<ReceptionistDashboard />}>
          <Route path='register-student' element={<StuReg />} />
          <Route index element={<ReceptionistLanding />} />
          <Route path='student-view/:idSt' element={<StudentView />} />
          <Route path='test-record' element={<TestsLanding />} />
          <Route path='attendance-record' element={<AttendanceLanding />} />
          <Route path='fee-record' element={<FeeRecordLanding />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>
      </Route>

      {/* extra 404 not  found */}
      <Route path="*" element={<AdminNotFound />} />
    </Routes>

  )
}
// reports making on tests ,attendance , 

export default App

