import { Doctor, TimeSlot, Appointment } from '../types/appointment';

export const doctors: Doctor[] = [
  {
    id: '1',
    name: '陳美玲醫師',
    specialty: '家醫科',
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    name: '王志明醫師',
    specialty: '內科',
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '3',
    name: '李淑芬醫師',
    specialty: '小兒科',
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '4',
    name: '張大偉醫師',
    specialty: '骨科',
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export const timeSlots: { [key: string]: TimeSlot[] } = {
  morning: [
    { id: 'am1', time: '09:00', available: true },
    { id: 'am2', time: '09:30', available: true },
    { id: 'am3', time: '10:00', available: false },
    { id: 'am4', time: '10:30', available: true },
    { id: 'am5', time: '11:00', available: true },
    { id: 'am6', time: '11:30', available: true }
  ],
  afternoon: [
    { id: 'pm1', time: '14:00', available: true },
    { id: 'pm2', time: '14:30', available: true },
    { id: 'pm3', time: '15:00', available: true },
    { id: 'pm4', time: '15:30', available: false },
    { id: 'pm5', time: '16:00', available: true },
    { id: 'pm6', time: '16:30', available: true },
    { id: 'pm7', time: '17:00', available: true },
    { id: 'pm8', time: '17:30', available: true }
  ],
  evening: [
    { id: 'ev1', time: '18:30', available: true },
    { id: 'ev2', time: '19:00', available: true },
    { id: 'ev3', time: '19:30', available: false },
    { id: 'ev4', time: '20:00', available: true },
    { id: 'ev5', time: '20:30', available: true }
  ]
};

// Mock appointments data
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: 'A123456789',
    doctorId: '1',
    doctorName: '陳美玲醫師',
    date: '2024-12-20',
    timeSlot: '09:30',
    status: 'confirmed',
    createdAt: '2024-12-10T10:00:00Z'
  },
  {
    id: '2',
    patientId: 'A123456789',
    doctorId: '2',
    doctorName: '王志明醫師',
    date: '2024-12-22',
    timeSlot: '14:30',
    status: 'pending',
    createdAt: '2024-12-11T15:30:00Z'
  }
];