import { useState, useEffect } from 'react';
import { ScheduleProgress } from '../types/schedule';
import { apiService, ScheduleParams, ApiSchedulesResponse } from '../services/apiService';
import { convertApiToScheduleProgressArray } from '../utils/scheduleUtils';
import { getLineUserId } from '../config/api';

interface UseSchedulesReturn {
  schedules: ScheduleProgress[];
  loading: boolean;
  error: string | null;
  refetch: (params?: ScheduleParams) => Promise<void>;
}

export const useSchedules = (
  initialParams: ScheduleParams = {},
  lineUserId?: string
): UseSchedulesReturn => {
  const [schedules, setSchedules] = useState<ScheduleProgress[]>([]);
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

  const fetchSchedules = async (params: ScheduleParams = initialParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getSchedules(params, getActiveLineUserId());
      
      if (response.success && response.data) {
        const schedulesData = convertApiToScheduleProgressArray(response.data.data);
        setSchedules(schedulesData);
      } else {
        setError(response.message || 'API 呼叫失敗');
        setSchedules([]);
      }
    } catch (err) {
      console.error('獲取看診進度時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 只有當參數有效時才調用 API
    if (initialParams.startDate && initialParams.endDate) {
      console.log('useSchedules: 調用 API，參數:', initialParams);
      fetchSchedules(initialParams);
    } else {
      console.log('useSchedules: 參數無效，清空排班資料');
      setSchedules([]);
    }
  }, [JSON.stringify(initialParams), lineUserId]);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
  };
}; 