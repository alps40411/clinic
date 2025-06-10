export interface ConsultationForm {
  id?: string;
  birthDate: string;
  phone: string;
  email: string;
  clinicLocation: string;
  consultationTopic: string;
  availableTime: string;
  howDidYouKnow: string;
  preferredConsultant: string;
  notes: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface ConsultationRecord extends ConsultationForm {
  id: string;
  recordNumber: string;
}