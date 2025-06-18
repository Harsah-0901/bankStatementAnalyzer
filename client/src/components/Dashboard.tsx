import React, { useEffect } from 'react';
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
    }
  }, []);

  return (
    <div className="grid grid-rows-2 h-screen w-screen gap-2 p-2 box-border bg-gray-50 overflow-hidden">
      {/* Top Row with 25%-75% width split */}
      <div className="grid grid-cols-[1fr_3fr] gap-2 h-full overflow-hidden flex items-center justify-center">
        <div className="bg-white shadow rounded-xl  p-2 overflow-hidden">
          <div className="w-full h-full max-h-full max-w-full">
            <CategoriesPieChart />
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-2 overflow-hidden">
          <div className="w-full h-full max-h-full max-w-full">
            <LinecChart />
          </div>
        </div>
      </div>

      {/* Bottom Row with 50%-50% width split */}
      <div className="grid grid-cols-2 gap-2 h-full overflow-hidden">
        <div className="bg-white shadow rounded-xl p-2 overflow-hidden">
          <div className="w-full h-full max-h-full max-w-full">
            <BarcChart />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 overflow-hidden ">
          <div className="bg-white shadow rounded-xl p-2 overflow-hidden flex items-center justify-center">
            <div className="w-full h-full max-h-full max-w-full flex justify-center items-center">
              <TinyBarChart />
            </div>
          </div>
          <div className="bg-white shadow rounded-xl p-2 overflow-auto">
            <DescriptionTable />
          </div>
        </div>
      </div>
    </div>
  );
}
