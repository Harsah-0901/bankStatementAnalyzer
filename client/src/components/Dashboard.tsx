import React from 'react'
import { useEffect } from 'react';
import CategoriesPieChart from '../charts/CategoriesPieChart';
import BarcChart from '../charts/BarcChart';
import LinecChart from '../charts/LinecChart';
import TinyBarChart from '../charts/TinyBarChart';
import DescriptionTable from '../charts/DescriptionTable';




export default function Dashboard() {
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("statementData"));
    if (storedData) {
      console.log("Loaded statement data:", storedData);
      // Use this data in your component state
    }
  }, []);
  return (
    <div className='w-full h-screen border-2 border-red-500 flex flex-row'>
      <div className='w-1/2 border-2 border-red-500 h-screen'>
        <div className='w-full border-2 border-red-800 h-1/2 flex items-center justify-center'><CategoriesPieChart/></div>
        <div className='w-full border-2 border-red-800 h-1/2'><BarcChart/></div>
      </div>
      <div className='w-1/2 border-2 border-red-500 h-screen'>
        <div className='w-full border-2 border-red-800 h-1/2'><LinecChart/></div>
        <div className='w-full border-2 border-red-800 h-1/2 flex-row flex'>
          <div className='w-1/2 border-2 border-red-500 h-full flex items-center justify-center'><TinyBarChart/></div>
          <div className='w-1/2 border-2 border-red-500 h-full'><DescriptionTable/></div>
        </div>
      </div>
      
    </div>
  )
}
