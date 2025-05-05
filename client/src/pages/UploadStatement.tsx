import React from 'react';
import Upload from '../components/Upload';
import StatementList from '../components/StatementList';

export default function UploadStatement() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col gap-8">
      <div className="md:w-1/2 w-full">
        <Upload />
      </div>
      <div className="md:w-1/2 w-full">
        <StatementList />
      </div>
    </div>
  );
}
