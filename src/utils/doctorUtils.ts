import { DoctorInfo } from '../types/doctor';
import { Doctor } from '../types/appointment';
import { ApiDoctor, ApiDoctorsResponse } from '../services/apiService';

// 將 API 醫生資料轉換為詳細的 DoctorInfo 格式
export const convertApiToDoctorInfo = (apiDoctor: ApiDoctor): DoctorInfo => {
  return {
    id: apiDoctor.id.toString(),
    name: apiDoctor.name,
    title: apiDoctor.information?.title || '主治醫師',
    specialty: [apiDoctor.specialty], // API 回應的 specialty 是字串，轉為陣列
    image: apiDoctor.information?.image || 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    education: apiDoctor.information?.education ? [apiDoctor.information.education] : [],
    experience: apiDoctor.information?.experience ? [apiDoctor.information.experience] : [],
    certifications: [], // API 沒有提供，使用空陣列
    expertise: [], // API 沒有提供，使用空陣列
    schedule: {}, // API 沒有提供，使用空物件
    introduction: `${apiDoctor.name}是經驗豐富的專業醫師，致力於提供優質的醫療服務。`,
  };
};

// 將 API 醫生資料轉換為簡化的 Doctor 格式（用於預約）
export const convertApiToDoctor = (apiDoctor: ApiDoctor): Doctor => {
  return {
    id: apiDoctor.id.toString(),
    name: apiDoctor.name,
    specialty: apiDoctor.specialty || '一般科',
    image: apiDoctor.information?.image || 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
  };
};

// 將 API 醫生陣列轉換為 DoctorInfo 陣列
export const convertApiToDoctorInfoArray = (apiData: ApiDoctor[]): DoctorInfo[] => {
  console.log('convertApiToDoctorInfoArray 接收到的資料:', apiData);
  console.log('資料類型:', typeof apiData);
  console.log('是否為陣列:', Array.isArray(apiData));
  
  if (!apiData || !Array.isArray(apiData)) {
    console.warn('API 返回的醫師資料不是陣列:', apiData);
    return [];
  }
  
  console.log('處理 API 醫師資料，共', apiData.length, '位醫師');
  return apiData.map(convertApiToDoctorInfo);
};

// 將 API 醫生陣列轉換為 Doctor 陣列
export const convertApiToDoctorArray = (apiData: ApiDoctor[]): Doctor[] => {
  console.log('convertApiToDoctorArray 接收到的資料:', apiData);
  
  if (!apiData || !Array.isArray(apiData)) {
    console.warn('API 返回的醫師資料不是陣列:', apiData);
    return [];
  }
  
  return apiData.map(convertApiToDoctor);
}; 