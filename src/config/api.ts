// 根據環境選擇不同的 API 基礎 URL
const getBaseUrl = () => {
  // 開發環境使用代理路徑，生產環境使用直接 URL
  if (import.meta.env.DEV) {
    return '/api'; // 通過 Vite 代理
  }
  return 'http://tw1.openvpns.org:30001'; // 生產環境直接訪問
};

// LINE User ID (可從環境變數或其他地方獲取)
export const LINE_USER_ID = 'U66bfb7dabdef424cd78c29bd352fc4cb';

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    DOCTORS: '/doctors',
    DOCTOR_BY_ID: (id: string) => `/doctors/${id}`,
    SCHEDULES: '/schedules',
    PATIENTS: '/patients',
    PATIENTS_BY_LINE: '/patients/line',
    PATIENT_BY_ID: (id: string) => `/patients/${id}`,
    APPOINTMENTS: '/appointments',
    APPOINTMENTS_SEARCH: '/appointments/patient/search',
    APPOINTMENT_BY_ID: (id: string) => `/appointments/${id}`,
    // 諮詢預約相關端點
    CONSULTATIONS: '/consultations',
    CONSULTATIONS_BY_LINE: '/consultations/line',
    CONSULTATION_BY_ID: (id: string) => `/consultations/${id}`,
  },
  getHeaders: (lineUserId: string = LINE_USER_ID, authToken?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'x-line-id': lineUserId,
    };
    
    // 如果提供了 JWT token，添加 Authorization 標頭
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return headers;
  },
} as const; 