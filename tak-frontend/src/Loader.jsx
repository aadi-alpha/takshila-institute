import React from 'react'

const Loader = ({ value }) => {

  return (
    <div className='loader-general'>
      <div className='loader'>
      </div>
      <div className="loader-outer">
      </div>
      <p className='loader-status'>{value}</p>
    </div>
  )
}

export default Loader
