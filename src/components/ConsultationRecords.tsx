import React, { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Calendar, Phone, Mail, MapPin, MessageSquare, Clock, Users, Trash2, Edit3, ArrowLeft, Eye, AlertCircle } from 'lucide-react';
import { ConsultationRecord, ConsultationResponseDto } from '../types/consultation';
import { mockConsultationRecords, clinicLocations, consultationTopics, availableTimes, howDidYouKnowOptions, consultants } from '../data/consultationData';
import { useConsultations } from '../hooks/useConsultations';

interface ConsultationRecordsProps {
  onBackToForm: () => void;
  onEditRecord: (record: ConsultationRecord) => void;
}

const ConsultationRecords: React.FC<ConsultationRecordsProps> = ({ onBackToForm, onEditRecord }) => {
  const { consultations, getConsultationsByLine, deleteConsultation, loading, error, clearError } = useConsultations();
  const [records, setRecords] = useState<ConsultationRecord[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [localError, setLocalError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(null);

  // 計算要顯示的記錄：優先 API 資料，否則顯示模擬資料
  const displayRecords = React.useMemo(() => {
    if (consultations.length > 0) {
      return consultations.map((consultation) => {
        console.log('處理諮詢資料:', consultation);
        
        // 安全地獲取 consultationDetails
        const details = consultation.consultationDetails || {};
        
        return {
          id: consultation.id,
          recordNumber: `CONS-${consultation.id}`,
          birthDate: '', 
          phone: '', 
          email: '', 
          clinicLocation: 'API諮詢',
          consultationTopic: details.consultationTopic || details.type || '未指定',
          availableTime: '', 
          howDidYouKnow: '', 
          preferredConsultant: '', 
          notes: details.notes || '',
          status: (details.status || 'pending') as 'pending' | 'contacted' | 'completed' | 'cancelled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as ConsultationRecord;
      });
    }
    return records;
  }, [consultations, records]);

  // 自動載入當前用戶的諮詢記錄
  const loadConsultations = useCallback(async () => {
    console.log('開始載入諮詢記錄...');
    clearError();
    setLocalError('');
    
    try {
      const result = await getConsultationsByLine({ page: 1, limit: 20 });
      console.log('API 回應:', result);
      
      // 檢查是否有數據
      if (result && result.data && result.data.length > 0) {
        console.log('成功載入', result.data.length, '筆諮詢記錄');
      } else {
        console.log('API 返回空數據，顯示模擬資料');
        setRecords(mockConsultationRecords.slice(0, 3));
        setLocalError('目前沒有諮詢記錄，顯示範例資料');
      }
      
      setHasLoaded(true);
    } catch (err) {
      console.error('載入諮詢記錄失敗:', err);
      // API 失敗時，顯示模擬數據以免頁面空白
      setRecords(mockConsultationRecords.slice(0, 3));
      setHasLoaded(true);
      setLocalError('無法連接到伺服器，顯示範例資料');
    }
  }, [getConsultationsByLine, clearError]);

  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  const handleDelete = async (recordId: string) => {
    if (window.confirm('確定要刪除此諮詢紀錄嗎？')) {
      try {
        await deleteConsultation(recordId);
        // 重新載入諮詢記錄
        await loadConsultations();
        alert('諮詢紀錄已成功刪除');
      } catch (err) {
        console.error('刪除諮詢失敗:', err);
        alert('刪除失敗，請稍後再試');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'contacted': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待聯絡';
      case 'contacted': return '已聯絡';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return '未知';
    }
  };

  const getLabelByValue = (options: any[], value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedRecord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedRecord(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              返回列表
            </button>
            <h1 className="text-xl font-bold text-gray-800">諮詢詳情</h1>
            <div className="w-16"></div>
          </div>

          {/* Record Detail */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">諮詢編號: {selectedRecord.recordNumber}</h2>
                <p className="text-sm text-gray-500 mt-1">建立時間: {formatDate(selectedRecord.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRecord.status)}`}>
                {getStatusText(selectedRecord.status)}
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">出生日期</label>
                  <p className="text-gray-800">{selectedRecord.birthDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">電話</label>
                  <p className="text-gray-800">{selectedRecord.phone}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">電子信箱</label>
                <p className="text-gray-800">{selectedRecord.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">預約院區</label>
                <p className="text-gray-800">{getLabelByValue(clinicLocations, selectedRecord.clinicLocation)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">諮詢項目</label>
                <p className="text-gray-800">{getLabelByValue(consultationTopics, selectedRecord.consultationTopic)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">可聯絡時段</label>
                <p className="text-gray-800">{getLabelByValue(availableTimes, selectedRecord.availableTime)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">如何得知</label>
                <p className="text-gray-800">{getLabelByValue(howDidYouKnowOptions, selectedRecord.howDidYouKnow)}</p>
              </div>

              {selectedRecord.preferredConsultant && (
                <div>
                  <label className="text-sm font-medium text-gray-500">指定諮詢人員</label>
                  <p className="text-gray-800">{getLabelByValue(consultants, selectedRecord.preferredConsultant)}</p>
                </div>
              )}

              {selectedRecord.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">備註</label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedRecord.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onEditRecord(selectedRecord)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                <Edit3 className="w-4 h-4" />
                編輯諮詢
              </button>
              <button
                onClick={() => handleDelete(selectedRecord.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                刪除紀錄
              </button>
            </div>
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
          <button
            onClick={onBackToForm}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            填寫諮詢
          </button>
          <h1 className="text-xl font-bold text-gray-800">諮詢紀錄</h1>
          <div className="w-16"></div>
        </div>

        {/* 顯示錯誤或警告信息 */}
        {(error || localError) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800 text-sm">{error || localError}</p>
            </div>
          </div>
        )}

        {/* 載入狀態 */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <p className="text-gray-600">載入諮詢記錄中...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {hasLoaded && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* 顯示記錄內容 */}
            {displayRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>查無諮詢紀錄</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800 mb-4">
                  找到 {displayRecords.length} 筆諮詢紀錄
                  {consultations.length === 0 && records.length > 0 && (
                    <span className="text-sm text-yellow-600 ml-2">(範例資料)</span>
                  )}
                </h3>
                {displayRecords.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-800">{record.recordNumber}</h4>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(record.createdAt)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MessageSquare className="w-4 h-4" />
                        <span>{getLabelByValue(consultationTopics, record.consultationTopic)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{getLabelByValue(clinicLocations, record.clinicLocation)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        查看詳情
                      </button>
                      <button
                        onClick={() => onEditRecord(record)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        刪除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationRecords;