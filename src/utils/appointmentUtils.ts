import { Appointment } from '../types/appointment';
import { ApiAppointment } from '../services/apiService';
import { formatTimeSlot } from './scheduleUtils';

// 將 API 預約資料轉換為前端格式
export const convertApiToAppointment = (apiAppointment: ApiAppointment): Appointment => {
  // 安全地格式化日期
  let formattedDate: string;
  
  try {
    // 嘗試多種日期來源
    const dateValue = apiAppointment.appointmentDate || 
                     apiAppointment.schedule?.date || 
                     apiAppointment.createdAt;
    
    if (!dateValue) {
      console.warn('API 預約資料缺少日期信息:', apiAppointment);
      formattedDate = new Date().toISOString().split('T')[0]; // 使用今天作為備用
    } else {
      const appointmentDate = new Date(dateValue);
      
      // 檢查日期是否有效
      if (isNaN(appointmentDate.getTime())) {
        console.warn('無效的日期格式:', dateValue, apiAppointment);
        formattedDate = new Date().toISOString().split('T')[0]; // 使用今天作為備用
      } else {
        formattedDate = appointmentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      }
    }
  } catch (error) {
    console.error('日期轉換錯誤:', error, apiAppointment);
    formattedDate = new Date().toISOString().split('T')[0]; // 使用今天作為備用
  }

  // 安全地獲取醫師名稱
  const doctorName = apiAppointment.schedule?.doctor?.name || 
                    `醫師 ${apiAppointment.doctorId}` || 
                    '未知醫師';

  // 安全地獲取時段
  const timeSlot = apiAppointment.schedule?.timeSlot ? 
                  formatTimeSlot(apiAppointment.schedule.timeSlot) : 
                  '未知時段';

  return {
    id: apiAppointment.id.toString(),
    patientId: apiAppointment.patient?.idNumber || `患者 ${apiAppointment.patientId}`, // 使用身分證字號作為 patientId
    doctorId: apiAppointment.doctorId.toString(),
    doctorName,
    clinicId: apiAppointment.clinicId.toString(), // 保存診間ID
    date: formattedDate,
    timeSlot,
    status: convertStatusToLocal(apiAppointment.status),
    createdAt: apiAppointment.createdAt || new Date().toISOString(),
  };
};

// 轉換狀態
export const convertStatusToLocal = (apiStatus: string | undefined | null): 'confirmed' | 'pending' | 'cancelled' => {
  // 安全檢查：如果 apiStatus 是 undefined、null 或空字符串，返回預設值
  if (!apiStatus || typeof apiStatus !== 'string') {
    console.warn('API 狀態值無效:', apiStatus);
    return 'pending';
  }

  switch (apiStatus.toLowerCase()) {
    case 'confirmed':
    case 'active':
      return 'confirmed';
    case 'pending':
    case 'waiting':
      return 'pending';
    case 'cancelled':
    case 'canceled':
    case 'deleted':
      return 'cancelled';
    default:
      console.warn('未知的 API 狀態值:', apiStatus);
      return 'pending';
  }
};

// 轉換 API 預約陣列
export const convertApiToAppointmentArray = (apiAppointments: ApiAppointment[]): Appointment[] => {
  return apiAppointments.map(convertApiToAppointment);
};

// 產生查詢日期範圍（預設為今天開始的三個月內）
export const getDefaultDateRange = () => {
  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  
  return {
    startDate: today.toISOString().split('T')[0] + 'T00:00:00Z',
    endDate: threeMonthsLater.toISOString().split('T')[0] + 'T23:59:59Z'
  };
};

// 格式化日期顯示
export const formatAppointmentDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[date.getDay()];
  
  return `${year}/${month}/${day} (${weekday})`;
}; 