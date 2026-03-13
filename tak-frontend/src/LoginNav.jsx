import React from 'react'
import takshilaLogo from './assets/takshilaLogo.png'



const LoginNav = () => {
  return (
    <div>
      <nav className='login-nav'>
        <img src={takshilaLogo} alt="takshila institute logo" />
        <div className="nav-right">
          <h2>LOGIN TAKSHILA</h2>
          <p>NEET | JEE | 10 | 12</p>
        </div>
      </nav>
    </div>
  )
}

export default LoginNav