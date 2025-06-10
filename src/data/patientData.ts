import { PatientProfile } from '../types/patient';

export const bloodTypes = [
  { value: '', label: '請選擇血型' },
  { value: 'A', label: 'A型' },
  { value: 'B', label: 'B型' },
  { value: 'AB', label: 'AB型' },
  { value: 'O', label: 'O型' },
  { value: 'unknown', label: '不清楚' }
];

// Mock patient profiles
export const mockPatientProfiles: PatientProfile[] = [
  {
    id: '1',
    name: '王小明',
    idNumber: 'A123456789',
    phone: '0912345678',
    email: 'wang@example.com',
    birthDate: '19880808',
    address: '台北市信義區信義路100號',
    emergencyContact: '王媽媽',
    emergencyPhone: '0987654321',
    bloodType: 'A',
    allergies: '花生過敏',
    medicalHistory: '高血壓',
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    name: '李小華',
    idNumber: 'B987654321',
    phone: '0923456789',
    email: 'lee@example.com',
    birthDate: '19920315',
    address: '新北市板橋區中山路200號',
    emergencyContact: '李先生',
    emergencyPhone: '0976543210',
    bloodType: 'B',
    createdAt: '2024-12-02T14:30:00Z'
  }
];