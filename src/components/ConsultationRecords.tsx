import React, { useState } from 'react';
import { Search, FileText, Calendar, Phone, Mail, MapPin, MessageSquare, Clock, Users, Trash2, Edit3, ArrowLeft, Eye, AlertCircle } from 'lucide-react';
import { ConsultationRecord } from '../types/consultation';
import { mockConsultationRecords, clinicLocations, consultationTopics, availableTimes, howDidYouKnowOptions, consultants } from '../data/consultationData';

interface ConsultationRecordsProps {
  onBackToForm: () => void;
  onEditRecord: (record: ConsultationRecord) => void;
}

const ConsultationRecords: React.FC<ConsultationRecordsProps> = ({ onBackToForm, onEditRecord }) => {
  const [searchPhone, setSearchPhone] = useState('');
  const [records, setRecords] = useState<ConsultationRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(null);

  const handleSearch = async () => {
    if (!searchPhone.trim()) {
      setError('請輸入電話號碼');
      return;
    }

    if (!/^09\d{8}$/.test(searchPhone)) {
      setError('電話號碼格式不正確');
      return;
    }

    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userRecords = mockConsultationRecords.filter(
        record => record.phone === searchPhone
      );
      setRecords(userRecords);
      setHasSearched(true);
      setIsLoading(false);
    }, 500);
  };

  const handleDelete = (recordId: string) => {
    if (window.confirm('確定要刪除此諮詢紀錄嗎？')) {
      setRecords(prev => prev.filter(record => record.id !== recordId));
      alert('諮詢紀錄已成功刪除');
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

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-500" />
            查詢諮詢紀錄
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="searchPhone" className="block text-sm font-medium text-gray-700 mb-2">
                電話號碼 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="tel"
                  id="searchPhone"
                  value={searchPhone}
                  onChange={(e) => {
                    setSearchPhone(e.target.value);
                    setError('');
                  }}
                  placeholder="請輸入手機號碼"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchPhone}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  查詢
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {records.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>查無諮詢紀錄</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800 mb-4">
                  找到 {records.length} 筆諮詢紀錄
                </h3>
                {records.map((record) => (
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