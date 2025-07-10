import React, { useState, useEffect } from 'react';
import { Clock, Loader2, AlertCircle } from 'lucide-react';
import { Doctor } from '../types/appointment';
import { useSchedules } from '../hooks/useSchedules';
import { Schedule } from '../types/schedule';
import { apiService, ApiSchedule } from '../services/apiService';

interface TimeSlotSelectionProps {
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  onSelectTimeSlot: (timeSlot: string, scheduleId: string, scheduleData: ApiSchedule) => void;
}

interface TimeSlotWithSchedule {
  session: string;
  displayName: string;
  scheduleId: string | null;
  available: boolean;
  currentAppointments?: number;
  capacity?: number;
  scheduleData?: ApiSchedule;
}

const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({ 
  selectedDoctor, 
  selectedDate, 
  selectedTimeSlot, 
  onSelectTimeSlot 
}) => {
  const [doctorSchedules, setDoctorSchedules] = useState<ApiSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlotWithSchedule[]>([]);

  // 獲取從明天開始兩周內的日期範圍
  const getDateRange = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    
    return {
      startDate: tomorrow.toISOString().split('T')[0] + 'T00:00:00Z',
      endDate: twoWeeksLater.toISOString().split('T')[0] + 'T23:59:59Z'
    };
  };

  // 當選擇醫師後，獲取該醫師從明天開始兩周內的所有排班
  useEffect(() => {
    const fetchDoctorSchedules = async () => {
      if (!selectedDoctor) {
        setDoctorSchedules([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const { startDate, endDate } = getDateRange();
        const response = await apiService.getSchedules({
          startDate,
          endDate
        });
        
        if (response.success && response.data) {
          // 篩選出選定醫師的排班
          const filteredSchedules = response.data.data.filter(schedule => 
            schedule.doctorId.toString() === selectedDoctor.id
          );
          setDoctorSchedules(filteredSchedules);
        } else {
          setError(response.message || '獲取排班資料失敗');
          setDoctorSchedules([]);
        }
      } catch (err) {
        console.error('獲取醫師排班時發生錯誤:', err);
        setError(err instanceof Error ? err.message : '未知錯誤');
        setDoctorSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorSchedules();
  }, [selectedDoctor]);

  // 當選定日期後，處理該日期的時段資料
  useEffect(() => {
    if (!selectedDate || doctorSchedules.length === 0) {
      setTimeSlots([]);
      return;
    }

    // 篩選出選定日期的排班
    const dateSchedules = doctorSchedules.filter(schedule => {
      const scheduleDate = schedule.date.split('T')[0]; // 提取日期部分 (YYYY-MM-DD)
      return scheduleDate === selectedDate;
    });

    // 建立早中晚三個時段的資料結構
    const sessionMapping = {
      'MORNING': { session: 'morning', displayName: '上午診' },
      'AFTERNOON': { session: 'afternoon', displayName: '下午診' },
      'EVENING': { session: 'evening', displayName: '夜診' },
    };

    const processedTimeSlots: TimeSlotWithSchedule[] = [];

    // 處理每個時段
    Object.entries(sessionMapping).forEach(([timeSlotKey, sessionInfo]) => {
      const schedule = dateSchedules.find(s => s.timeSlot === timeSlotKey);
      
      if (schedule) {
        // 有對應的班表
        const available = schedule.currentAppointments < schedule.clinic.capacity;
        processedTimeSlots.push({
          session: sessionInfo.session,
          displayName: sessionInfo.displayName,
          scheduleId: schedule.id.toString(),
          available,
          currentAppointments: schedule.currentAppointments,
          capacity: schedule.clinic.capacity,
          scheduleData: schedule
        });
      } else {
        // 沒有對應的班表，顯示為不可預約
        processedTimeSlots.push({
          session: sessionInfo.session,
          displayName: sessionInfo.displayName,
          scheduleId: null,
          available: false
        });
      }
    });

    setTimeSlots(processedTimeSlots);
  }, [selectedDate, doctorSchedules]);

  const TimeSlotButton: React.FC<{ slot: TimeSlotWithSchedule }> = ({ slot }) => (
    <button
      onClick={() => slot.available && slot.scheduleId && slot.scheduleData && onSelectTimeSlot(slot.displayName, slot.scheduleId, slot.scheduleData)}
      disabled={!slot.available || !slot.scheduleId}
      className={`p-4 rounded-lg text-sm font-medium transition-all duration-200 ${
        selectedTimeSlot === slot.displayName
          ? 'bg-cyan-500 text-white shadow-sm'
          : slot.available && slot.scheduleId
          ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      }`}
    >
      <div className="text-center">
        <div className="font-medium">{slot.displayName}</div>
        {slot.scheduleId && (
          <div className="text-xs mt-1 opacity-75">
            {slot.currentAppointments}/{slot.capacity}
          </div>
        )}
      </div>
    </button>
  );

  if (!selectedDoctor) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-500" />
          選擇時段
        </h2>
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>請先選擇醫師</p>
        </div>
      </div>
    );
  }

  if (!selectedDate) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-500" />
          選擇時段
        </h2>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-500 mr-2" />
            <span className="text-gray-600">載入 {selectedDoctor.name} 醫師的排班資訊中...</span>
          </div>
        )}
        
        {!loading && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>請選擇日期以顯示可預約時段</p>
            {doctorSchedules.length > 0 && (
              <p className="text-sm mt-1 text-green-600">
                已載入 {selectedDoctor.name} 醫師的排班資料
              </p>
            )}
          </div>
        )}
        
        {error && (
          <div className="flex items-center py-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
            <span className="text-yellow-800 text-sm">
              無法載入排班資訊：{error}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-500" />
        選擇時段
      </h2>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-500 mr-2" />
          <span className="text-gray-600">載入班表資訊中...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center py-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
          <span className="text-yellow-800 text-sm">
            無法載入班表資訊：{error}
          </span>
        </div>
      )}

      {!loading && !error && (
        <>
          {timeSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{selectedDoctor.name} 醫師在此日期沒有排班</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 mb-6">
                {timeSlots.map((slot) => (
                  <TimeSlotButton key={slot.session} slot={slot} />
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-50 rounded border"></div>
                  <span>可預約</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                  <span>已選擇</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span>已滿號/不開診</span>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TimeSlotSelection;