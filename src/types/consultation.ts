// 原有的本地諮詢表單介面（保留現有功能）
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

// API 相關的諮詢介面
export interface ConsultationDetails {
  date?: string;
  time?: string;
  type?: string;
  patientId?: number;
  doctorId?: number;
  clinicId?: number;
  consultationTopic?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

// 建立諮詢的請求資料
export interface CreateConsultationDto {
  consultationDetails: ConsultationDetails;
}

// 更新諮詢的請求資料
export interface UpdateConsultationDto {
  consultationDetails: Partial<ConsultationDetails>;
}

// 諮詢回應資料
export interface ConsultationResponseDto {
  id: string;
  consultationDetails: ConsultationDetails;
}

// 分頁諮詢回應資料
export interface PaginatedConsultationResponseDto {
  data: ConsultationResponseDto[];
  total: number;
  page: number;
  limit: number;
}

// 查詢參數
export interface ConsultationQueryParams {
  page?: number;
  limit?: number;
}