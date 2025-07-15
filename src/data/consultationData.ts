import { DropdownOption, ConsultationRecord } from '../types/consultation';

export const clinicLocations: DropdownOption[] = [
  { value: '台北總院', label: '台北總院' }
];

export const consultationTopics: DropdownOption[] = [
  { value: '一般諮詢', label: '一般諮詢' }
];

export const availableTimes: DropdownOption[] = [
  { value: '平日早上', label: '平日早上' }
];

export const howDidYouKnowOptions: DropdownOption[] = [
  { value: '路過', label: '路過' }
];

export const consultants: DropdownOption[] = [
  { value: 'any', label: '無特定偏好' },
  { value: 'dr-chen', label: '陳美玲醫師' },
  { value: 'dr-wang', label: '王志明醫師' },
  { value: 'dr-lee', label: '李淑芬醫師' },
  { value: 'dr-zhang', label: '張大偉醫師' },
  { value: 'nurse-liu', label: '劉護理師' },
  { value: 'nutritionist-huang', label: '黃營養師' }
];

// Mock consultation records
export const mockConsultationRecords: ConsultationRecord[] = [
  {
    id: '1',
    recordNumber: 'C2024120001',
    birthDate: '19880808',
    phone: '0912345678',
    email: 'john@example.com',
    clinicLocation: 'taipei-main',
    consultationTopic: 'general-health',
    availableTime: 'morning',
    howDidYouKnow: 'google-search',
    preferredConsultant: 'dr-chen',
    notes: '希望了解健康檢查相關資訊',
    status: 'pending',
    createdAt: '2024-12-10T10:00:00Z'
  },
  {
    id: '2',
    recordNumber: 'C2024120002',
    birthDate: '19880808',
    phone: '0912345678',
    email: 'john@example.com',
    clinicLocation: 'taipei-main',
    consultationTopic: 'nutrition',
    availableTime: 'afternoon',
    howDidYouKnow: 'friend-referral',
    preferredConsultant: 'nutritionist-huang',
    notes: '想諮詢減重飲食計畫',
    status: 'contacted',
    createdAt: '2024-12-08T14:30:00Z'
  }
];