export interface PatientProfile {
  id: string;
  name: string;
  idNumber: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PatientFormData {
  name: string;
  idNumber: string;
  phone: string;
  email: string;
  birthDate: string;
}