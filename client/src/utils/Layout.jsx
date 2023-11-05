import React from 'react'
import Navbar from '../components/Layouts/Navbar'
import Footer from '../components/Layouts/Footer'

const Layout = ({children}) => {
  return (
    <div>
        <Navbar />
        {children}
        <Footer />
    </div>
  )
}

export default Layout