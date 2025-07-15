# 診所管理系統

基於 React + TypeScript + Vite 構建的現代化診所管理系統，整合 LINE LIFF 功能，提供完整的患者管理、門診預約和諮詢服務。

## 功能特色

- 🏥 **診所資訊管理** - 醫師介紹、看診進度查詢
- 👤 **患者資料管理** - 個人資料維護、病歷管理
- 📅 **門診預約系統** - 線上預約、預約查詢與管理
- 💬 **諮詢服務** - 線上諮詢申請與記錄管理
- 📱 **LINE 整合** - 完整的 LIFF 支援，真實 LINE 用戶身份驗證
- 🔄 **API 整合** - 完整的後端 API 串接與錯誤處理

## 技術架構

- **前端框架**: React 18 + TypeScript
- **構建工具**: Vite
- **樣式**: Tailwind CSS
- **圖標**: Lucide React
- **LINE 整合**: LIFF (LINE Front-end Framework)
- **API 通信**: Fetch API with TypeScript
- **狀態管理**: React Hooks + Context

## 快速開始

### 1. 環境要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器

### 2. 安裝依賴

```bash
# 克隆專案
git clone <repository-url>
cd clinic

# 安裝依賴
npm install
```

### 3. 環境設定

複製環境變數範例文件並根據需要進行配置：

```bash
cp .env.example .env
```

編輯 `.env` 文件設定必要的環境變數：

```bash
# 開發環境設定 (建議)
VITE_LIFF_MOCK=true
VITE_MOCK_USER_ID=your_test_user_id

# 生產環境設定
VITE_LIFF_MOCK=false
# VITE_MOCK_USER_ID 在生產環境中不需要設定
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

訪問 http://localhost:5173 開始使用系統。

### 5. 構建生產版本

```bash
npm run build
```

## 環境變數說明

| 變數名稱                     | 必需 | 說明                         | 預設值                          |
| ---------------------------- | ---- | ---------------------------- | ------------------------------- |
| `VITE_LIFF_MOCK`             | 否   | 是否啟用 LIFF Mock 模式      | `true` (開發環境)               |
| `VITE_MOCK_USER_ID`          | 條件 | Mock 模式下使用的測試用戶 ID | -                               |
| `VITE_LIFF_PROFILE_URL`      | 否   | 看診資訊設定頁面的 LIFF URL  | 預設值已設定                    |
| `VITE_LIFF_CLINIC_URL`       | 否   | 診所資訊頁面的 LIFF URL      | 預設值已設定                    |
| `VITE_LIFF_CONSULTATION_URL` | 否   | 客戶諮詢頁面的 LIFF URL      | 預設值已設定                    |
| `VITE_LIFF_PROGRESS_URL`     | 否   | 看診進度頁面的 LIFF URL      | 預設值已設定                    |
| `VITE_LIFF_LOOKUP_URL`       | 否   | 查詢預約頁面的 LIFF URL      | 預設值已設定                    |
| `VITE_LIFF_APPOINTMENT_URL`  | 否   | 門診預約頁面的 LIFF URL      | 預設值已設定                    |
| `VITE_API_BASE_URL`          | 否   | 後端 API 的基礎 URL          | `http://tw1.openvpns.org:30001` |

### 環境模式說明

#### 開發環境 (Development)

- 建議設定 `VITE_LIFF_MOCK=true` 以便在瀏覽器中直接測試
- 必須設定 `VITE_MOCK_USER_ID` 作為測試用戶 ID
- 支援熱重載和開發者工具

#### 生產環境 (Production)

- 設定 `VITE_LIFF_MOCK=false` 使用真實的 LIFF 功能
- 應用程式必須在 LINE 環境中開啟
- 自動使用真實的 LINE 用戶 ID

## 專案結構

```
src/
├── components/           # React 組件
│   ├── consultation/    # 諮詢相關組件
│   ├── patient/        # 患者管理組件
│   ├── appointment/    # 預約相關組件
│   └── clinic/         # 診所資訊組件
├── config/             # 配置文件
│   └── api.ts         # API 配置和 LIFF 設定
├── data/              # 靜態資料和 Mock 資料
├── hooks/             # 自定義 React Hooks
├── pages/             # 頁面組件
├── services/          # API 服務層
│   ├── apiService.ts  # 主要 API 服務
│   └── liffService.ts # LIFF 整合服務
├── types/             # TypeScript 型別定義
└── utils/             # 工具函數
```

## LIFF 整合說明

本系統完整整合 LINE Front-end Framework，每個功能頁面都有對應的 LIFF 應用程式：

- **看診資訊設定** (`/profile`): `2007708469-eLWvyxRp`
- **診所資訊** (`/clinic`): `2007708469-By8prg6X`
- **客戶諮詢** (`/consultation`): `2007708469-R8G1qd2W`
- **看診進度** (`/progress`): `2007708469-nylK60O4`
- **查詢預約** (`/lookup`): `2007708469-BENy2nkL`
- **門診預約** (`/appointment`): `2007708469-KvonrYMx`

### LIFF 測試

訪問 `/liff-test` 頁面可以檢查 LIFF 整合狀態和用戶身份驗證。

## API 串接

系統已完整串接診所後端 API：

- **基礎 URL**: `http://tw1.openvpns.org:30001`
- **認證方式**: 使用 `x-line-id` header 進行身份驗證
- **支援功能**: 醫師管理、患者管理、預約系統、諮詢服務

### 開發環境 API 代理

開發環境通過 Vite 代理處理 CORS 問題：

- 本地請求: `/api/*` → `http://tw1.openvpns.org:30001/*`
- 自動添加必要的 CORS 標頭

## 開發指南

### 添加新功能

1. 在 `src/types/` 中定義 TypeScript 介面
2. 在 `src/services/apiService.ts` 中添加 API 方法
3. 創建對應的 React Hook 在 `src/hooks/`
4. 開發 UI 組件在 `src/components/`
5. 添加路由到主應用程式

### 除錯技巧

1. 檢查瀏覽器開發者工具的 Console 和 Network 標籤
2. 使用 `/liff-test` 頁面檢查 LIFF 狀態
3. 確認環境變數設定正確
4. 查看詳細的 API 請求日誌

## 部署說明

### 生產環境部署

1. 設定正確的環境變數 (`VITE_LIFF_MOCK=false`)
2. 構建生產版本: `npm run build`
3. 將 `dist/` 目錄部署到 HTTPS 伺服器
4. 在 LINE Developers Console 設定 LIFF Endpoint URL

### 注意事項

- 生產環境必須使用 HTTPS
- 確保 LIFF 應用程式的 Endpoint URL 正確設定
- 測試所有功能在 LINE 環境中正常運作

## 相關文檔

- [API 串接說明](./README_API_INTEGRATION.md)
- [患者 API 整合](./README_PATIENTS_API_INTEGRATION.md)
- [LIFF 整合指南](./LIFF_INTEGRATION_GUIDE.md)
- [專案結構說明](./PROJECT_STRUCTURE.md)
- [患者 API 調試指南](./PATIENTS_API_DEBUG_GUIDE.md)

## 授權

[在此處添加授權資訊]

## 貢獻

[在此處添加貢獻指南]
