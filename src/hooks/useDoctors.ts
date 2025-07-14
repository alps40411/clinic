import { useState, useEffect } from 'react';
import { DoctorInfo } from '../types/doctor';
import { Doctor } from '../types/appointment';
import { convertApiToDoctorInfoArray, convertApiToDoctorArray } from '../utils/doctorUtils';
import { apiService, ApiDoctor, ApiDoctorsResponse } from '../services/apiService';
import { doctorsInfo } from '../data/doctorData';
import { doctors as mockDoctors } from '../data/mockData';
import { getLineUserId } from '../config/api';

interface UseDoctorsReturn {
  doctorsInfo: DoctorInfo[];
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDoctors = (lineUserId?: string): UseDoctorsReturn => {
  const [doctorsInfoState, setDoctorsInfoState] = useState<DoctorInfo[]>(doctorsInfo);
  const [doctorsState, setDoctorsState] = useState<Doctor[]>(mockDoctors);
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
          
          // 如果轉換後有資料，使用 API 資料；否則使用本地資料
          if (apiDoctorsInfo.length > 0) {
            setDoctorsInfoState(apiDoctorsInfo);
            setDoctorsState(apiDoctors);
            console.log('成功轉換 API 醫師資料，共', apiDoctorsInfo.length, '位醫師');
          } else {
            console.warn('API 返回空的醫師陣列，使用本地資料');
            setError('API 返回的醫師資料為空');
            setDoctorsInfoState(doctorsInfo);
            setDoctorsState(mockDoctors);
          }
        } catch (conversionError) {
          console.error('資料轉換錯誤:', conversionError);
          setError(`資料轉換失敗: ${conversionError instanceof Error ? conversionError.message : '未知錯誤'}`);
          setDoctorsInfoState(doctorsInfo);
          setDoctorsState(mockDoctors);
        }
      } else {
        // API 失敗時使用本地資料
        console.warn('API 獲取醫生資料失敗，使用本地資料:', response.message);
        setError(response.message || 'API 呼叫失敗');
        setDoctorsInfoState(doctorsInfo);
        setDoctorsState(mockDoctors);
      }
    } catch (err) {
      console.error('獲取醫生資料時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      // 網路錯誤時使用本地資料
      setDoctorsInfoState(doctorsInfo);
      setDoctorsState(mockDoctors);
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
    error,
    refetch: fetchDoctors,
  };
}; 