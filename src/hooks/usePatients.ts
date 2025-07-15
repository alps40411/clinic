import { useState, useEffect } from 'react';
import { PatientProfile, PatientFormData } from '../types/patient';
import { apiService, ApiPatient } from '../services/apiService';
import { 
  convertApiToPatientProfile, 
  convertPatientFormToApiCreate,
  convertApiToPatientProfileArray 
} from '../utils/patientUtils';
// 移除假資料導入，因為沒有使用
// import { mockPatientProfiles } from '../data/patientData';
import { getLineUserId } from '../config/api';

interface UsePatientsReturn {
  patients: PatientProfile[];
  loading: boolean;
  error: string | null;
  createPatient: (formData: PatientFormData) => Promise<boolean>;
  updatePatient: (id: string, formData: PatientFormData) => Promise<boolean>;
  deletePatient: (id: string) => Promise<boolean>;
  getPatientById: (id: string) => Promise<PatientProfile | null>;
  searchPatientByIdNumber: (idNumber: string) => Promise<PatientProfile | null>;
  refetch: () => Promise<void>;
}

export const usePatients = (lineUserId?: string): UsePatientsReturn => {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
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

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getPatients(getActiveLineUserId());
      
      console.log('getPatients API 完整回應:', response);
      console.log('response.data 類型:', typeof response.data);
      console.log('response.data 內容:', response.data);
      
      if (response.success && response.data) {
        try {
          // 轉換 API 資料為所需格式
          // response.data 現在是 ApiPatientsResponse 格式 {data: ApiPatient[], meta: {...}}
          
          // 檢查 response.data 是否有 data 屬性（分頁格式）
          if (response.data.data && Array.isArray(response.data.data)) {
            console.log('檢測到分頁格式，使用 response.data.data');
            const apiPatients = convertApiToPatientProfileArray(response.data.data);
            console.log('轉換後的患者資料:', apiPatients);
            setPatients(apiPatients);
          } else if (Array.isArray(response.data)) {
            // 如果 response.data 直接是陣列（舊格式）
            console.log('檢測到陣列格式，直接使用 response.data');
            const apiPatients = convertApiToPatientProfileArray(response.data);
            console.log('轉換後的患者資料:', apiPatients);
            setPatients(apiPatients);
          } else {
            console.error('無法識別的 API 回應格式:', response.data);
            setError('API 回應格式不正確');
            setPatients([]);
          }
        } catch (conversionError) {
          console.error('患者資料轉換錯誤:', conversionError);
          console.error('問題資料:', response.data);
          setError(`資料轉換失敗: ${conversionError instanceof Error ? conversionError.message : '未知錯誤'}`);
          setPatients([]);
        }
      } else {
        // API 失敗時顯示空陣列
        console.warn('API 獲取患者資料失敗:', response.message);
        setError(response.message || 'API 呼叫失敗');
        setPatients([]);
      }
    } catch (err) {
      // 網路錯誤或其他異常時顯示空陣列
      console.error('獲取患者列表時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (formData: PatientFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const apiData = convertPatientFormToApiCreate(formData, getActiveLineUserId());
      const response = await apiService.createPatient(apiData, getActiveLineUserId());
      
      if (response.success && response.data) {
        const newPatient = convertApiToPatientProfile(response.data);
        setPatients(prev => [...prev, newPatient]);
        return true;
      } else {
        setError(response.message || '創建患者失敗');
        return false;
      }
    } catch (err) {
      console.error('創建患者時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (id: string, formData: PatientFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const apiData = convertPatientFormToApiCreate(formData, getActiveLineUserId());
      const response = await apiService.updatePatient(id, apiData, getActiveLineUserId());
      
      if (response.success && response.data) {
        const updatedPatient = convertApiToPatientProfile(response.data);
        setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
        return true;
      } else {
        setError(response.message || '更新患者失敗');
        return false;
      }
    } catch (err) {
      console.error('更新患者時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.deletePatient(id, getActiveLineUserId());
      
      if (response.success) {
        setPatients(prev => prev.filter(p => p.id !== id));
        return true;
      } else {
        setError(response.message || '刪除患者失敗');
        return false;
      }
    } catch (err) {
      console.error('刪除患者時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPatientById = async (id: string): Promise<PatientProfile | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getPatientById(id, getActiveLineUserId());
      
      if (response.success && response.data) {
        return convertApiToPatientProfile(response.data);
      } else {
        // API 失敗時返回 null
        console.warn(`API 獲取患者 ${id} 資料失敗:`, response.message);
        setError(response.message || 'API 呼叫失敗');
        return null;
      }
    } catch (err) {
      // 網路錯誤或其他異常時返回 null
      console.error(`獲取患者 ${id} 資料時發生錯誤:`, err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchPatientByIdNumber = async (idNumber: string): Promise<PatientProfile | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.searchPatientByIdNumber(idNumber, getActiveLineUserId());
      
      if (response.success && response.data) {
        return convertApiToPatientProfile(response.data);
      } else {
        // API 失敗時返回 null
        console.warn(`API 搜尋患者 ${idNumber} 失敗:`, response.message);
        setError(response.message || 'API 呼叫失敗');
        return null;
      }
    } catch (err) {
      // 網路錯誤或其他異常時返回 null
      console.error(`搜尋患者 ${idNumber} 時發生錯誤:`, err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [lineUserId]);

  return {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    searchPatientByIdNumber,
    refetch: fetchPatients,
  };
}; 