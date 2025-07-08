import { ClinicProgress, QueueStatus, PatientQueue } from '../types/progress';

// Mock data for clinic progress
export const mockClinicProgress: ClinicProgress = {
  date: '2024-12-15',
  lastUpdated: '2024-12-15T14:30:00Z',
  queues: [
    {
      id: '1',
      doctorId: '1',
      doctorName: '陳美玲醫師',
      specialty: '家醫科',
      currentNumber: 8,
      totalPatients: 15,
      estimatedWaitTime: 25,
      status: 'active',
      nextBreakTime: '15:30'
    },
    {
      id: '2',
      doctorId: '2',
      doctorName: '王志明醫師',
      specialty: '內科',
      currentNumber: 12,
      totalPatients: 18,
      estimatedWaitTime: 40,
      status: 'active'
    },
    {
      id: '3',
      doctorId: '3',
      doctorName: '李淑芬醫師',
      specialty: '小兒科',
      currentNumber: 6,
      totalPatients: 10,
      estimatedWaitTime: 15,
      status: 'break',
      resumeTime: '15:00'
    },
    {
      id: '4',
      doctorId: '4',
      doctorName: '張大偉醫師',
      specialty: '骨科',
      currentNumber: 20,
      totalPatients: 20,
      estimatedWaitTime: 0,
      status: 'finished'
    }
  ]
};

// Mock patient queue data
export const mockPatientQueues: { [doctorId: string]: PatientQueue[] } = {
  '1': [
    { queueNumber: 6, patientName: '王**', appointmentTime: '14:00', status: 'completed' },
    { queueNumber: 7, patientName: '李**', appointmentTime: '14:15', status: 'completed' },
    { queueNumber: 8, patientName: '陳**', appointmentTime: '14:30', status: 'in-progress' },
    { queueNumber: 9, patientName: '張**', appointmentTime: '14:45', status: 'waiting', estimatedTime: '14:50' },
    { queueNumber: 10, patientName: '林**', appointmentTime: '15:00', status: 'waiting', estimatedTime: '15:05' }
  ],
  '2': [
    { queueNumber: 10, patientName: '黃**', appointmentTime: '14:00', status: 'completed' },
    { queueNumber: 11, patientName: '吳**', appointmentTime: '14:20', status: 'completed' },
    { queueNumber: 12, patientName: '劉**', appointmentTime: '14:40', status: 'in-progress' },
    { queueNumber: 13, patientName: '蔡**', appointmentTime: '15:00', status: 'waiting', estimatedTime: '15:15' },
    { queueNumber: 14, patientName: '鄭**', appointmentTime: '15:20', status: 'waiting', estimatedTime: '15:35' }
  ]
};

export interface ProgressItem {
  doctor: string;
  department: string;
  currentNumber: string;
  waitingCount: number;
  estimatedWait: number;
}

export const progressData: ProgressItem[] = [
  {
    doctor: '王大明 醫師',
    department: '家庭醫學科',
    currentNumber: 'A12',
    waitingCount: 5,
    estimatedWait: 15
  },
  {
    doctor: '李小華 醫師',
    department: '小兒科',
    currentNumber: 'B08',
    waitingCount: 3,
    estimatedWait: 10
  }
];