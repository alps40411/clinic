import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  Activity, 
  Coffee, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  User
} from 'lucide-react';
import { ClinicProgress as ClinicProgressType, QueueStatus, PatientQueue } from '../types/progress';
import { mockClinicProgress, mockPatientQueues } from '../data/progressData';

const ClinicProgress: React.FC = () => {
  const [progressData, setProgressData] = useState<ClinicProgressType>(mockClinicProgress);
  const [selectedQueue, setSelectedQueue] = useState<QueueStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      // In real app, this would fetch fresh data from API
      setProgressData({
        ...mockClinicProgress,
        lastUpdated: new Date().toISOString()
      });
      setIsRefreshing(false);
    }, 1000);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastUpdated = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'break': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'finished': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '看診中';
      case 'break': return '休息中';
      case 'finished': return '已結束';
      default: return '未知';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      case 'finished': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  const getQueueStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return '等候中';
      case 'in-progress': return '看診中';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  const getQueueStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-blue-600 bg-blue-50';
      case 'in-progress': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (selectedQueue) {
    const queueData = mockPatientQueues[selectedQueue.doctorId] || [];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedQueue(null)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">詳細排隊狀況</h1>
            <div className="w-10"></div>
          </div>

          {/* Doctor Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">{selectedQueue.doctorName}</h2>
                <p className="text-sm text-gray-600">{selectedQueue.specialty}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(selectedQueue.status)}`}>
                {getStatusIcon(selectedQueue.status)}
                {getStatusText(selectedQueue.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-cyan-600">{selectedQueue.currentNumber}</div>
                <div className="text-sm text-gray-600">目前看診</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{selectedQueue.totalPatients}</div>
                <div className="text-sm text-gray-600">總人數</div>
              </div>
            </div>

            {selectedQueue.status === 'active' && (
              <div className="text-center p-3 bg-cyan-50 rounded-lg">
                <div className="text-lg font-semibold text-cyan-700">預估等候時間</div>
                <div className="text-2xl font-bold text-cyan-600">{selectedQueue.estimatedWaitTime} 分鐘</div>
              </div>
            )}

            {selectedQueue.status === 'break' && selectedQueue.resumeTime && (
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm text-yellow-700">預計恢復看診時間</div>
                <div className="text-lg font-semibold text-yellow-600">{selectedQueue.resumeTime}</div>
              </div>
            )}
          </div>

          {/* Queue List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">排隊詳情</h3>
            
            {queueData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暫無排隊資訊</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queueData.map((patient, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      patient.status === 'in-progress' 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          patient.status === 'in-progress' 
                            ? 'bg-green-500 text-white' 
                            : patient.status === 'completed'
                            ? 'bg-gray-400 text-white'
                            : 'bg-blue-500 text-white'
                        }`}>
                          {patient.queueNumber}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{patient.patientName}</div>
                          <div className="text-sm text-gray-600">預約時間: {patient.appointmentTime}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQueueStatusColor(patient.status)}`}>
                        {getQueueStatusText(patient.status)}
                      </span>
                    </div>
                    
                    {patient.estimatedTime && patient.status === 'waiting' && (
                      <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded">
                        預估看診時間: {patient.estimatedTime}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-500" />
            看診進度
          </h1>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 disabled:opacity-50 transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            更新
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">即時查看各醫師看診進度</p>
          <p className="text-sm text-gray-500 mt-1">
            最後更新: {formatLastUpdated(progressData.lastUpdated)}
          </p>
        </div>

        {/* Progress Cards */}
        <div className="space-y-4">
          {progressData.queues.map((queue) => (
            <div key={queue.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{queue.doctorName}</h3>
                    <p className="text-sm text-gray-600">{queue.specialty}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(queue.status)}`}>
                  {getStatusIcon(queue.status)}
                  {getStatusText(queue.status)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>看診進度</span>
                  <span>{queue.currentNumber} / {queue.totalPatients}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(queue.currentNumber, queue.totalPatients)}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {getProgressPercentage(queue.currentNumber, queue.totalPatients)}% 完成
                </div>
              </div>

              {/* Status Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-cyan-600">{queue.currentNumber}</div>
                  <div className="text-xs text-gray-600">目前看診號碼</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-800">{queue.totalPatients - queue.currentNumber}</div>
                  <div className="text-xs text-gray-600">剩餘人數</div>
                </div>
              </div>

              {/* Wait Time or Status Info */}
              {queue.status === 'active' && (
                <div className="text-center p-3 bg-cyan-50 rounded-lg mb-4">
                  <div className="flex items-center justify-center gap-2 text-cyan-700">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">預估等候時間</span>
                  </div>
                  <div className="text-lg font-semibold text-cyan-600">{queue.estimatedWaitTime} 分鐘</div>
                </div>
              )}

              {queue.status === 'break' && queue.resumeTime && (
                <div className="text-center p-3 bg-yellow-50 rounded-lg mb-4">
                  <div className="flex items-center justify-center gap-2 text-yellow-700">
                    <Coffee className="w-4 h-4" />
                    <span className="text-sm">休息中，預計恢復時間</span>
                  </div>
                  <div className="text-lg font-semibold text-yellow-600">{queue.resumeTime}</div>
                </div>
              )}

              {queue.status === 'finished' && (
                <div className="text-center p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">今日看診已結束</span>
                  </div>
                </div>
              )}

              {queue.nextBreakTime && queue.status === 'active' && (
                <div className="text-center p-2 bg-blue-50 rounded-lg mb-4">
                  <div className="text-sm text-blue-600">
                    下次休息時間: {queue.nextBreakTime}
                  </div>
                </div>
              )}

              {/* View Details Button */}
              <button
                onClick={() => setSelectedQueue(queue)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <Eye className="w-4 h-4" />
                查看詳細排隊狀況
              </button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>看診進度每5分鐘自動更新</p>
          <p className="mt-1">實際看診時間可能因病情複雜度而有所調整</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicProgress;