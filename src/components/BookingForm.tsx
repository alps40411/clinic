import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, CheckCircle, Search, Loader2, AlertCircle } from 'lucide-react';
import { Doctor } from '../types/appointment';
import { formatDateDisplay, validateIdNumber } from '../utils/dateUtils';
import { usePatients } from '../hooks/usePatients';
import { apiService } from '../services/apiService';
import { PatientProfile } from '../types/patient';

interface BookingFormProps {
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  selectedScheduleId: string | null;
  selectedScheduleData: any;
  onSubmit: (patientInfo: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedDoctor,
  selectedDate,
  selectedTimeSlot,
  selectedScheduleId,
  selectedScheduleData,
  onSubmit
}) => {
  // 第三步：選擇就診病患
  const { patients, loading: patientsLoading, error: patientsError } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  
  // 當有病患資料時，如果只有一個病患，自動選擇
  useEffect(() => {
    if (patients.length === 1 && !selectedPatient) {
      setSelectedPatient(patients[0]);
    }
  }, [patients, selectedPatient]);

  // 第四步：建立預約掛號
  const handleCreateReservation = async () => {
    if (!selectedPatient || !selectedScheduleId || !selectedDoctor) {
      setReservationError('請選擇病患和時段');
      return;
    }

    setIsCreatingReservation(true);
    setReservationError(null);
    
    try {
      // 使用傳入的 selectedScheduleData 獲取 clinicId
      if (!selectedScheduleData) {
        setReservationError('找不到對應的排班資料');
        return;
      }

      const appointmentData = {
        scheduleId: parseInt(selectedScheduleId),
        patientId: parseInt(selectedPatient.id),
        doctorId: parseInt(selectedDoctor.id),
        clinicId: selectedScheduleData.clinicId
      };

      const response = await apiService.createAppointment(appointmentData);
      
      if (response.success) {
        // 預約成功，回傳資料給父組件
        onSubmit({
          ...selectedPatient,
          doctorId: selectedDoctor?.id,
          doctorName: selectedDoctor?.name,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          scheduleId: selectedScheduleId,
          reservationData: response.data
        });
      } else {
        setReservationError(response.message || '預約失敗，請稍後再試');
      }
    } catch (error) {
      console.error('建立預約時發生錯誤:', error);
      setReservationError('建立預約時發生錯誤，請稍後再試');
    } finally {
      setIsCreatingReservation(false);
    }
  };

  const isFormComplete = selectedDoctor && selectedDate && selectedTimeSlot && selectedPatient && selectedScheduleId;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-cyan-500" />
        選擇病患與確認預約
      </h2>

      {/* 預約摘要 */}
      {isFormComplete && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-cyan-800 mb-2">預約摘要</h3>
          <div className="space-y-1 text-sm text-cyan-700">
            <p>醫師：{selectedDoctor.name} ({selectedDoctor.specialty})</p>
            <p>日期：{formatDateDisplay(selectedDate)}</p>
            <p>時間：{selectedTimeSlot}</p>
          </div>
        </div>
      )}

      {/* 第三步：病患選擇 */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3">選擇就診病患</h3>
        
        {patientsLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-500 mr-2" />
            <span className="text-gray-600">載入病患資料中...</span>
          </div>
        )}
        
        {patientsError && (
          <div className="flex items-center py-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
            <span className="text-yellow-800 text-sm">
              無法載入病患資料：{patientsError}
            </span>
          </div>
        )}

        {!patientsLoading && patients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>目前沒有關聯的病患資料</p>
            <p className="text-sm mt-1">請先在病患管理中新增病患資料</p>
          </div>
        )}

        {!patientsLoading && patients.length > 0 && (
          <div className="space-y-2">
            {patients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedPatient?.id === patient.id
                    ? 'border-cyan-500 bg-cyan-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{patient.name}</h4>
                    <p className="text-sm text-gray-600">身分證字號：{patient.idNumber}</p>
                    <p className="text-sm text-gray-600">電話：{patient.phone}</p>
                  </div>
                  {selectedPatient?.id === patient.id && (
                    <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 錯誤訊息 */}
      {reservationError && (
        <div className="flex items-center py-4 mb-4 bg-red-50 border border-red-200 rounded-lg px-4">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
          <span className="text-red-800 text-sm">{reservationError}</span>
        </div>
      )}

      {/* 第四步：確認預約按鈕 */}
      <button
        onClick={handleCreateReservation}
        disabled={!isFormComplete || isCreatingReservation}
        className="w-full bg-cyan-500 text-white py-4 px-6 rounded-lg font-medium hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isCreatingReservation ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            建立預約中...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            確認預約
          </>
        )}
      </button>

      {!isFormComplete && (
        <p className="text-sm text-gray-500 text-center mt-2">
          請完成所有步驟後才能建立預約
        </p>
      )}
    </div>
  );
};

export default BookingForm;