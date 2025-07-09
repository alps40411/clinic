import React, { useState } from 'react';
import { Clock, Users, AlertCircle, CheckCircle, RefreshCw, Calendar, Loader2 } from 'lucide-react';
import { useSchedules } from '../hooks/useSchedules';
import { ScheduleProgress } from '../types/schedule';

const ClinicProgress: React.FC = () => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('all');
  const today = new Date().toISOString().split('T')[0];
  
  const { schedules, loading, error, refetch } = useSchedules({
    page: 1,
    limit: 50,
    startDate: `${today}T00:00:00Z`,
    endDate: `${today}T23:59:59Z`,
  });

  const timeSlots = ['all', '上午', '下午', '晚上'];

  const filteredProgress = selectedTimeSlot === 'all' 
    ? schedules 
    : schedules.filter(item => item.timeSlot === selectedTimeSlot);

  const handleRefresh = async () => {
    await refetch({
      page: 1,
      limit: 50,
      startDate: `${today}T00:00:00Z`,
      endDate: `${today}T23:59:59Z`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'waiting':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress':
        return '進行中';
      case 'waiting':
        return '等待中';
      case 'completed':
        return '已完成';
      default:
        return '未知';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-500';
      case 'waiting':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getWaitingTime = (schedule: ScheduleProgress) => {
    if (schedule.status === 'completed') {
      return '已結束';
    } else if (schedule.status === 'waiting') {
      return '尚未開始';
    } else {
      // 簡單估算等待時間（每位病患約 5 分鐘）
      const remainingPatients = schedule.totalCapacity - schedule.currentNumber;
      const estimatedMinutes = remainingPatients * 5;
      return estimatedMinutes > 0 ? `約 ${estimatedMinutes} 分鐘` : '即將結束';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Clock className="w-8 h-8 text-cyan-500" />
            看診進度
          </h1>
          <p className="text-gray-600">即時看診進度查詢</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">即時看診進度</h2>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              重新整理
            </button>
          </div>

          {/* Time Slot Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTimeSlot(slot)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  selectedTimeSlot === slot
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {slot === 'all' ? '全部' : slot}
              </button>
            ))}
          </div>

          {/* 載入狀態 */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-500 mr-2" />
              <span className="text-gray-600">載入看診進度中...</span>
            </div>
          )}

          {/* 錯誤狀態 */}
          {error && (
            <div className="flex items-center justify-center py-8 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">載入失敗: {error}</span>
            </div>
          )}

          {/* 空狀態 */}
          {!loading && !error && filteredProgress.length === 0 && (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Calendar className="w-8 h-8 mr-3" />
              <span>今日暫無看診進度資料</span>
            </div>
          )}

          {/* 進度列表 */}
          {!loading && !error && (
            <div className="space-y-4">
              {filteredProgress.map((item) => {
                const waitingTime = getWaitingTime(item);
                
                return (
                  <div
                    key={item.scheduleId}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.doctorName}</h3>
                          <p className="text-sm text-gray-600">{item.clinicName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            item.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {getStatusText(item.status)}
                          </span>
                          <span className="text-gray-500">{item.timeSlot}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{waitingTime}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">看診進度</span>
                        <span className="font-medium text-gray-800">
                          {item.currentNumber} / {item.totalCapacity}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.status)}`}
                          style={{ width: `${Math.min(item.progress, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>進度 {item.progress}%</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>剩餘 {item.totalCapacity - item.currentNumber} 位</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicProgress;