import React, { useState } from 'react'
import EditTest from './EditTest'
import ViewTest from './ViewTest'

const TestsLanding = () => {
  const [screenSwitch, setScreenSwitch] = useState('edit')

  return (
    <div className='records-manage'>
      <div className='top'>
        <div>
          <h1>Tests Management</h1>
          <p className='head-para'>Manage and track all institute admissions and payment statuses</p>
        </div>
        <div className="test-switch">
          <input
            type="radio"
            id="editMarks"
            name="screenSwitch"
            value="edit"
            checked={screenSwitch === "edit"}
            onChange={() => setScreenSwitch("edit")}
          />
          <label htmlFor="editMarks">Enter Marks</label>

          <input
            type="radio"
            id="viewMarks"
            name="screenSwitch"
            value="view"
            checked={screenSwitch === "view"}
            onChange={() => setScreenSwitch("view")}
          />
          <label htmlFor="viewMarks">View Marks</label>
        </div>

      </div>
      {screenSwitch === 'edit' ? (<EditTest />) : (<ViewTest />)}

    </div>
  )
}

export default TestsLanding
