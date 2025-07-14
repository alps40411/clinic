import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { 
  CreateConsultationDto, 
  UpdateConsultationDto, 
  ConsultationResponseDto, 
  PaginatedConsultationResponseDto, 
  ConsultationQueryParams 
} from '../types/consultation';
import { getLineUserId } from '../config/api';

export const useConsultations = () => {
  const [consultations, setConsultations] = useState<ConsultationResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // 獲取實際的LINE user ID
  const getActiveLineUserId = (providedLineUserId?: string): string => {
    if (providedLineUserId) {
      return providedLineUserId;
    }
    try {
      return getLineUserId();
    } catch (error) {
      console.warn('Failed to get LINE user ID, this might cause API calls to fail');
      throw error;
    }
  };

  // 建立諮詢預約
  const createConsultation = useCallback(async (
    consultationData: CreateConsultationDto,
    lineUserId?: string,
    authToken?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.createConsultation(
        consultationData, 
        getActiveLineUserId(lineUserId), 
        authToken
      );
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || '建立諮詢失敗');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '建立諮詢時發生未知錯誤';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 查詢 LINE 用戶的諮詢預約
  const getConsultationsByLine = useCallback(async (
    params: ConsultationQueryParams = {},
    lineUserId?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getConsultationsByLine(
        params, 
        getActiveLineUserId(lineUserId)
      );
      
      if (response.success) {
        setConsultations(response.data.data);
        setTotal(response.data.total);
        setCurrentPage(response.data.page);
        return response.data;
      } else {
        throw new Error(response.message || '查詢諮詢失敗');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '查詢諮詢時發生未知錯誤';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新諮詢預約
  const updateConsultation = useCallback(async (
    consultationId: string,
    updateData: UpdateConsultationDto,
    lineUserId?: string,
    authToken?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updateConsultation(
        consultationId, 
        updateData, 
        getActiveLineUserId(lineUserId), 
        authToken
      );
      
      if (response.success) {
        // 更新本地狀態中的諮詢資料
        setConsultations(prev => 
          prev.map(consultation => 
            consultation.id === consultationId ? response.data : consultation
          )
        );
        return response.data;
      } else {
        throw new Error(response.message || '更新諮詢失敗');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新諮詢時發生未知錯誤';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 刪除諮詢預約
  const deleteConsultation = useCallback(async (
    consultationId: string,
    lineUserId?: string,
    authToken?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.deleteConsultation(
        consultationId, 
        getActiveLineUserId(lineUserId), 
        authToken
      );
      
      if (response.success) {
        // 從本地狀態中移除已刪除的諮詢
        setConsultations(prev => 
          prev.filter(consultation => consultation.id !== consultationId)
        );
        setTotal(prev => prev - 1);
        return true;
      } else {
        throw new Error(response.message || '刪除諮詢失敗');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '刪除諮詢時發生未知錯誤';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 清除錯誤
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 重置狀態
  const resetState = useCallback(() => {
    setConsultations([]);
    setLoading(false);
    setError(null);
    setTotal(0);
    setCurrentPage(1);
  }, []);

  return {
    // 狀態
    consultations,
    loading,
    error,
    total,
    currentPage,
    
    // 操作方法
    createConsultation,
    getConsultationsByLine,
    updateConsultation,
    deleteConsultation,
    
    // 輔助方法
    clearError,
    resetState,
  };
}; 