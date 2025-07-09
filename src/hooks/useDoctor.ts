import { useState, useEffect } from 'react';
import { DoctorInfo } from '../types/doctor';
import { apiService, ApiDoctor } from '../services/apiService';
import { convertApiToDoctorInfo } from '../utils/doctorUtils';
import { doctorsInfo } from '../data/doctorData';

interface UseDoctorReturn {
  doctor: DoctorInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDoctor = (doctorId: string): UseDoctorReturn => {
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctor = async () => {
    if (!doctorId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getDoctorById(doctorId);
      
      if (response.success && response.data) {
        console.log(`獲取醫生 ${doctorId} 的 API 資料:`, response.data);
        const apiDoctor = convertApiToDoctorInfo(response.data);
        setDoctor(apiDoctor);
      } else {
        // API 失敗時使用本地資料
        console.warn(`API 獲取醫生 ${doctorId} 資料失敗，使用本地資料:`, response.message);
        setError(response.message || 'API 呼叫失敗');
        const fallbackDoctor = doctorsInfo.find(d => d.id === doctorId) || null;
        setDoctor(fallbackDoctor);
      }
    } catch (err) {
      // 網路錯誤或其他異常時使用本地資料
      console.error(`獲取醫生 ${doctorId} 資料時發生錯誤:`, err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      const fallbackDoctor = doctorsInfo.find(d => d.id === doctorId) || null;
      setDoctor(fallbackDoctor);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  return {
    doctor,
    loading,
    error,
    refetch: fetchDoctor,
  };
}; 