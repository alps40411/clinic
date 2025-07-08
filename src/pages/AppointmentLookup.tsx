import React from 'react';
import { Search } from 'lucide-react';
import PatientLookup from '../components/PatientLookup';

function AppointmentLookup() {
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">查詢預約</h2>
            <p className="text-sm text-gray-500">查看您的預約記錄</p>
          </div>
        </div>

        <PatientLookup />
      </div>
    </div>
  );
}

export default AppointmentLookup; 