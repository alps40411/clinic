# 診所預約系統專案結構說明

## 完整檔案列表

```
clinic/
├── src/
│   ├── components/
│   │   ├── BookingForm.tsx          # 預約表單組件
│   │   ├── ConsultationForm.tsx     # 看診紀錄表單
│   │   ├── ConsultationRecords.tsx  # 看診紀錄列表
│   │   ├── DateSelection.tsx        # 日期選擇組件
│   │   ├── DoctorSelection.tsx      # 醫師選擇組件
│   │   ├── PatientLookup.tsx        # 病患查詢組件
│   │   ├── PatientProfileForm.tsx   # 病患資料表單
│   │   ├── PatientProfileList.tsx   # 病患列表顯示
│   │   └── TimeSlotSelection.tsx    # 時段選擇組件
│   │
│   ├── data/
│   │   ├── consultationData.ts      # 看診紀錄模擬數據
│   │   ├── doctorData.ts            # 醫師資訊模擬數據
│   │   ├── mockData.ts              # 通用模擬數據
│   │   ├── patientData.ts           # 病患資料模擬數據
│   │   └── progressData.ts          # 看診進度模擬數據
│   │
│   ├── pages/
│   │   ├── AppointmentBooking.tsx   # 預約掛號頁面
│   │   ├── AppointmentLookup.tsx    # 預約查詢頁面
│   │   ├── ClinicInfo.tsx           # 診所資訊頁面
│   │   ├── ClinicProgress.tsx       # 看診進度頁面
│   │   ├── ConsultationPage.tsx     # 看診紀錄頁面
│   │   ├── Layout.tsx               # 整體頁面布局
│   │   ├── PatientProfile.tsx       # 病患資料管理頁面
│   │   └── routes.tsx               # 路由配置
│   │
│   ├── types/
│   │   ├── appointment.ts           # 預約相關類型定義
│   │   ├── consultation.ts          # 看診紀錄類型定義
│   │   ├── doctor.ts                # 醫師相關類型定義
│   │   ├── patient.ts               # 病患相關類型定義
│   │   └── progress.ts              # 看診進度類型定義
│   │
│   ├── utils/
│   │   └── dateUtils.ts             # 日期處理工具函數
│   │
│   ├── App.tsx                      # 應用程式主組件
│   ├── index.css                    # 全域樣式
│   ├── main.tsx                     # 應用程式入口點
│   └── vite-env.d.ts               # Vite 環境類型定義
│
├── eslint.config.js                 # ESLint 配置
├── index.html                       # HTML 模板
├── package-lock.json                # 依賴版本鎖定
├── package.json                     # 專案配置和依賴
├── postcss.config.js               # PostCSS 配置
├── PROJECT_STRUCTURE.md             # 專案結構說明文件
├── README.md                        # 專案說明文件
├── tailwind.config.js              # Tailwind CSS 配置
├── tsconfig.app.json               # TypeScript 應用配置
├── tsconfig.json                   # TypeScript 主配置
├── tsconfig.node.json              # TypeScript Node 配置
└── vite.config.ts                  # Vite 配置
```

## 核心功能模塊

### 1. 頁面組件 (pages/)

#### `Layout.tsx`
- 整體頁面布局
- 包含導航欄和頁面容器

#### `ClinicInfo.tsx`
- 診所基本資訊展示
- 營業時間顯示
- 醫師團隊介紹
- 服務項目列表

#### `ClinicProgress.tsx`
- 即時看診進度顯示
- 等候人數統計
- 預估等待時間計算
- 醫師狀態顯示（看診中/休息中/已結束）

#### `PatientProfile.tsx`
- 病患資料管理介面
- 支援新增/編輯/刪除操作
- 詳細資料顯示
- 緊急聯絡人設置

#### `AppointmentBooking.tsx`
- 預約掛號流程
- 醫師和時段選擇
- 預約表單填寫
- 預約確認功能

#### `AppointmentLookup.tsx`
- 預約記錄查詢
- 預約狀態顯示
- 取消預約功能

#### `ConsultationPage.tsx`
- 看診紀錄管理
- 歷史紀錄查詢
- 診斷結果顯示

### 2. 共用組件 (components/)

#### 預約相關組件
- `BookingForm.tsx`: 預約資訊填寫表單
- `DateSelection.tsx`: 日期選擇器組件
- `TimeSlotSelection.tsx`: 時段選擇器組件
- `DoctorSelection.tsx`: 醫師選擇器組件

#### 病患資料相關組件
- `PatientProfileForm.tsx`: 病患資料編輯表單
- `PatientProfileList.tsx`: 病患資料列表顯示
- `PatientLookup.tsx`: 病患資料查詢組件

#### 看診相關組件
- `ConsultationForm.tsx`: 看診紀錄填寫表單
- `ConsultationRecords.tsx`: 看診紀錄列表顯示

### 3. 模擬數據 (data/)

- `doctorData.ts`: 醫師和診所資訊
- `patientData.ts`: 病患基本資料
- `progressData.ts`: 看診進度資訊
- `consultationData.ts`: 看診紀錄資料
- `mockData.ts`: 其他模擬資料

### 4. 工具函數 (utils/)

- `dateUtils.ts`: 日期時間處理工具
