import React, { useState } from 'react';
import { Users, Plus, Edit3, Trash2, User, Phone, Mail, MapPin, Heart, AlertTriangle, FileText, Eye, X } from 'lucide-react';
import { PatientProfile } from '../types/patient';
import { bloodTypes } from '../data/patientData';
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
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBirthDate = (birthDate: string) => {
    if (birthDate.length === 8) {
      return `${birthDate.slice(0, 4)}年${birthDate.slice(4, 6)}月${birthDate.slice(6, 8)}日`;
    }
    return birthDate;
  };

  const getBloodTypeLabel = (value: string) => {
    const bloodType = bloodTypes.find(type => type.value === value);
    return bloodType ? bloodType.label : value;
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
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">出生日期</p>
                      <p className="text-gray-800">{formatBirthDate(selectedProfile.birthDate)}</p>
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
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">地址</p>
                      <p className="text-gray-800">{selectedProfile.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  緊急聯絡人
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">姓名</p>
                      <p className="text-gray-800">{selectedProfile.emergencyContact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">電話</p>
                      <p className="text-gray-800">{selectedProfile.emergencyPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              {(selectedProfile.bloodType || selectedProfile.allergies || selectedProfile.medicalHistory) && (
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3 border-b border-gray-200 pb-2">
                    醫療資訊
                  </h3>
                  <div className="space-y-3">
                    {selectedProfile.bloodType && (
                      <div className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">血型</p>
                          <p className="text-gray-800">{getBloodTypeLabel(selectedProfile.bloodType)}</p>
                        </div>
                      </div>
                    )}
                    {selectedProfile.allergies && (
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">過敏史</p>
                          <p className="text-gray-800">{selectedProfile.allergies}</p>
                        </div>
                      </div>
                    )}
                    {selectedProfile.medicalHistory && (
                      <div className="flex items-start gap-3">
                        <FileText className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">病史</p>
                          <p className="text-gray-800">{selectedProfile.medicalHistory}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onEditProfile(selectedProfile)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                <Edit3 className="w-4 h-4" />
                編輯資料
              </button>
              <button
                onClick={() => handleDelete(selectedProfile.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                刪除資料
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
            看診資訊設定
          </h1>
          <button
            onClick={onAddProfile}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            新增
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">管理您的使用者資料，方便預約看診時直接選擇</p>
        </div>

        {/* Profiles List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Loading and Error States */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {patients.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="mb-4">尚未新增任何使用者資料</p>
              <button
                onClick={onAddProfile}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                新增第一筆資料
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800 mb-4">
                已儲存 {patients.length} 筆使用者資料
              </h3>
              {patients.map((profile) => (
                <div key={profile.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{profile.name}</h4>
                      <p className="text-sm text-gray-500">{profile.idNumber}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      查看詳情
                    </button>
                    <button
                      onClick={() => onEditProfile(profile)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                      編輯
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id)}
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
      </div>
    </div>
  );
};

export default PatientProfileList;