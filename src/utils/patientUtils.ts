import { PatientProfile, PatientFormData } from '../types/patient';
import { ApiPatient, PatientCreateData } from '../services/apiService';
import { LINE_USER_ID } from '../config/api';

// 將 API 資料轉換為 PatientProfile 格式
export const convertApiToPatientProfile = (apiPatient: ApiPatient): PatientProfile => {
  return {
    id: apiPatient.id.toString(),
    name: apiPatient.name,
    idNumber: apiPatient.idNumber,
    phone: apiPatient.phone,
    email: apiPatient.email,
    birthDate: apiPatient.birthDate,
    address: apiPatient.address || '',
    emergencyContact: apiPatient.emergencyContact || '',
    emergencyPhone: apiPatient.emergencyPhone || '',
    bloodType: apiPatient.bloodType || '',
    allergies: apiPatient.allergies || '',
    medicalHistory: apiPatient.medicalHistory || '',
    createdAt: apiPatient.createdAt || '',
    updatedAt: apiPatient.updatedAt || '',
  };
};

// 將 PatientFormData 轉換為 API 創建格式
export const convertPatientFormToApiCreate = (formData: PatientFormData, lineUserId: string = LINE_USER_ID): PatientCreateData => {
  // 將 birthDate 保持為 YYYY-MM-DD 格式
  let birthDateFormatted = formData.birthDate;
  if (formData.birthDate.length === 8) {
    // 如果是 8 位數字格式，轉換為 YYYY-MM-DD
    const year = formData.birthDate.slice(0, 4);
    const month = formData.birthDate.slice(4, 6);
    const day = formData.birthDate.slice(6, 8);
    birthDateFormatted = `${year}-${month}-${day}`;
  }
  
  return {
    lineId: lineUserId,
    name: formData.name,
    idNumber: formData.idNumber,
    birthDate: birthDateFormatted, // 保持 YYYY-MM-DD 格式
    phone: formData.phone,
    email: formData.email,
    isBlacklisted: false,
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
  };
};

// 將 API 陣列轉換為 PatientProfile 陣列
export const convertApiToPatientProfileArray = (apiPatients: ApiPatient[]): PatientProfile[] => {
  return apiPatients.map(convertApiToPatientProfile);
}; 