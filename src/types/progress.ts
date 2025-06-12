export interface QueueStatus {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  currentNumber: number;
  totalPatients: number;
  estimatedWaitTime: number; // minutes
  status: 'active' | 'break' | 'finished';
  nextBreakTime?: string;
  resumeTime?: string;
}

export interface PatientQueue {
  queueNumber: number;
  patientName: string;
  appointmentTime: string;
  status: 'waiting' | 'in-progress' | 'completed';
  estimatedTime?: string;
}

export interface ClinicProgress {
  date: string;
  lastUpdated: string;
  queues: QueueStatus[];
}