import React, { useState } from 'react';
import PatientProfileList from '../components/PatientProfileList';
import PatientProfileForm from '../components/PatientProfileForm';
import { PatientProfile, PatientFormData } from '../types/patient';

type ViewMode = 'list' | 'form';

const PatientProfileManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [editingProfile, setEditingProfile] = useState<PatientProfile | null>(null);

  const handleAddProfile = () => {
    setEditingProfile(null);
    setCurrentView('form');
  };

  const handleEditProfile = (profile: PatientProfile) => {
    setEditingProfile(profile);
    setCurrentView('form');
  };

  const handleSaveProfile = (profileData: PatientFormData) => {
    console.log('Saving profile:', profileData);
    // Here you would typically save to your backend or local storage
    
    // Simulate success
    setTimeout(() => {
      alert(editingProfile ? '使用者資料已成功更新！' : '使用者資料已成功新增！');
      setCurrentView('list');
      setEditingProfile(null);
    }, 100);
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