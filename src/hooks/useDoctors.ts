import { useState, useEffect } from 'react';
import { Doctor } from '../types/appointment';
import { apiService } from '../services/apiService';
import { doctors as mockDoctors } from '../data/mockData';

interface UseDoctorsReturn {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

export const useDoctors = (lineUserId?: string): UseDoctorsReturn => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getDoctors(lineUserId);
      
      if (response.success && response.data) {
        console.log('醫師 API 響應:', response);
        
        // 轉換 API 資料為本地格式
        const convertedDoctors: Doctor[] = response.data.data.map((apiDoctor) => ({
          id: apiDoctor.id.toString(),
          name: apiDoctor.name,
          specialty: apiDoctor.specialty,
          image: apiDoctor.information?.image || '',
        }));
        
        setDoctors(convertedDoctors);
        console.log('成功獲取醫師資訊，共', convertedDoctors.length, '位醫師');
      } else {
        console.warn('醫師 API 獲取失敗，使用本地資料:', response.message);
        setError(response.message || '醫師 API 呼叫失敗，使用本地資料');
        setDoctors(mockDoctors);
      }
    } catch (err) {
      console.error('獲取醫師資訊時發生錯誤，使用本地資料:', err);
      setError(err instanceof Error ? err.message : '未知錯誤，使用本地資料');
      setDoctors(mockDoctors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [lineUserId]);

  return {
    doctors,
    loading,
    error
  };
}; 