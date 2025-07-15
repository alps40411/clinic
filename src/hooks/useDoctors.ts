import { useState, useEffect } from 'react';
import { DoctorInfo } from '../types/doctor';
import { Doctor } from '../types/appointment';
import { apiService } from '../services/apiService';
import { convertApiToDoctorInfoArray, convertApiToDoctorArray } from '../utils/doctorUtils';
import { doctorsInfo } from '../data/doctorData';
// 移除假資料導入
// import { doctors as mockDoctors } from '../data/mockData';
import { getLineUserId } from '../config/api';

interface UseDoctorsReturn {
  doctorsInfo: DoctorInfo[];
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

export const useDoctors = (lineUserId?: string): UseDoctorsReturn => {
  const [doctorsInfoState, setDoctorsInfoState] = useState<DoctorInfo[]>([]);
  const [doctorsState, setDoctorsState] = useState<Doctor[]>([]);
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

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getDoctors(getActiveLineUserId());
      
      if (response.success && response.data) {
        try {
          console.log('API 響應:', response);
          console.log('response.data 類型:', typeof response.data);
          console.log('response.data 內容:', response.data);
          
          // response.data 現在是 ApiDoctorsResponse 格式 {data: ApiDoctor[], meta: {...}}
          const apiDoctorsResponse = response.data;
          
          if (!apiDoctorsResponse.data || !Array.isArray(apiDoctorsResponse.data)) {
            throw new Error('API 響應格式不正確：缺少 data 陣列');
          }
          
          const doctorsArray = apiDoctorsResponse.data;
          console.log('提取的醫師陣列:', doctorsArray);
          
          const apiDoctorsInfo = convertApiToDoctorInfoArray(doctorsArray);
          const apiDoctors = convertApiToDoctorArray(doctorsArray);
          
          // 只使用API資料，不回退到假資料
          setDoctorsInfoState(apiDoctorsInfo);
          setDoctorsState(apiDoctors);
          console.log('成功轉換 API 醫師資料，共', apiDoctorsInfo.length, '位醫師');
          
        } catch (conversionError) {
          console.error('資料轉換錯誤:', conversionError);
          setError(`資料轉換失敗: ${conversionError instanceof Error ? conversionError.message : '未知錯誤'}`);
          // 不使用假資料，保持空陣列
          setDoctorsInfoState([]);
          setDoctorsState([]);
        }
      } else {
        // API 失敗時不使用假資料
        console.warn('API 獲取醫生資料失敗:', response.message);
        setError(response.message || 'API 呼叫失敗');
        setDoctorsInfoState([]);
        setDoctorsState([]);
      }
    } catch (err) {
      console.error('獲取醫生資料時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      // 不使用假資料，保持空陣列
      setDoctorsInfoState([]);
      setDoctorsState([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctorsInfo: doctorsInfoState,
    doctors: doctorsState,
    loading,
    error
  };
}; 