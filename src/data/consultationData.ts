import { DropdownOption, ConsultationRecord } from '../types/consultation';

export const clinicLocations: DropdownOption[] = [
  { value: 'taipei-main', label: '上杉診所(竹北)' },
  { value: 'taichung', label: '上杉診所(台中)' },
  { value: 'kaohsiung', label: '上杉診所(高雄)' },
  { value: 'tainan', label: '上杉診所(台南)' }
];

export const consultationTopics: DropdownOption[] = [
  { value: 'general-health', label: '一般健康諮詢' },
  { value: 'chronic-disease', label: '慢性疾病管理' },
  { value: 'preventive-care', label: '預防保健' },
  { value: 'nutrition', label: '營養諮詢' },
  { value: 'mental-health', label: '心理健康' },
  { value: 'pediatric', label: '兒童健康' },
  { value: 'elderly-care', label: '銀髮族照護' },
  { value: 'women-health', label: '婦女健康' },
  { value: 'other', label: '其他' }
];

export const availableTimes: DropdownOption[] = [
  { value: 'morning', label: '上午 (09:00-12:00)' },
  { value: 'afternoon', label: '下午 (14:00-17:00)' },
  { value: 'evening', label: '晚上 (18:00-21:00)' },
  { value: 'weekend', label: '週末時段' },
  { value: 'flexible', label: '時間彈性' }
];

export const howDidYouKnowOptions: DropdownOption[] = [
  { value: 'google-search', label: 'Google搜尋' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'line', label: 'LINE' },
  { value: 'friend-referral', label: '親友推薦' },
  { value: 'doctor-referral', label: '醫師轉介' },
  { value: 'advertisement', label: '廣告宣傳' },
  { value: 'website', label: '官方網站' },
  { value: 'other', label: '其他' }
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