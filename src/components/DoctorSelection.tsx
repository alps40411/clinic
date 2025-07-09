import React from 'react';
import { User, Stethoscope, Loader2, AlertCircle } from 'lucide-react';
import { Doctor } from '../types/appointment';
import { useDoctors } from '../hooks/useDoctors';

interface DoctorSelectionProps {
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const DoctorSelection: React.FC<DoctorSelectionProps> = ({ selectedDoctor, onSelectDoctor }) => {
  const { doctors, loading, error } = useDoctors();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-cyan-500" />
        選擇醫師
      </h2>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-500 mr-2" />
          <span className="text-gray-600">載入醫師資訊中...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center py-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800 text-sm">
            無法載入最新醫師資訊，顯示本地資料
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            onClick={() => onSelectDoctor(doctor)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedDoctor?.id === doctor.id
                ? 'border-cyan-500 bg-cyan-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{doctor.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{doctor.specialty}</p>
              </div>
              {selectedDoctor?.id === doctor.id && (
                <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSelection;