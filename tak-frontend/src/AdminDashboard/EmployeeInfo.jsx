
import React from 'react'
import EmployeeCreation from './componentsAdmin/EmployeeCreation'
import TableStaffList from './componentsAdmin/TableStaffList'



// name , email , mobile, password , role , branch id 
const EmployeeInfo = () => {

  return (
    <div>

      <EmployeeCreation />
      <TableStaffList />
    </div>


  )
}

export default EmployeeInfo
