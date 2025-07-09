import { API_CONFIG } from '../config/api';

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

class ApiService {
  private async request<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 詳細記錄 API 回應以便除錯
      console.log(`API Response for ${endpoint}:`, {
        status: response.status,
        data: data,
        dataType: typeof data,
        isArray: Array.isArray(data)
      });
      
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

  async getDoctors(): Promise<ApiResponse<ApiDoctorsResponse>> {
    return this.request<ApiDoctorsResponse>(API_CONFIG.ENDPOINTS.DOCTORS);
  }

  async getDoctorById(id: string): Promise<ApiResponse<ApiDoctor>> {
    return this.request<ApiDoctor>(API_CONFIG.ENDPOINTS.DOCTOR_BY_ID(id));
  }
}

export const apiService = new ApiService(); 