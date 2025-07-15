export interface Schedule {
  id: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  date: string;
  timeSlot: string;
  currentAppointments: number;
  capacity: number;
  isDeleted: boolean;
}

export interface ScheduleProgress {
  scheduleId: string;
  doctorName: string;
  clinicName: string;
  timeSlot: string;
  currentNumber: number;
  totalCapacity: number;
  progress: number; // 0-100 百分比
  status: 'waiting' | 'in-progress' | 'completed';
} 