import { Schedule, ScheduleProgress } from '../types/schedule';
import { ApiSchedule } from '../services/apiService';

// 將時段字串轉換為中文顯示
export const formatTimeSlot = (timeSlot: string): string => {
  const timeSlotMap: { [key: string]: string } = {
    'MORNING': '上午',
    'AFTERNOON': '下午',
    'EVENING': '晚上',
  };
  
  return timeSlotMap[timeSlot] || timeSlot;
};

// 將 API 資料轉換為 Schedule 格式
export const convertApiToSchedule = (apiSchedule: ApiSchedule): Schedule => {
  return {
    id: apiSchedule.id.toString(),
    doctorId: apiSchedule.doctorId.toString(),
    doctorName: apiSchedule.doctor.name,
    clinicId: apiSchedule.clinicId.toString(),
    clinicName: apiSchedule.clinic.name,
    date: apiSchedule.date,
    timeSlot: formatTimeSlot(apiSchedule.timeSlot),
    currentAppointments: apiSchedule.currentAppointments,
    capacity: apiSchedule.clinic.capacity,
    isDeleted: apiSchedule.isDeleted,
  };
};

// 將 Schedule 轉換為進度顯示格式
export const convertToScheduleProgress = (schedule: Schedule): ScheduleProgress => {
  const progress = schedule.capacity > 0 
    ? Math.round((schedule.currentAppointments / schedule.capacity) * 100) 
    : 0;
    
  let status: 'waiting' | 'in-progress' | 'completed' = 'waiting';
  if (schedule.currentAppointments > 0) {
    status = schedule.currentAppointments >= schedule.capacity ? 'completed' : 'in-progress';
  }
  
  return {
    scheduleId: schedule.id,
    doctorName: schedule.doctorName,
    clinicName: schedule.clinicName,
    timeSlot: schedule.timeSlot,
    currentNumber: schedule.currentAppointments,
    totalCapacity: schedule.capacity,
    progress,
    status,
  };
};

// 將 API 陣列轉換為 Schedule 陣列
export const convertApiToScheduleArray = (apiData: ApiSchedule[]): Schedule[] => {
  return apiData.map(convertApiToSchedule);
};

// 將 API 陣列轉換為進度陣列
export const convertApiToScheduleProgressArray = (apiData: ApiSchedule[]): ScheduleProgress[] => {
  return apiData.map(apiSchedule => {
    const schedule = convertApiToSchedule(apiSchedule);
    return convertToScheduleProgress(schedule);
  });
}; 