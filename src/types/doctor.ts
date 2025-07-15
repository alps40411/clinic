// 新的診所 API 回應類型
export interface ClinicApiResponse {
  title: string;
  subtitle: string;
  office_information: {
    address: {
      zh: string;
      en: string;
    };
    phone: string;
    office_hours: {
      morning: string;
      afternoon: string;
      evening: string;
      note: {
        zh: string;
        en: string;
      };
    };
    services: {
      description: {
        zh: string;
        en: string;
      };
    };
  };
  doctors: {
    name: {
      zh: string;
      en: string;
    };
    description: {
      zh: string;
      en: string;
    };
    credentials: string[];
  }[];
}

// 更新後的醫生資訊類型
export interface DoctorInfo {
  id: string;
  name: string;
  description: string;
  credentials: string[];
  // 保留向後相容性的欄位
  title?: string;
  specialty?: string[];
  education?: string[];
  certifications?: string[];
  expertise?: string[];
  schedule?: {
    [key: string]: string[];
  };
  introduction?: string;
}

// 更新後的診所資訊類型
export interface ClinicInfo {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  officeHours: {
    morning: string;
    afternoon: string;
    evening: string;
    note: string;
  };
  services: string;
  // 保留向後相容性的欄位
  name?: string;
  description?: string;
  email?: string;
  hours?: {
    [key: string]: string;
  };
}