import React from 'react'
import takshilaLogo from '../assets/takshilaLogo.png'



const RegNav = () => {
  return (
    <div>
      <nav className='stu-reg-nav'>
        <img src={takshilaLogo} alt="takshila institute logo" />
        <div className="nav-right">
          <h2>ADMISSION FORM</h2>
          <p>NEET | JEE | 10 | 12</p>
        </div>
      </nav>
    </div>
  )
}

export default RegNav