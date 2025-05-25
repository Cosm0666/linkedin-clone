import React from 'react'
import Navbar from './Navbar'

const Layout = ({children}) => {
  return (
    <div className='min-h-screen' style={{background: "#F3F2EF"}}>
      <Navbar />
      <main className='max-w-7x1 max-auto px-4 py-6'>{children}</main>
    </div>
  )
}

export default Layout