import React, { useEffect, useState } from 'react';
import { Link, replace, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import TopLeftNav from '../../TopLeftNav';


const NavUser = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);


  return (
    <div className="nav-admin">
      <div className="top-nav-admin">

        <TopLeftNav />
        <div className="top-right" onClick={toggleMenu}>
          <div className={`hamburger ${open ? 'open' : ''}`} >
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      <div className={`left-nav-admin ${open ? 'show' : ''}`}>
        <ul>
          <li><Link to={`/super-admin/${id}`}> Create Admin</Link></li>
          <li><Link to={`/super-admin/${id}/create-branch`}> Create Branch</Link></li>
          <li><Link to={`/super-admin/${id}/batch-create`}>Create Batch</Link></li>
        </ul>
        {/* <li><Link to={`/admin/${id}/admin-create`}><i className="fa-solid fa-lock"></i> New Admin</Link></li> */}
        <button onClick={() => {
   
          localStorage.removeItem("LoggedInUserTakshila")
          navigate('/', { replace: true })
        }}>Logout</button>
      </div>
    </div>
  )
}

export default NavUser;
