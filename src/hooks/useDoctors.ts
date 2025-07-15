import { useState, useEffect } from 'react';
import { DoctorInfo } from '../types/doctor';
import { Doctor } from '../types/appointment';
import { useClinicInfo } from './useClinicInfo';
import { convertApiToDoctorArray } from '../utils/doctorUtils';

interface UseDoctorsReturn {
  doctorsInfo: DoctorInfo[];
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

export const useDoctors = (lineUserId?: string): UseDoctorsReturn => {
  const [doctorsState, setDoctorsState] = useState<Doctor[]>([]);
  
  // 使用新的診所資訊 hook
  const { doctorsInfo, loading, error } = useClinicInfo(lineUserId);

  // 將醫生資訊轉換為預約系統所需的格式
  useEffect(() => {
    if (doctorsInfo.length > 0) {
      try {
        // 轉換 DoctorInfo[] 為 Doctor[] 格式以供預約系統使用
        const convertedDoctors: Doctor[] = doctorsInfo.map((doctorInfo) => ({
          id: doctorInfo.id,
          name: doctorInfo.name,
          specialty: doctorInfo.specialty?.join(', ') || '家庭醫學',
          image: '', // 移除圖片
        }));
        
        setDoctorsState(convertedDoctors);
        console.log('成功轉換醫師資料為預約格式，共', convertedDoctors.length, '位醫師');
      } catch (conversionError) {
        console.error('醫師資料轉換錯誤:', conversionError);
      }
    } else {
      setDoctorsState([]);
    }
  }, [doctorsInfo]);

  return {
    doctorsInfo,
    doctors: doctorsState,
    loading,
    error
  };
}; 