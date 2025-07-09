import { useState, useEffect } from 'react';
import { DoctorInfo } from '../types/doctor';
import { Doctor } from '../types/appointment';
import { apiService, ApiDoctorsResponse } from '../services/apiService';
import { convertApiToDoctorInfoArray, convertApiToDoctorArray } from '../utils/doctorUtils';
import { doctorsInfo } from '../data/doctorData';
import { doctors as mockDoctors } from '../data/mockData';
import { LINE_USER_ID } from '../config/api';

interface UseDoctorsReturn {
  doctorsInfo: DoctorInfo[];
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDoctors = (lineUserId: string = LINE_USER_ID): UseDoctorsReturn => {
  const [doctorsInfoState, setDoctorsInfoState] = useState<DoctorInfo[]>(doctorsInfo);
  const [doctorsState, setDoctorsState] = useState<Doctor[]>(mockDoctors);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getDoctors(lineUserId);
      
      if (response.success && response.data) {
        try {
          // 轉換 API 資料為所需格式
          const apiDoctorsInfo = convertApiToDoctorInfoArray(response.data);
          const apiDoctors = convertApiToDoctorArray(response.data);
          
          // 如果轉換後有資料，使用 API 資料；否則使用本地資料
          if (apiDoctorsInfo.length > 0) {
            setDoctorsInfoState(apiDoctorsInfo);
            setDoctorsState(apiDoctors);
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
      // 網路錯誤或其他異常時使用本地資料
      console.error('獲取醫生資料時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
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