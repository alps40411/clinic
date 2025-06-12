import React, { useState } from 'react';
import ConsultationForm from '../components/ConsultationForm';
import ConsultationRecords from '../components/ConsultationRecords';
import { ConsultationRecord } from '../types/consultation';

type ViewMode = 'form' | 'records';

const ConsultationPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('form');
  const [editingRecord, setEditingRecord] = useState<ConsultationRecord | null>(null);

  const handleViewRecords = () => {
    setCurrentView('records');
    setEditingRecord(null);
  };

  const handleBackToForm = () => {
    setCurrentView('form');
    setEditingRecord(null);
  };

  const handleEditRecord = (record: ConsultationRecord) => {
    setEditingRecord(record);
    setCurrentView('form');
  };

  const handleClearEdit = () => {
    setEditingRecord(null);
  };

  if (currentView === 'records') {
    return (
      <ConsultationRecords
        onBackToForm={handleBackToForm}
        onEditRecord={handleEditRecord}
      />
    );
  }

  return (
    <ConsultationForm
      onViewRecords={handleViewRecords}
      editingRecord={editingRecord}
      onClearEdit={handleClearEdit}
    />
  );
};

export default ConsultationPage;