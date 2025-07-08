clinic


## 技術

- React 18 + TypeScript 5
- Tailwind CSS 3 用於樣式設計
- Lucide React 用於圖標
- Vite 5 作為建構工具

## 特色功能

1. **響應式設計**
   - 適配桌面和移動設備
   - 流暢的使用者體驗
   - 優化的介面布局

2. **即時進度顯示**
   - 看診進度實時更新
   - 智能等候時間預估
   - 醫師狀態即時顯示

3. **完整的病患資料管理**
   - 詳細的病患資訊記錄
   - 緊急聯絡人設置
   - 病史和過敏記錄管理

4. **預約管理系統**
   - 靈活的時段選擇
   - 多醫師排班顯示
   - 預約確認和提醒機制

## 開發指南

### 環境變數設置

1. **複製環境變數範例檔案**
   ```bash
   cp env.example .env
   ```

2. **設定環境變數**
   在 `.env` 文件中設置以下變數：
   ```bash
   # LIFF 設定
   VITE_LIFF_ID=         # 從 LINE Developers Console 獲取的 LIFF ID
   
   # API 設定
   VITE_API_BASE_URL=    # API 伺服器地址，開發環境預設為 http://localhost:3000/api
   
   # 環境設定
   VITE_ENV=            # development 或 production
   ```

   > 注意：請勿將包含實際值的 `.env` 文件提交到版本控制中

### 安裝與啟動

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **啟動開發服務器**
   ```bash
   npm run dev
   ```

3. **建構生產版本**
   ```bash
   npm run build
   ```

### LIFF 設定說明

1. **取得 LIFF ID**
   - 登入 [LINE Developers Console](https://developers.line.biz/console/)
   - 選擇或創建一個 Provider
   - 創建一個新的 LIFF 應用程式
   - 複製生成的 LIFF ID

2. **LIFF 權限設置**
   - 在 LINE Developers Console 中設置 LIFF 的 Endpoint URL
   - 確認必要的 LIFF 功能已啟用：
     - scanCode
     - openWindow
     - closeWindow