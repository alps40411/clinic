export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface PatientInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
}