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
  },
  getHeaders: (lineUserId: string = LINE_USER_ID) => ({
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'x-line-id': lineUserId,
  }),
} as const; 