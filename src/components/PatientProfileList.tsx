import React, { useState } from 'react';
import { Users, Plus, Edit3, Trash2, User, Phone, Mail, Calendar, Eye, X } from 'lucide-react';
import { PatientProfile } from '../types/patient';
import { usePatients } from '../hooks/usePatients';

interface PatientProfileListProps {
  onAddProfile: () => void;
  onEditProfile: (profile: PatientProfile) => void;
}

const PatientProfileList: React.FC<PatientProfileListProps> = ({
  onAddProfile,
  onEditProfile
}) => {
  const { patients, deletePatient, loading, error } = usePatients();
  const [selectedProfile, setSelectedProfile] = useState<PatientProfile | null>(null);

  const handleDelete = async (profileId: string) => {
    const profile = patients.find(p => p.id === profileId);
    if (profile && window.confirm(`確定要刪除 ${profile.name} 的資料嗎？`)) {
      const success = await deletePatient(profileId);
      if (success) {
        alert('使用者資料已成功刪除');
      } else {
        alert(`刪除失敗：${error || '未知錯誤'}`);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      // 處理 ISO 格式的日期
      if (dateString.includes('T')) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // 處理 8 位數字格式的日期
      if (dateString.length === 8) {
        const year = dateString.slice(0, 4);
        const month = dateString.slice(4, 6);
        const day = dateString.slice(6, 8);
        return `${year}年${month}月${day}日`;
      }
      
      // 處理 YYYY-MM-DD 格式
      if (dateString.includes('-')) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      return dateString;
    } catch (error) {
      console.error('日期格式錯誤:', error);
      return dateString;
    }
  };

  if (selectedProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedProfile(null)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">使用者詳細資料</h1>
            <div className="w-10"></div>
          </div>

          {/* Profile Detail */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{selectedProfile.name}</h2>
                  <p className="text-sm text-gray-500">建立時間: {formatDate(selectedProfile.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  基本資料
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">身分證字號</p>
                      <p className="text-gray-800">{selectedProfile.idNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">出生日期</p>
                      <p className="text-gray-800">{formatDate(selectedProfile.birthDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  聯絡資訊
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">手機號碼</p>
                      <p className="text-gray-800">{selectedProfile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">電子信箱</p>
                      <p className="text-gray-800">{selectedProfile.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onEditProfile(selectedProfile)}
                className="flex-1 bg-cyan-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-cyan-600 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                編輯
              </button>
              <button
                onClick={() => handleDelete(selectedProfile.id)}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                刪除
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
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-500" />
            使用者管理
          </h1>
          <button
            onClick={onAddProfile}
            className="bg-cyan-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-cyan-600 transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增
          </button>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <p className="mt-2 text-gray-600">載入中...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Patient List */}
        <div className="space-y-4">
          {patients.map((profile) => (
            <div key={profile.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{profile.name}</h3>
                    <p className="text-sm text-gray-500">身分證字號: {profile.idNumber}</p>
                    <p className="text-sm text-gray-500">出生日期: {formatDate(profile.birthDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProfile(profile)}
                    className="p-2 text-gray-500 hover:text-cyan-500 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditProfile(profile)}
                    className="p-2 text-gray-500 hover:text-cyan-500 transition-colors duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && patients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">尚無使用者資料</h3>
            <p className="text-gray-500 mb-4">點擊「新增」按鈕開始新增使用者資料</p>
            <button
              onClick={onAddProfile}
              className="bg-cyan-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-cyan-600 transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              新增第一個使用者
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfileList;