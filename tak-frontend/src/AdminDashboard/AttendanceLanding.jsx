import React, { useState } from 'react'
import EditTest from '../components/EditTest'
import ViewTest from '../components/ViewTest'
import EditAttendance from '../components/EditAttendance'
import ViewAttendance from '../components/ViewAttendance'

const AttendanceLanding = () => {
  const [screenSwitch, setScreenSwitch] = useState('edit')

  return (
    <div className='records-manage'>
      <div className='top'>
        <div>
          <h1>Attendance Management</h1>
          <p className='head-para'>Manage and track all students' attendance record</p>
        </div>
        <div className="test-switch">
          <input
            type="radio"
            id="editAttendance"
            name="screenSwitch"
            value="edit"
            checked={screenSwitch === "edit"}
            onChange={() => setScreenSwitch("edit")}
          />
          <label htmlFor="editAttendance">Enter</label>

          <input
            type="radio"
            id="viewAttendance"
            name="screenSwitch"
            value="view"
            checked={screenSwitch === "view"}
            onChange={() => setScreenSwitch("view")}
          />
          <label htmlFor="viewAttendance">View</label>
        </div>

      </div>
      {screenSwitch === 'edit' ? (<EditAttendance />) : (<ViewAttendance />)}

    </div>
  )
}

export default AttendanceLanding
