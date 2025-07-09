import { API_CONFIG, LINE_USER_ID } from '../config/api';

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
  date: string;
  timeSlot: string;
  currentAppointments: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  doctor: ApiDoctor;
  clinic: {
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
}

export interface ApiPatient {
  id: number;
  name: string;
  idNumber: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
  name: string;
  idNumber: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

export interface PatientUpdateData extends PatientCreateData {
  id: number;
}

class ApiService {
  private async request<T>(endpoint: string, lineUserId: string = LINE_USER_ID): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: API_CONFIG.getHeaders(lineUserId),
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
    return this.request<ApiDoctorsResponse>(API_CONFIG.ENDPOINTS.DOCTORS, lineUserId);
  }

  async getDoctorById(id: string, lineUserId?: string): Promise<ApiResponse<ApiDoctor>> {
    return this.request<ApiDoctor>(API_CONFIG.ENDPOINTS.DOCTOR_BY_ID(id), lineUserId);
  }

  async getSchedules(params: ScheduleParams = {}, lineUserId?: string): Promise<ApiResponse<ApiSchedulesResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const endpoint = `${API_CONFIG.ENDPOINTS.SCHEDULES}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request<ApiSchedulesResponse>(endpoint, lineUserId);
  }

  // Patient API methods
  async createPatient(patientData: PatientCreateData, lineUserId?: string): Promise<ApiResponse<ApiPatient>> {
    try {
      console.log('創建患者請求資料:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}`,
        headers: API_CONFIG.getHeaders(lineUserId),
        body: patientData
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}`, {
        method: 'POST',
        headers: API_CONFIG.getHeaders(lineUserId),
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
    try {
      console.log('取得患者資料請求:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`,
        headers: API_CONFIG.getHeaders(lineUserId)
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`, {
        method: 'GET',
        headers: API_CONFIG.getHeaders(lineUserId),
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
    try {
      console.log('更新患者請求資料:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`,
        method: 'PATCH',
        headers: API_CONFIG.getHeaders(lineUserId),
        body: patientData
      });

      // 嘗試使用 PATCH 方法
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`, {
        method: 'PATCH',
        headers: API_CONFIG.getHeaders(lineUserId),
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
            headers: API_CONFIG.getHeaders(lineUserId),
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
    try {
      console.log('刪除患者請求:', {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`,
        headers: API_CONFIG.getHeaders(lineUserId)
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENT_BY_ID(id)}`, {
        method: 'DELETE',
        headers: API_CONFIG.getHeaders(lineUserId),
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
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('idNumber', idNumber);
      
      const endpoint = `${API_CONFIG.ENDPOINTS.PATIENTS}?${queryParams.toString()}`;
      
      console.log('根據身分證字號搜尋患者請求:', {
        url: `${API_CONFIG.BASE_URL}${endpoint}`,
        headers: API_CONFIG.getHeaders(lineUserId)
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: API_CONFIG.getHeaders(lineUserId),
      });

      console.log('搜尋患者 API 回應狀態:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('搜尋患者 API 錯誤回應:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('搜尋患者 API 回應資料:', data);
      
      // 假設 API 返回患者陣列，我們取第一個匹配的
      if (data.data && data.data.length > 0) {
        console.log('找到患者資料:', data.data[0]);
        return {
          success: true,
          data: data.data[0],
        };
      } else {
        console.log('未找到匹配的患者資料');
        return {
          success: false,
          data: null as unknown as ApiPatient,
          message: '找不到該身分證字號的患者資料',
        };
      }
    } catch (error) {
      console.error(`API request failed for searchPatientByIdNumber ${idNumber}:`, error);
      return {
        success: false,
        data: null as unknown as ApiPatient,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const apiService = new ApiService(); 