import React, { useState } from 'react';
import PatientProfileList from '../components/PatientProfileList';
import PatientProfileForm from '../components/PatientProfileForm';
import { PatientProfile, PatientFormData } from '../types/patient';
import { usePatients } from '../hooks/usePatients';

type ViewMode = 'list' | 'form';

const PatientProfileManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [editingProfile, setEditingProfile] = useState<PatientProfile | null>(null);
  const { createPatient, updatePatient, loading, error } = usePatients();

  const handleAddProfile = () => {
    setEditingProfile(null);
    setCurrentView('form');
  };

  const handleEditProfile = (profile: PatientProfile) => {
    setEditingProfile(profile);
    setCurrentView('form');
  };

  const handleSaveProfile = async (profileData: PatientFormData) => {
    console.log('Saving profile:', profileData);
    
    let success = false;
    
    if (editingProfile) {
      // 更新現有患者
      success = await updatePatient(editingProfile.id, profileData);
    } else {
      // 創建新患者
      success = await createPatient(profileData);
    }
    
    if (success) {
      alert(editingProfile ? '使用者資料已成功更新！' : '使用者資料已成功新增！');
      setCurrentView('list');
      setEditingProfile(null);
    } else {
      alert(`${editingProfile ? '更新' : '新增'}失敗：${error || '未知錯誤'}`);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingProfile(null);
  };

  if (currentView === 'form') {
    return (
      <PatientProfileForm
        editingProfile={editingProfile}
        onSave={handleSaveProfile}
        onCancel={handleCancel}
        loading={loading}
      />
    );
  }

  return (
    <PatientProfileList
      onAddProfile={handleAddProfile}
      onEditProfile={handleEditProfile}
    />
  );
};

export default PatientProfileManager;