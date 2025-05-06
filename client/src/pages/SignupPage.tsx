import React from 'react'
import Login from '../components/Login'
import Register from '../components/Register'

export default function SignupPage() {
  return (
    <div className="w-full h-screen flex" style={{ 
      background: 'linear-gradient(to right, #161A30, #31304D)',
      backgroundImage: 'linear-gradient(to right, #161A30, #31304D)'
    }}>
      <div className="w-1/2 h-full flex items-center justify-center bg-gray-100">
        <Login />
      </div>
      <div className="w-1/2 h-full flex items-center justify-center bg-white">
        <Register />
      </div>
    </div>
  )
}