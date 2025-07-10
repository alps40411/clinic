import React, { useState } from 'react';
import { Search, Calendar, Clock, User, Trash2, Edit3, AlertCircle, Loader2, X } from 'lucide-react';
import { Appointment } from '../types/appointment';
import { validateIdNumber } from '../utils/dateUtils';
import { apiService } from '../services/apiService';
import { convertApiToAppointmentArray, formatAppointmentDate } from '../utils/appointmentUtils';
import { useSchedules } from '../hooks/useSchedules';
import { useDoctors } from '../hooks/useDoctors';
import { usePatients } from '../hooks/usePatients';

interface PatientLookupProps {
  onEditAppointment?: (appointment: Appointment) => void;
  showAppointmentHistory?: boolean;
}

const PatientLookup: React.FC<PatientLookupProps> = ({ 
  onEditAppointment: _onEditAppointment,
  showAppointmentHistory = true 
}) => {
  const [idNumber, setIdNumber] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    return threeMonthsLater.toISOString().split('T')[0];
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 編輯預約相關狀態
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  
  // 編輯表單狀態
  const [editForm, setEditForm] = useState({
    selectedDoctorId: '',
    selectedDate: '',
    selectedTimeSlot: '',
    selectedPatientId: '',
    selectedClinicId: '',
    notes: ''
  });
  
  // 獲取編輯所需的資料
  const { doctors } = useDoctors();
  const { patients } = usePatients();
  
  // 獲取選定醫生和日期的排班資料
  const scheduleParams = editForm.selectedDoctorId && editForm.selectedDate ? {
    startDate: `${editForm.selectedDate}T00:00:00Z`,
    endDate: `${editForm.selectedDate}T23:59:59Z`,
    doctorId: editForm.selectedDoctorId,
    limit: 50 // 確保獲取足夠的資料
  } : {};
  const { schedules, loading: schedulesLoading, error: schedulesError } = useSchedules(scheduleParams);

  const handleSearch = async () => {
    if (!validateIdNumber(idNumber)) {
      setError('請輸入正確的身分證字號格式');
      return;
    }

    if (!startDate || !endDate) {
      setError('請選擇查詢日期範圍');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('結束日期不能早於開始日期');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const response = await apiService.searchAppointmentsByIdNumber({
        idNumber,
        startDate: `${startDate}T00:00:00Z`,
        endDate: `${endDate}T23:59:59Z`,
        page: 1,
        limit: 50
      });
      
      if (response.success && response.data) {
        try {
          console.log('API 返回的原始資料:', response.data);
          const convertedAppointments = convertApiToAppointmentArray(response.data.data);
          setAppointments(convertedAppointments);
          setHasSearched(true);
          
          if (convertedAppointments.length === 0) {
            setError('在指定日期範圍內未找到預約紀錄');
          }
        } catch (conversionError) {
          console.error('資料轉換錯誤:', conversionError);
          console.error('問題資料:', response.data);
          setError(`資料轉換時發生錯誤：${conversionError instanceof Error ? conversionError.message : '未知錯誤'}。請檢查控制台日誌並聯絡系統管理員。`);
          setAppointments([]);
          setHasSearched(false);
        }
      } else {
        setError(response.message || '查詢預約記錄失敗');
        setAppointments([]);
        setHasSearched(false);
      }
    } catch (err) {
      console.error('搜尋預約時發生錯誤:', err);
      setError('搜尋時發生錯誤，請稍後再試');
      setAppointments([]);
      setHasSearched(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!window.confirm('確定要取消此預約嗎？此操作無法復原。')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.deleteAppointment(appointmentId);
      
      if (response.success) {
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
        alert('預約已成功取消');
      } else {
        alert(`取消預約失敗：${response.message}`);
      }
    } catch (err) {
      console.error('刪除預約時發生錯誤:', err);
      alert('取消預約時發生錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStart = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    // 初始化編輯表單數據
    setEditForm({
      selectedDoctorId: appointment.doctorId,
      selectedDate: appointment.date,
      selectedTimeSlot: appointment.timeSlot,
      selectedPatientId: appointment.patientId,
      selectedClinicId: appointment.clinicId,
      notes: ''
    });
    setShowEditForm(true);
  };

  const handleEditCancel = () => {
    setEditingAppointment(null);
    setEditForm({
      selectedDoctorId: '',
      selectedDate: '',
      selectedTimeSlot: '',
      selectedPatientId: '',
      selectedClinicId: '',
      notes: ''
    });
    setShowEditForm(false);
  };

  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return;

    // 找到選定的排班
    const selectedDoctor = doctors.find(d => d.id === editForm.selectedDoctorId);
    const selectedPatient = patients.find(p => p.idNumber === editForm.selectedPatientId);
    const selectedSchedule = schedules.find(s => 
      s.doctorName === selectedDoctor?.name && 
      s.timeSlot === editForm.selectedTimeSlot
    );

    if (!selectedSchedule || !selectedDoctor || !selectedPatient) {
      alert('請確保所有欄位都已正確選擇');
      return;
    }

    setIsUpdating(true);
    try {
      // 檢查是否有任何變更（病患、醫師、日期、時段）
      const isPatientChanged = editingAppointment.patientId !== editForm.selectedPatientId;
      const isDoctorChanged = editingAppointment.doctorId !== editForm.selectedDoctorId;
      const isDateChanged = editingAppointment.date !== editForm.selectedDate;
      const isTimeSlotChanged = editingAppointment.timeSlot !== editForm.selectedTimeSlot;
      
      // 如果有病患、醫師、日期變更，需要重新建立預約
      // 暫時移除備註功能，因為API不支持
      const needsRecreation = isPatientChanged || isDoctorChanged || isDateChanged;
      
      if (needsRecreation) {
        console.log('需要重新建立預約，原因:', {
          isPatientChanged,
          isDoctorChanged, 
          isDateChanged
        });
        
        // 1. 刪除舊預約
        const deleteResponse = await apiService.deleteAppointment(editingAppointment.id);
        if (!deleteResponse.success) {
          throw new Error(`刪除舊預約失敗：${deleteResponse.message}`);
        }
        
        // 2. 創建新預約
        const createResponse = await apiService.createAppointment({
          scheduleId: parseInt(selectedSchedule.scheduleId),
          patientId: parseInt(selectedPatient.id.toString()),
          doctorId: parseInt(selectedDoctor.id.toString()),
          clinicId: parseInt(editingAppointment.clinicId) // 使用原預約的診間ID
        });
        
        if (!createResponse.success) {
          throw new Error(`創建新預約失敗：${createResponse.message}`);
        }
        
        alert('預約已成功更新（重新建立）');
      } else if (isTimeSlotChanged) {
        // 只有時段變更，使用更新 API
        console.log('只更新時段');
        
        const updateResponse = await apiService.updateAppointment(
          editingAppointment.id, 
          { 
            scheduleId: parseInt(selectedSchedule.scheduleId),
            patientId: parseInt(selectedPatient.id.toString()),
            doctorId: parseInt(selectedDoctor.id.toString()),
            clinicId: parseInt(editingAppointment.clinicId) // 使用原預約的診間ID
          }
        );
        
        if (!updateResponse.success) {
          throw new Error(`更新預約失敗：${updateResponse.message}`);
        }
        
        alert('預約時段已成功更新');
      } else {
        // 沒有任何變更
        alert('沒有任何變更需要保存');
        handleEditCancel();
        return;
      }
      
      // 重新查詢以獲取最新資料
      await handleSearch();
      handleEditCancel();
      
    } catch (err) {
      console.error('更新預約時發生錯誤:', err);
      alert(err instanceof Error ? err.message : '更新預約時發生錯誤，請稍後再試');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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

  // 編輯預約表單
  const EditAppointmentForm: React.FC = () => {
    if (!editingAppointment || !showEditForm) return null;

    // 調試信息
    console.log('編輯表單調試信息:', {
      selectedDoctorId: editForm.selectedDoctorId,
      selectedDate: editForm.selectedDate,
      scheduleParams,
      schedulesCount: schedules.length,
      schedulesLoading,
      schedulesError,
      schedules: schedules,
      doctors: doctors.map(d => ({ id: d.id, name: d.name }))
    });

    // 過濾醫生的時段 - 修正類型匹配問題
    const selectedDoctor = doctors.find(d => d.id.toString() === editForm.selectedDoctorId.toString());
    console.log('找到的醫師:', selectedDoctor);
    
    const doctorSchedules = schedules.filter(schedule => 
      schedule.doctorName === selectedDoctor?.name
    );
    console.log('醫師時段:', doctorSchedules);

    const timeSlotOptions = [
      { value: '上午', label: '上午', apiValue: 'MORNING' },
      { value: '下午', label: '下午', apiValue: 'AFTERNOON' },
      { value: '晚上', label: '晚上', apiValue: 'EVENING' }
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">編輯預約</h3>
            <button
              onClick={handleEditCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* 病患選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                病患 <span className="text-red-500">*</span>
              </label>
              <select
                value={editForm.selectedPatientId}
                onChange={(e) => setEditForm({...editForm, selectedPatientId: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="">請選擇病患</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.idNumber}>
                    {patient.name} ({patient.idNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* 醫師選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                醫師 <span className="text-red-500">*</span>
              </label>
              <select
                value={editForm.selectedDoctorId}
                onChange={(e) => setEditForm({...editForm, selectedDoctorId: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="">請選擇醫師</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* 日期選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                預約日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={editForm.selectedDate}
                onChange={(e) => setEditForm({...editForm, selectedDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* 時段選擇 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                時段 <span className="text-red-500">*</span>
              </label>
              
              {/* 載入狀態或錯誤信息 */}
              {schedulesLoading && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">正在載入時段資料...</span>
                </div>
              )}
              
              {schedulesError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">載入時段失敗：{schedulesError}</span>
                </div>
              )}
              
              <div className="space-y-2">
                {timeSlotOptions.map(option => {
                  const schedule = doctorSchedules.find(s => s.timeSlot === option.value);
                  const isAvailable = schedule && schedule.currentNumber < schedule.totalCapacity;
                  const isSelected = editForm.selectedTimeSlot === option.value;
                  
                  // 調試每個時段的匹配情況
                  console.log(`時段 ${option.value} 調試:`, {
                    schedule,
                    isAvailable,
                    doctorSchedules: doctorSchedules.map(ds => ({ timeSlot: ds.timeSlot, doctorName: ds.doctorName }))
                  });
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => setEditForm({...editForm, selectedTimeSlot: option.value})}
                      disabled={!isAvailable}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                        isSelected
                          ? 'bg-cyan-100 border border-cyan-300 text-cyan-700'
                          : isAvailable
                          ? 'bg-white border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{option.label}</span>
                        <div className="text-sm">
                          {schedule ? (
                            <span className="text-gray-500">
                              {schedule.currentNumber}/{schedule.totalCapacity}
                            </span>
                          ) : (
                            <span className="text-gray-400">未開診</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 備註 - 暫時禁用 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備註
              </label>
              <div className="relative">
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  placeholder="備註功能暫時不可用..."
                  rows={3}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  功能開發中
                </div>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleEditCancel}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpdateAppointment}
                disabled={isUpdating || !editForm.selectedDoctorId || !editForm.selectedDate || !editForm.selectedTimeSlot || !editForm.selectedPatientId}
                className="flex-1 py-2 px-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    更新中...
                  </>
                ) : (
                  '更新預約'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-cyan-500" />
        查詢預約紀錄
      </h2>
      
      <div className="space-y-4">
        {/* 身分證字號輸入 */}
        <div>
          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
            身分證字號 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="idNumber"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
            placeholder="例如：A123456789"
            maxLength={10}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* 日期範圍選擇 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              開始日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              結束日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* 搜尋按鈕 */}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full bg-cyan-500 text-white py-3 px-4 rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              搜尋中...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              搜尋預約紀錄
            </>
          )}
        </button>

        {/* 錯誤訊息 */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* 搜尋結果 */}
        {hasSearched && showAppointmentHistory && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              找到 {appointments.length} 筆預約紀錄
            </h3>
            
            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-800">{appointment.doctorName}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatAppointmentDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.timeSlot}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditStart(appointment)}
                          className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="編輯預約"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="取消預約"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>未找到符合條件的預約紀錄</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 編輯預約表單 */}
      <EditAppointmentForm />
    </div>
  );
};

export default PatientLookup;