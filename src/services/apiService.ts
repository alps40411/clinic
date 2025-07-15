import { API_CONFIG, getLineUserId } from '../config/api';
import { 
  CreateConsultationDto, 
  UpdateConsultationDto, 
  ConsultationResponseDto, 
  PaginatedConsultationResponseDto, 
  ConsultationQueryParams 
} from '../types/consultation';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiDoctor {
  id: number;
  name: string;
  specialty: string;
  information: {
    title?: string;
    experience?: string;
    education?: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiDoctorsResponse {
  data: ApiDoctor[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiSchedule {
  id: number;
  doctorId: number;
  clinicId: number;
  date?: string; // 日期可能為空
  timeSlot?: string; // 時段可能為空
  currentAppointments?: number;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  doctor?: ApiDoctor; // 醫師資料可能為空
  clinic?: {
    id: number;
    name: string;
    capacity: number;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApiSchedulesResponse {
  data: ApiSchedule[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ScheduleParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  doctorId?: string; // 添加醫師篩選參數
}

export interface ApiPatient {
  id: number;
  lineId: string;
  name: string;
  idNumber: string;
  birthDate: string;
  phone: string;
  email: string;
  isBlacklisted: boolean;
  // 保留其他後端可能回傳的欄位
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiPatientsResponse {
  data: ApiPatient[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PatientCreateData {
  lineId: string;
  name: string;
  idNumber: string;
  birthDate: string; // YYYY-MM-DD 格式
  phone: string;
  email: string;
  isBlacklisted: boolean;
}

// 預約相關介面
export interface ApiAppointment {
  id: number;
  scheduleId: number;
  patientId: number;
  doctorId: number;
  clinicId: number;
  appointmentDate?: string; // 預約日期可能為空
  status?: string; // 狀態可能為空
  notes?: string;
  createdAt?: string; // 創建時間可能為空
  updatedAt?: string; // 更新時間可能為空
  schedule?: ApiSchedule; // 排程資料可能為空
  patient?: ApiPatient; // 患者資料可能為空
}

export interface ApiAppointmentsResponse {
  data: ApiAppointment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SearchAppointmentParams {
  idNumber: string;
  startDate: string;
  endDate: string;
  page?: number;
  limit?: number;
}

export interface UpdateAppointmentData {
  scheduleId: number;
  patientId: number;
  doctorId: number;
  clinicId: number;
  // notes 欄位不被API支持，已移除
}



class ApiService {
  private async request<T>(endpoint: string, lineUserId?: string): Promise<ApiResponse<T>> {
    try {
      // 獲取實際的LINE user ID
      const activeLineUserId = lineUserId || getLineUserId();
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: API_CONFIG.getHeaders(activeLineUserId),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getDoctors(lineUserId?: string): Promise<ApiResponse<ApiDoctorsResponse>> {
    const activeLineUserId = lineUserId || getLineUserId();
    return this.request<ApiDoctorsResponse>(API_CONFIG.ENDPOINTS.DOCTORS, activeLineUserId);
  }

  async getDoctorById(id: string, lineUserId?: string): Promise<ApiResponse<ApiDoctor>> {
    const activeLineUserId = lineUserId || getLineUserId();
    return this.request<ApiDoctor>(API_CONFIG.ENDPOINTS.DOCTOR_BY_ID(id), activeLineUserId);
  }

  async getPatients(lineUserId?: string): Promise<ApiResponse<ApiPatientsResponse>> {
    const activeLineUserId = lineUserId || getLineUserId();
    return this.request<ApiPatientsResponse>(API_CONFIG.ENDPOINTS.PATIENTS_BY_LINE, activeLineUserId);
  }

  async getSchedules(params: ScheduleParams = {}, lineUserId?: string): Promise<ApiResponse<ApiSchedulesResponse>> {
    const activeLineUserId = lineUserId || getLineUserId();
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.doctorId) queryParams.append('doctorId', params.doctorId);
    
    const endpoint = `${API_CONFIG.ENDPOINTS.SCHEDULES}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('getSchedules API 調用:', endpoint, params);
    return this.request<ApiSchedulesResponse>(endpoint, activeLineUserId);
  }

  // Patient API methods
  async createPatient(patientData: PatientCreateData, lineUserId?: string): Promise<ApiResponse<ApiPatient>> {
    const activeLineUserId = lineUserId || getLineUserId();
    try {
      console.log('創建患者請求資料:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}`,
        headers: API_CONFIG.getHeaders(activeLineUserId),
        body: patientData
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}`, {
        method: 'POST',
        headers: API_CONFIG.getHeaders(activeLineUserId),
        body: JSON.stringify(patientData),
      });

      console.log('API 回應狀態:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('創建患者成功:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed for createPatient:', error);
      return {
        success: false,
        data: null as unknown as ApiPatient,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getPatientById(id: string, lineUserId?: string): Promise<ApiResponse<ApiPatient>> {
    const activeLineUserId = lineUserId || getLineUserId();
    try {
      console.log('取得患者資料請求:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`,
        headers: API_CONFIG.getHeaders(activeLineUserId)
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`, {
        method: 'GET',
        headers: API_CONFIG.getHeaders(activeLineUserId),
      });

      console.log('取得患者資料 API 回應狀態:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('取得患者資料 API 錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('取得患者資料成功:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API request failed for getPatientById ${id}:`, error);
      return {
        success: false,
        data: null as unknown as ApiPatient,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updatePatient(id: string, patientData: PatientCreateData, lineUserId?: string): Promise<ApiResponse<ApiPatient>> {
    const activeLineUserId = lineUserId || getLineUserId();
    try {
      console.log('更新患者請求資料:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`,
        method: 'PATCH',
        headers: API_CONFIG.getHeaders(activeLineUserId),
        body: patientData
      });

      // 嘗試使用 PATCH 方法
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`, {
        method: 'PATCH',
        headers: API_CONFIG.getHeaders(activeLineUserId),
        body: JSON.stringify(patientData),
      });

      console.log('更新患者 API 回應狀態:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('更新患者 API 錯誤回應:', errorText);
        
        // 如果 PATCH 失敗，嘗試 PUT
        if (response.status === 404 || response.status === 405) {
          console.log('嘗試使用 PUT 方法...');
          const putResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`, {
            method: 'PUT',
            headers: API_CONFIG.getHeaders(activeLineUserId),
            body: JSON.stringify(patientData),
          });

          if (!putResponse.ok) {
            const putErrorText = await putResponse.text();
            console.error('PUT 方法也失敗:', putErrorText);
            throw new Error(`HTTP error! PATCH status: ${response.status}, PUT status: ${putResponse.status}`);
          }

          const putData = await putResponse.json();
          console.log('使用 PUT 方法更新患者成功:', putData);
          return {
            success: true,
            data: putData,
          };
        }

        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('使用 PATCH 方法更新患者成功:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API request failed for updatePatient ${id}:`, error);
      return {
        success: false,
        data: null as unknown as ApiPatient,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deletePatient(id: string, lineUserId?: string): Promise<ApiResponse<void>> {
    const activeLineUserId = lineUserId || getLineUserId();
    try {
      console.log('刪除患者請求:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`,
        headers: API_CONFIG.getHeaders(activeLineUserId)
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`, {
        method: 'DELETE',
        headers: API_CONFIG.getHeaders(activeLineUserId),
      });

      console.log('刪除患者 API 回應狀態:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('刪除患者 API 錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      console.log('刪除患者成功');
      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      console.error(`API request failed for deletePatient ${id}:`, error);
      return {
        success: false,
        data: undefined,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async searchPatientByIdNumber(idNumber: string, lineUserId?: string): Promise<ApiResponse<ApiPatient>> {
    const activeLineUserId = lineUserId || getLineUserId();
    const endpoint = `${API_CONFIG.ENDPOINTS.PATIENTS_BY_LINE}?idNumber=${encodeURIComponent(idNumber)}`;
    return this.request<ApiPatient>(endpoint, activeLineUserId);
  }

  // 第四步：建立預約掛號 API
  async createAppointment(appointmentData: { scheduleId: number; patientId: number; doctorId: number; clinicId: number }, lineUserId?: string): Promise<ApiResponse<any>> {
    try {
      const activeLineUserId = lineUserId || getLineUserId();
      console.log('建立預約請求資料:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS}`,
        headers: API_CONFIG.getHeaders(activeLineUserId),
        body: appointmentData
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS}`, {
        method: 'POST',
        headers: API_CONFIG.getHeaders(activeLineUserId),
        body: JSON.stringify(appointmentData),
      });

      console.log('建立預約回應狀態:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('建立預約錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('建立預約成功:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed for createAppointment:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // 預約管理 API

  // 第一步：依身分證字號查詢預約紀錄
  async searchAppointmentsByIdNumber(params: SearchAppointmentParams, lineUserId?: string): Promise<ApiResponse<ApiAppointmentsResponse>> {
    try {
      const activeLineUserId = lineUserId || getLineUserId();
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      queryParams.append('startDate', params.startDate);
      queryParams.append('endDate', params.endDate);

      const requestBody = {
        idNumber: params.idNumber
      };

      console.log('查詢預約請求資料:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS_SEARCH}?${queryParams.toString()}`,
        headers: API_CONFIG.getHeaders(activeLineUserId),
        body: requestBody
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS_SEARCH}?${queryParams.toString()}`, {
        method: 'POST',
        headers: API_CONFIG.getHeaders(activeLineUserId),
        body: JSON.stringify(requestBody),
      });

      console.log('查詢預約回應狀態:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('查詢預約錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('查詢預約成功:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed for searchAppointmentsByIdNumber:', error);
      return {
        success: false,
        data: null as unknown as ApiAppointmentsResponse,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // 第二步：修改預約
  async updateAppointment(appointmentId: string, updateData: UpdateAppointmentData, lineUserId?: string): Promise<ApiResponse<ApiAppointment>> {
    try {
      const activeLineUserId = lineUserId || getLineUserId();
      console.log('修改預約請求資料:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENT_BY_ID(appointmentId)}`,
        headers: API_CONFIG.getHeaders(activeLineUserId),
        body: updateData
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENT_BY_ID(appointmentId)}`, {
        method: 'PATCH',
        headers: API_CONFIG.getHeaders(activeLineUserId),
        body: JSON.stringify(updateData),
      });

      console.log('修改預約回應狀態:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('修改預約錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('修改預約成功:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed for updateAppointment:', error);
      return {
        success: false,
        data: null as unknown as ApiAppointment,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // 第三步：刪除預約
  async deleteAppointment(appointmentId: string, lineUserId?: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const activeLineUserId = lineUserId || getLineUserId();
      console.log('刪除預約請求:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENT_BY_ID(appointmentId)}`,
        headers: API_CONFIG.getHeaders(activeLineUserId)
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENT_BY_ID(appointmentId)}`, {
        method: 'DELETE',
        headers: API_CONFIG.getHeaders(activeLineUserId),
      });

      console.log('刪除預約回應狀態:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('刪除預約錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('刪除預約成功:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed for deleteAppointment:', error);
      return {
        success: false,
        data: null as unknown as { message: string },
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // 諮詢預約相關 API

  // 1. 建立預約諮詢
  async createConsultation(consultationData: CreateConsultationDto, lineUserId?: string, authToken?: string): Promise<ApiResponse<ConsultationResponseDto>> {
    try {
      const activeLineUserId = lineUserId || getLineUserId();
      console.log('建立諮詢請求資料:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONSULTATIONS}`,
        headers: API_CONFIG.getHeaders(activeLineUserId, authToken),
        body: consultationData
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONSULTATIONS}`, {
        method: 'POST',
        headers: API_CONFIG.getHeaders(activeLineUserId, authToken),
        body: JSON.stringify(consultationData),
      });

      console.log('建立諮詢回應狀態:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('建立諮詢錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('建立諮詢成功:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed for createConsultation:', error);
      return {
        success: false,
        data: null as unknown as ConsultationResponseDto,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // 2. 查詢指定 LINE 用戶的預約諮詢
  async getConsultationsByLine(params: ConsultationQueryParams = {}, lineUserId: string): Promise<ApiResponse<PaginatedConsultationResponseDto>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONSULTATIONS_BY_LINE}?${queryParams.toString()}`;

      console.log('查詢LINE用戶諮詢請求:', {
        url: url,
        headers: API_CONFIG.getHeaders(lineUserId)
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.getHeaders(lineUserId),
      });

      console.log('查詢LINE用戶諮詢回應狀態:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('查詢LINE用戶諮詢錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('查詢LINE用戶諮詢成功:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed for getConsultationsByLine:', error);
      return {
        success: false,
        data: null as unknown as PaginatedConsultationResponseDto,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // 3. 更新預約諮詢
  async updateConsultation(consultationId: string, updateData: UpdateConsultationDto, lineUserId?: string, authToken?: string): Promise<ApiResponse<ConsultationResponseDto>> {
    try {
      const activeLineUserId = lineUserId || getLineUserId();
      console.log('更新諮詢請求資料:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONSULTATION_BY_ID(consultationId)}`,
        headers: API_CONFIG.getHeaders(activeLineUserId, authToken),
        body: updateData
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONSULTATION_BY_ID(consultationId)}`, {
        method: 'PUT',
        headers: API_CONFIG.getHeaders(activeLineUserId, authToken),
        body: JSON.stringify(updateData),
      });

      console.log('更新諮詢回應狀態:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('更新諮詢錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('更新諮詢成功:', data);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed for updateConsultation:', error);
      return {
        success: false,
        data: null as unknown as ConsultationResponseDto,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // 4. 刪除預約諮詢
  async deleteConsultation(consultationId: string, lineUserId: string, authToken?: string): Promise<ApiResponse<void>> {
    try {
      const activeLineUserId = lineUserId || getLineUserId();
      console.log('刪除諮詢請求:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONSULTATION_BY_ID(consultationId)}`,
        headers: API_CONFIG.getHeaders(activeLineUserId, authToken)
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONSULTATION_BY_ID(consultationId)}`, {
        method: 'DELETE',
        headers: API_CONFIG.getHeaders(activeLineUserId, authToken),
      });

      console.log('刪除諮詢回應狀態:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('刪除諮詢錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      console.log('刪除諮詢成功');
      
      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      console.error('API request failed for deleteConsultation:', error);
      return {
        success: false,
        data: undefined,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const apiService = new ApiService(); 