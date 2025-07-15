import { useState, useEffect } from 'react';
import { ClinicInfo, DoctorInfo, ClinicApiResponse } from '../types/doctor';
import { apiService } from '../services/apiService';
import { getLineUserId } from '../config/api';

interface UseClinicInfoReturn {
  clinicInfo: ClinicInfo | null;
  doctorsInfo: DoctorInfo[];
  loading: boolean;
  error: string | null;
}

export const useClinicInfo = (lineUserId?: string): UseClinicInfoReturn => {
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo | null>(null);
  const [doctorsInfo, setDoctorsInfo] = useState<DoctorInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 獲取實際的LINE user ID
  const getActiveLineUserId = (): string => {
    if (lineUserId) {
      return lineUserId;
    }
    try {
      return getLineUserId();
    } catch (error) {
      console.warn('Failed to get LINE user ID, this might cause API calls to fail');
      throw error;
    }
  };

  // 轉換診所 API 資料到本地格式
  const convertClinicApiToLocal = (apiData: ClinicApiResponse): ClinicInfo => {
    return {
      title: apiData.title,
      subtitle: apiData.subtitle,
      address: apiData.office_information.address.zh,
      phone: apiData.office_information.phone,
      officeHours: {
        morning: apiData.office_information.office_hours.morning,
        afternoon: apiData.office_information.office_hours.afternoon,
        evening: apiData.office_information.office_hours.evening,
        note: apiData.office_information.office_hours.note.zh,
      },
      services: apiData.office_information.services.description.zh,
      // 向後相容性
      name: apiData.title,
      description: apiData.subtitle,
      email: '', // API 中沒有提供，設為空字串
      hours: {
        '上午': apiData.office_information.office_hours.morning,
        '下午': apiData.office_information.office_hours.afternoon,
        '晚上': apiData.office_information.office_hours.evening,
      }
    };
  };

  // 轉換醫生 API 資料到本地格式
  const convertDoctorsApiToLocal = (apiDoctors: ClinicApiResponse['doctors']): DoctorInfo[] => {
    return apiDoctors.map((doctor, index) => ({
      id: `doctor-${index + 1}`,
      name: doctor.name.zh,
      description: doctor.description.zh,
      credentials: doctor.credentials,
      // 向後相容性
      title: doctor.name.zh.replace('醫師', ''),
      specialty: extractSpecialtiesFromDescription(doctor.description.zh),
      education: doctor.credentials.filter(cred => cred.includes('大學') || cred.includes('醫學系')),
      certifications: doctor.credentials.filter(cred => cred.includes('專科醫師') || cred.includes('會員') || cred.includes('證明')),
      expertise: [],
      schedule: {},
      introduction: doctor.description.zh
    }));
  };

  // 從描述中提取專科領域
  const extractSpecialtiesFromDescription = (description: string): string[] => {
    const specialties: string[] = [];
    
    if (description.includes('急診')) specialties.push('急診醫學');
    if (description.includes('內科')) specialties.push('內科');
    if (description.includes('小兒')) specialties.push('小兒科');
    if (description.includes('耳鼻喉')) specialties.push('耳鼻喉科');
    if (description.includes('皮膚')) specialties.push('皮膚科');
    if (description.includes('感染')) specialties.push('感染科');
    if (description.includes('重症') || description.includes('加護')) specialties.push('重症醫學');
    if (description.includes('家庭醫學')) specialties.push('家庭醫學');
    if (description.includes('慢性病')) specialties.push('慢性病管理');
    
    return specialties.length > 0 ? specialties : ['家庭醫學'];
  };

  const fetchClinicInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getClinicInfo(getActiveLineUserId());
      
      if (response.success && response.data) {
        console.log('診所 API 響應:', response);
        
        const convertedClinicInfo = convertClinicApiToLocal(response.data);
        const convertedDoctorsInfo = convertDoctorsApiToLocal(response.data.doctors);
        
        setClinicInfo(convertedClinicInfo);
        setDoctorsInfo(convertedDoctorsInfo);
        
        console.log('成功獲取診所資訊，共', convertedDoctorsInfo.length, '位醫師');
      } else {
        console.warn('診所 API 獲取失敗:', response.message);
        setError(response.message || '診所資訊 API 呼叫失敗');
        setClinicInfo(null);
        setDoctorsInfo([]);
      }
    } catch (err) {
      console.error('獲取診所資訊時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      setClinicInfo(null);
      setDoctorsInfo([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicInfo();
  }, []);

  return {
    clinicInfo,
    doctorsInfo,
    loading,
    error
  };
}; 