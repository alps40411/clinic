# 診所門診預約系統 - 完整目錄架構

```
clinic-appointment-system/
├── public/
│   ├── vite.svg
│   └── favicon.ico
│
├── src/
│   ├── components/                    # React 組件目錄
│   │   ├── appointment/              # 門診預約相關組件
│   │   │   ├── DoctorSelection.tsx
│   │   │   ├── DateSelection.tsx
│   │   │   ├── TimeSlotSelection.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   └── PatientLookup.tsx
│   │   │
│   │   ├── consultation/             # 客戶諮詢相關組件
│   │   │   ├── ConsultationForm.tsx
│   │   │   └── ConsultationRecords.tsx
│   │   │
│   │   ├── patient/                  # 病患資料管理組件
│   │   │   ├── PatientProfileManager.tsx
│   │   │   ├── PatientProfileList.tsx
│   │   │   └── PatientProfileForm.tsx
│   │   │
│   │   ├── clinic/                   # 診所資訊相關組件
│   │   │   └── ClinicInfoDisplay.tsx
│   │   │
│   │   └── common/                   # 共用組件
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Loading.tsx
│   │       ├── Modal.tsx
│   │       └── Dropdown.tsx
│   │
│   ├── data/                         # 靜態數據和模擬數據
│   │   ├── mockData.ts              # 預約系統模擬數據
│   │   ├── consultationData.ts      # 諮詢系統數據
│   │   ├── patientData.ts           # 病患資料數據
│   │   └── doctorData.ts            # 醫師和診所資訊
│   │
│   ├── types/                        # TypeScript 類型定義
│   │   ├── appointment.ts           # 預約相關類型
│   │   ├── consultation.ts          # 諮詢相關類型
│   │   ├── patient.ts               # 病患資料類型
│   │   ├── doctor.ts                # 醫師資訊類型
│   │   └── common.ts                # 共用類型
│   │
│   ├── utils/                        # 工具函數
│   │   ├── dateUtils.ts             # 日期處理工具
│   │   ├── validation.ts            # 表單驗證工具
│   │   ├── formatters.ts            # 格式化工具
│   │   └── constants.ts             # 常數定義
│   │
│   ├── hooks/                        # 自定義 React Hooks
│   │   ├── useLocalStorage.ts       # 本地儲存 Hook
│   │   ├── useForm.ts               # 表單處理 Hook
│   │   └── useApi.ts                # API 呼叫 Hook
│   │
│   ├── services/                     # API 服務層
│   │   ├── appointmentService.ts    # 預約相關 API
│   │   ├── consultationService.ts   # 諮詢相關 API
│   │   ├── patientService.ts        # 病患資料 API
│   │   └── clinicService.ts         # 診所資訊 API
│   │
│   ├── styles/                       # 樣式檔案
│   │   ├── globals.css              # 全域樣式
│   │   ├── components.css           # 組件樣式
│   │   └── utilities.css            # 工具樣式
│   │
│   ├── assets/                       # 靜態資源
│   │   ├── images/                  # 圖片資源
│   │   │   ├── logo.svg
│   │   │   ├── clinic-banner.jpg
│   │   │   └── doctors/             # 醫師照片
│   │   │       ├── doctor-1.jpg
│   │   │       ├── doctor-2.jpg
│   │   │       └── doctor-3.jpg
│   │   │
│   │   └── icons/                   # 圖示資源
│   │       ├── appointment.svg
│   │       ├── consultation.svg
│   │       └── profile.svg
│   │
│   ├── pages/                        # 頁面組件（如果使用路由）
│   │   ├── AppointmentPage.tsx      # 門診預約頁面
│   │   ├── ConsultationPage.tsx     # 客戶諮詢頁面
│   │   ├── PatientProfilePage.tsx   # 看診資訊設定頁面
│   │   ├── ClinicInfoPage.tsx       # 診所資訊頁面
│   │   └── HomePage.tsx             # 首頁
│   │
│   ├── context/                      # React Context
│   │   ├── AppContext.tsx           # 應用程式全域狀態
│   │   ├── AuthContext.tsx          # 認證狀態
│   │   └── ThemeContext.tsx         # 主題設定
│   │
│   ├── App.tsx                       # 主應用組件
│   ├── main.tsx                      # 應用入口點
│   ├── index.css                     # 主要樣式檔案
│   └── vite-env.d.ts                # Vite 環境類型定義
│
├── tests/                            # 測試檔案
│   ├── components/                   # 組件測試
│   │   ├── appointment/
│   │   ├── consultation/
│   │   ├── patient/
│   │   └── clinic/
│   │
│   ├── utils/                        # 工具函數測試
│   │   ├── dateUtils.test.ts
│   │   └── validation.test.ts
│   │
│   └── setup.ts                      # 測試設定
│
├── docs/                             # 文檔
│   ├── README.md                     # 專案說明
│   ├── API.md                        # API 文檔
│   ├── DEPLOYMENT.md                 # 部署說明
│   └── CHANGELOG.md                  # 更新日誌
│
├── .env                              # 環境變數
├── .env.example                      # 環境變數範例
├── .gitignore                        # Git 忽略檔案
├── package.json                      # 專案依賴和腳本
├── package-lock.json                 # 依賴版本鎖定
├── tsconfig.json                     # TypeScript 設定
├── tsconfig.app.json                 # 應用 TypeScript 設定
├── tsconfig.node.json                # Node.js TypeScript 設定
├── vite.config.ts                    # Vite 設定
├── tailwind.config.js                # Tailwind CSS 設定
├── postcss.config.js                 # PostCSS 設定
├── eslint.config.js                  # ESLint 設定
├── index.html                        # HTML 模板
└── PROJECT_STRUCTURE.md              # 本檔案 - 專案架構說明
```

## 📁 **目錄說明**

### **src/components/** - 組件目錄
- **appointment/** - 門診預約功能組件
- **consultation/** - 客戶諮詢功能組件  
- **patient/** - 病患資料管理組件
- **clinic/** - 診所資訊展示組件
- **common/** - 共用組件（Header, Footer, Modal 等）

### **src/data/** - 數據層
- 包含所有靜態數據和模擬數據
- 分類存放不同功能模組的數據

### **src/types/** - 類型定義
- TypeScript 介面和類型定義
- 確保類型安全和代碼可維護性

### **src/utils/** - 工具函數
- 日期處理、表單驗證、格式化等工具
- 可重用的純函數

### **src/hooks/** - 自定義 Hooks
- 封裝常用邏輯的 React Hooks
- 提高代碼重用性

### **src/services/** - 服務層
- API 呼叫和數據處理邏輯
- 與後端服務的介面層

### **src/pages/** - 頁面組件
- 頂層頁面組件（如果使用路由系統）
- 組合多個組件形成完整頁面

## 🔧 **設定檔案**

### **開發工具設定**
- `vite.config.ts` - Vite 建構工具設定
- `tsconfig.json` - TypeScript 編譯設定
- `tailwind.config.js` - Tailwind CSS 設定
- `eslint.config.js` - 代碼品質檢查設定

### **專案設定**
- `package.json` - 依賴管理和腳本定義
- `.env` - 環境變數設定
- `.gitignore` - Git 版本控制忽略檔案

## 📋 **檔案命名規範**

### **組件檔案**
- 使用 PascalCase：`DoctorSelection.tsx`
- 功能描述清晰：`PatientProfileForm.tsx`

### **工具檔案**
- 使用 camelCase：`dateUtils.ts`
- 功能分類明確：`validation.ts`

### **類型檔案**
- 使用 camelCase：`appointment.ts`
- 對應功能模組：`consultation.ts`

這個架構提供了清晰的分層結構，便於開發、維護和擴展！