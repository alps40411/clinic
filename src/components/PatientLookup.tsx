import React, { useState } from 'react';
import { Search, Calendar, Clock, User, Trash2, Edit3, CheckCircle, AlertCircle } from 'lucide-react';
import { mockAppointments } from '../data/mockData';
import { Appointment } from '../types/appointment';
import { formatDateDisplay, isEditDeleteAllowed, validateIdNumber } from '../utils/dateUtils';

interface PatientLookupProps {
  onEditAppointment?: (appointment: Appointment) => void;
  showAppointmentHistory?: boolean;
}

const PatientLookup: React.FC<PatientLookupProps> = ({ 
  onEditAppointment,
  showAppointmentHistory = true 
}) => {
  const [idNumber, setIdNumber] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!validateIdNumber(idNumber)) {
      setError('請輸入正確的身分證字號格式');
      return;
    }

    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userAppointments = mockAppointments.filter(
        apt => apt.patientId === idNumber
      );
      setAppointments(userAppointments);
      setHasSearched(true);
      setIsLoading(false);
    }, 500);
  };

  const handleDelete = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (appointment && !isEditDeleteAllowed(appointment.date)) {
      alert('當晚21:00後不可刪除隔天的預約紀錄');
      return;
    }

    if (window.confirm('確定要取消此預約嗎？')) {
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      // Here you would typically make an API call to delete the appointment
      alert('預約已成功取消，相關通知已發送至您的信箱和LINE');
    }
  };

  const handleEdit = (appointment: Appointment) => {
    if (!isEditDeleteAllowed(appointment.date)) {
      alert('當晚21:00後不可編輯隔天的預約紀錄');
      return;
    }
    
    onEditAppointment?.(appointment);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return '已確認';
      case 'pending': return '待確認';
      case 'cancelled': return '已取消';
      default: return '未知';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-cyan-500" />
        查詢預約紀錄
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
            身分證字號 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              id="idNumber"
              value={idNumber}
              onChange={(e) => {
                setIdNumber(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="請輸入身分證字號 (例: A123456789)"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              maxLength={10}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !idNumber}
              className="px-6 py-0 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}

            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        {hasSearched && (
          <div className="mt-6">
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>查無預約紀錄</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800 mb-3">
                  找到 {appointments.length} 筆預約紀錄
                </h3>
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-800">{appointment.doctorName}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateDisplay(appointment.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.timeSlot}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(appointment)}
                        disabled={!isEditDeleteAllowed(appointment.date)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        disabled={!isEditDeleteAllowed(appointment.date)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        取消
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientLookup;