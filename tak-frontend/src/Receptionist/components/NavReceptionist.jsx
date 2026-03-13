import React, { useEffect, useState } from 'react';
import { Link, replace, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import TopLeftNav from '../../TopLeftNav';


const NavReceptionist = () => {
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
                    <li><Link to={`/receptionist/${id}/register-student`}><i className="fa-solid fa-people-group"></i>Register Student</Link></li>
                    <li><Link to={`/receptionist/${id}`}><i className="fa-solid fa-people-group"></i> Admissions</Link></li>
                    <li><Link to={`/receptionist/${id}/test-record`}><i className="fa-solid fa-square-poll-horizontal"></i>Tests</Link></li>
                    <li><Link to={`/receptionist/${id}/attendance-record`}><i className="fa-solid fa-clipboard-user"></i>Attendance</Link></li>
                    <li><Link to={`/receptionist/${id}/fee-record`}><i className="fa-solid fa-comment-dollar"></i>Fees</Link></li>
                    {/* <li><Link to={`/receptionist/${id}/employee-info`}><i className="fa-solid fa-address-book"></i>Employees</Link></li>
                    <li><Link to={`/receptionist/${id}/employee-salary`}><i className="fa-solid fa-comment-dollar"></i>Salary</Link></li>
                    <li><Link to={`/receptionist/${id}/test-record`}><i className="fa-solid fa-square-poll-horizontal"></i>Tests</Link></li>
                    <li><Link to={`/receptionist/${id}/attendance-record`}><i className="fa-solid fa-clipboard-user"></i>Attendance</Link></li>
                    <li><Link to={`/receptionist/${id}/fee-record`}><i className="fa-solid fa-comment-dollar"></i>Fees</Link></li> */}
                </ul>
                <button onClick={() => {
                    localStorage.removeItem("roleTakshila")
                    localStorage.removeItem("LoggedInUserTakshila")
                    navigate('/', { replace: true })
                }}>Logout</button>
            </div>
        </div>
    )
}

export default NavReceptionist;
