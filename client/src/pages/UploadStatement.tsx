import React from 'react';
import Upload from '../components/Upload';
import StatementList from '../components/StatementList';

export default function UploadStatement() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#161A30] to-[#31304D] p-8 flex flex-col gap-8 border-2 border-red-500 items-center justify-center">
      <div className="md:w-1/2 w-full bg-gray-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-100">
        <Upload />
      </div>
      <div className="md:w-1/2 w-full">
        <StatementList />
      </div>
    </div>
  );
}
