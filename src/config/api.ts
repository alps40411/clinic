import liffService from '../services/liffService';

// 根據環境選擇不同的 API 基礎 URL
const getBaseUrl = () => {
  // 開發環境使用代理路徑，生產環境使用直接 URL
  if (import.meta.env.DEV) {
    return '/api'; // 通過 Vite 代理
  }
  return 'http://tw1.openvpns.org:30001'; // 生產環境直接訪問
};

// 動態獲取 LINE User ID 的函數
export const getLineUserId = (): string => {
  const isMockMode = import.meta.env.VITE_LIFF_MOCK === 'true';
  
  if (isMockMode) {
    // Mock 模式：從環境變數獲取 mock user id
    const envUserId = import.meta.env.VITE_MOCK_USER_ID;
    if (!envUserId) {
      console.warn('VITE_MOCK_USER_ID not found in environment variables');
      throw new Error('VITE_MOCK_USER_ID not found in environment variables');
    }
    return envUserId;
  } else {
    // 非 Mock 模式：從 liff 服務獲取真實 user id
    const userId = liffService.getUserId();
    if (!userId) {
      console.warn('LINE User ID not available from LIFF service, please ensure LIFF is properly initialized');
      throw new Error('LINE User ID not available from LIFF service');
    }
    return userId;
  }
};

// 每個分頁對應的LIFF ID配置
export const LIFF_IDS = {
  '/profile': '2007708469-eLWvyxRp',
  '/clinic': '2007708469-By8prg6X',
  '/consultation': '2007708469-R8G1qd2W',
  '/progress': '2007708469-nylK60O4',
  '/lookup': '2007708469-BENy2nkL',
  '/appointment': '2007708469-KvonrYMx'
} as const;

// 根據當前路由獲取對應的LIFF ID
export const getLiffIdForCurrentRoute = (): string => {
  const pathname = window.location.pathname;
  const liffId = LIFF_IDS[pathname as keyof typeof LIFF_IDS];
  
  if (!liffId) {
    console.warn(`No LIFF ID configured for route: ${pathname}, using default`);
    // 如果沒有對應的LIFF ID，使用預約頁面的LIFF ID作為預設
    return LIFF_IDS['/appointment'];
  }
  
  return liffId;
};

// LIFF 配置
export const LIFF_CONFIG = {
  liffId: getLiffIdForCurrentRoute(),
  mock: import.meta.env.DEV && import.meta.env.VITE_LIFF_MOCK === 'true',
  mockUserId: import.meta.env.VITE_MOCK_USER_ID,
};

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
  getHeaders: (lineUserId: string, authToken?: string) => {
    // 使用傳入的 lineUserId，如果沒有就動態獲取
    const userId = lineUserId || getLineUserId();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'x-line-id': userId,
    };
    
    // 如果提供了 JWT token，添加 Authorization 標頭
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return headers;
  },
} as const; 