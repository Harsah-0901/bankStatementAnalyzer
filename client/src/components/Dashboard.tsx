import React from 'react'



export default function Dashboard() {
  return (
    <div className='w-full h-screen border-2 border-red-500 flex flex-row'>
      <div className='w-1/2 border-2 border-red-500 h-screen'>
        <div className='w-full border-2 border-red-800 h-1/2'>Category wise spending summary</div>
        <div className='w-full border-2 border-red-800 h-1/2'>Total Spending by Category</div>
      </div>
      <div className='w-1/2 border-2 border-red-500 h-screen'>
        <div className='w-full border-2 border-red-800 h-1/2'>spending trend</div>
        <div className='w-full border-2 border-red-800 h-1/2 flex-row flex'>
          <div className='w-1/2 border-2 border-red-500 h-full'>Total Spending</div>
          <div className='w-1/2 border-2 border-red-500 h-full'>top 5 transactions</div>
        </div>
      </div>
      
    </div>
  )
}
