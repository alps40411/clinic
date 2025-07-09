import { useState, useEffect } from 'react';
import { PatientProfile, PatientFormData } from '../types/patient';
import { apiService, ApiPatient } from '../services/apiService';
import { 
  convertApiToPatientProfile, 
  convertPatientFormToApiCreate,
  convertApiToPatientProfileArray 
} from '../utils/patientUtils';
import { mockPatientProfiles } from '../data/patientData';
import { LINE_USER_ID } from '../config/api';

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

export const usePatients = (lineUserId: string = LINE_USER_ID): UsePatientsReturn => {
  const [patients, setPatients] = useState<PatientProfile[]>(mockPatientProfiles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 注意：這裡我們暫時不呼叫 GET /patients API，因為用戶說不使用它
      // 但我們可以維護本地的患者列表狀態
      setPatients(mockPatientProfiles);
    } catch (err) {
      console.error('獲取患者列表時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      setPatients(mockPatientProfiles);
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (formData: PatientFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const apiData = convertPatientFormToApiCreate(formData);
      const response = await apiService.createPatient(apiData, lineUserId);
      
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
      const apiData = convertPatientFormToApiCreate(formData);
      const response = await apiService.updatePatient(id, apiData, lineUserId);
      
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
      const response = await apiService.deletePatient(id, lineUserId);
      
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
      const response = await apiService.getPatientById(id, lineUserId);
      
      if (response.success && response.data) {
        return convertApiToPatientProfile(response.data);
      } else {
        setError(response.message || '獲取患者資料失敗');
        return null;
      }
    } catch (err) {
      console.error('獲取患者資料時發生錯誤:', err);
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
      const response = await apiService.searchPatientByIdNumber(idNumber, lineUserId);
      
      if (response.success && response.data) {
        return convertApiToPatientProfile(response.data);
      } else {
        setError(response.message || '找不到該身分證字號的患者資料');
        return null;
      }
    } catch (err) {
      console.error('搜尋患者時發生錯誤:', err);
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