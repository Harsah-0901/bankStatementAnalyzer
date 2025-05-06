import React from 'react'
import Login from '../components/Login'
import Register from '../components/Register'

export default function SignupPage() {
  return (
    <div
      className="w-full h-screen flex bg-black bg-gradient-to-r from-[#161A30] to-[#31304D] gap-6"
      
    >
      <div className="w-1/2 h-full flex items-center justify-center">
        <Login />
      </div>
      <div className="w-1/2 h-full flex items-center justify-center">
        <Register />
      </div>
    </div>
  )
}
