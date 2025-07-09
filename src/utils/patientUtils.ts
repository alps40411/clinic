import { PatientProfile, PatientFormData } from '../types/patient';
import { ApiPatient, PatientCreateData } from '../services/apiService';

// 將 API 資料轉換為 PatientProfile 格式
export const convertApiToPatientProfile = (apiPatient: ApiPatient): PatientProfile => {
  return {
    id: apiPatient.id.toString(),
    name: apiPatient.name,
    idNumber: apiPatient.idNumber,
    phone: apiPatient.phone,
    email: apiPatient.email,
    birthDate: apiPatient.birthDate,
    address: apiPatient.address,
    emergencyContact: apiPatient.emergencyContact,
    emergencyPhone: apiPatient.emergencyPhone,
    bloodType: apiPatient.bloodType,
    allergies: apiPatient.allergies,
    medicalHistory: apiPatient.medicalHistory,
    createdAt: apiPatient.createdAt,
    updatedAt: apiPatient.updatedAt,
  };
};

// 將 PatientFormData 轉換為 API 創建格式
export const convertPatientFormToApiCreate = (formData: PatientFormData): PatientCreateData => {
  return {
    name: formData.name,
    idNumber: formData.idNumber,
    phone: formData.phone,
    email: formData.email,
    birthDate: formData.birthDate,
    address: formData.address,
    emergencyContact: formData.emergencyContact,
    emergencyPhone: formData.emergencyPhone,
    bloodType: formData.bloodType || undefined,
    allergies: formData.allergies || undefined,
    medicalHistory: formData.medicalHistory || undefined,
  };
};

// 將 PatientProfile 轉換為 PatientFormData
export const convertPatientProfileToForm = (profile: PatientProfile): PatientFormData => {
  return {
    name: profile.name,
    idNumber: profile.idNumber,
    phone: profile.phone,
    email: profile.email,
    birthDate: profile.birthDate,
    address: profile.address,
    emergencyContact: profile.emergencyContact,
    emergencyPhone: profile.emergencyPhone,
    bloodType: profile.bloodType || '',
    allergies: profile.allergies || '',
    medicalHistory: profile.medicalHistory || '',
  };
};

// 將 API 陣列轉換為 PatientProfile 陣列
export const convertApiToPatientProfileArray = (apiPatients: ApiPatient[]): PatientProfile[] => {
  return apiPatients.map(convertApiToPatientProfile);
}; 