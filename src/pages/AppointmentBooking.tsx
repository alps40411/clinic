import React, { useState } from 'react';
import { CheckCircle, ArrowLeft, Search, Calendar } from 'lucide-react';
import DoctorSelection from '../components/DoctorSelection';
import DateSelection from '../components/DateSelection';
import TimeSlotSelection from '../components/TimeSlotSelection';
import BookingForm from '../components/BookingForm';
import PatientLookup from '../components/PatientLookup';
import { Doctor, Appointment } from '../types/appointment';

type ViewMode = 'booking' | 'lookup' | 'success';

const AppointmentBooking: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('booking');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  const handleBookingSubmit = (patientInfo: any) => {
    setAppointmentData(patientInfo);
    setCurrentView('success');
  };

  const handleEditAppointment = (appointment: Appointment) => {
    // Load appointment data for editing
    console.log('Editing appointment:', appointment);
    // You would typically load the appointment data and switch to booking view
    setCurrentView('booking');
  };

  const resetBooking = () => {
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setAppointmentData(null);
    setCurrentView('booking');
  };

  if (currentView === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">預約成功！</h2>
            <p className="text-gray-600 mb-4">
              您的預約已成功送出，我們將在24小時內與您確認預約時間。
            </p>
            
            {appointmentData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium text-gray-800 mb-2">預約資訊</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>醫師：{appointmentData.doctorName}</p>
                  <p>日期：{appointmentData.date}</p>
                  <p>時間：{appointmentData.timeSlot}</p>
                  <p>姓名：{appointmentData.name}</p>
                  <p>電話：{appointmentData.phone}</p>
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mb-6">
              預約確認通知將發送至您的電子信箱和LINE
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={resetBooking}
                className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200"
              >
                預約其他時段
              </button>
              <button
                onClick={() => setCurrentView('lookup')}
                className="flex-1 px-4 py-2 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200"
              >
                查看預約紀錄
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'lookup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentView('booking')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              返回預約
            </button>
            <h1 className="text-xl font-bold text-gray-800">預約紀錄查詢</h1>
            <div className="w-16"></div>
          </div>

          <PatientLookup onEditAppointment={handleEditAppointment} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-500" />
            門診預約
          </h1>
          {/* <button
            onClick={() => setCurrentView('lookup')}
            className="flex items-center gap-2 px-4 py-2 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200"
          >
            <Search className="w-4 h-4" />
            查詢預約
          </button> */}
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">請依序選擇醫師、日期和時段完成預約</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              selectedDoctor ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-8 h-1 ${selectedDoctor ? 'bg-cyan-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              selectedDate ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`w-8 h-1 ${selectedDate ? 'bg-cyan-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              selectedTimeSlot ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex space-x-4 text-xs text-gray-500">
            <span className={selectedDoctor ? 'text-cyan-600 font-medium' : ''}>選擇醫師</span>
            <span className={selectedDate ? 'text-cyan-600 font-medium' : ''}>選擇日期</span>
            <span className={selectedTimeSlot ? 'text-cyan-600 font-medium' : ''}>選擇時段</span>
          </div>
        </div>

        {/* Booking Steps */}
        <DoctorSelection
          selectedDoctor={selectedDoctor}
          onSelectDoctor={setSelectedDoctor}
        />

        {selectedDoctor && (
          <DateSelection
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}

        {selectedDoctor && selectedDate && (
          <TimeSlotSelection
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={setSelectedTimeSlot}
          />
        )}

        {selectedDoctor && selectedDate && selectedTimeSlot && (
          <BookingForm
            selectedDoctor={selectedDoctor}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onSubmit={handleBookingSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;