import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Candidate = () => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <Navbar />
      <main className="flex-1 overflow-auto p-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Candidate;
