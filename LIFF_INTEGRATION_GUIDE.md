# LIFF 整合指南

## 概述

本系統已經整合 LINE Front-end Framework (LIFF) 來取得真實的 LINE 使用者 ID，每個分頁都有對應的 LIFF 應用程式。

## 分頁對應的 LIFF ID

- `/profile` - 看診資訊設定: `2007708469-eLWvyxRp`
- `/clinic` - 診所資訊: `2007708469-By8prg6X`
- `/consultation` - 客戶諮詢: `2007708469-R8G1qd2W`
- `/progress` - 看診進度: `2007708469-nylK60O4`
- `/lookup` - 查詢預約: `2007708469-BENy2nkL`
- `/appointment` - 門診預約: `2007708469-KvonrYMx`

## 功能特點

1. **動態 LIFF 初始化**：根據當前路由自動載入對應的 LIFF 應用程式
2. **真實 LINE User ID**：自動取得並使用真實的 LINE 使用者 ID 進行 API 請求
3. **路由切換支援**：當使用者切換分頁時，自動重新初始化對應的 LIFF
4. **錯誤處理**：提供完整的錯誤處理和使用者友善的錯誤訊息
5. **Mock 模式**：開發環境支援 Mock 模式進行測試

## 使用方式

### 1. 環境變數設定

複製 `.env.example` 為 `.env` 並設定：

```bash
# 生產環境（使用真實 LIFF）
VITE_LIFF_MOCK=false

# 開發環境（使用 Mock 模式）
VITE_LIFF_MOCK=true
VITE_MOCK_USER_ID=your_test_user_id
```

### 2. 部署到 LINE LIFF

1. 將建置後的應用程式部署到 HTTPS 伺服器
2. 在 LINE Developers Console 中設定每個 LIFF 應用程式的 Endpoint URL
3. 確保每個分頁的 URL 指向正確的路由

### 3. 測試

使用 `/liff-test` 頁面來測試 LIFF 整合狀況：
- 檢查 LIFF 初始化狀態
- 驗證 LINE User ID 取得
- 測試 API 請求是否包含正確的標頭

## 技術實作

### LIFF 服務架構

```typescript
// 自動根據路由初始化對應的 LIFF
const liffId = getLiffIdForCurrentRoute();
await liffService.init({ liffId });

// 取得真實的 LINE User ID
const userId = liffService.getUserId();
```

### API 請求整合

所有 API 請求會自動包含真實的 LINE User ID：

```typescript
// 自動使用真實的 LINE User ID
const headers = {
  'Content-Type': 'application/json',
  'x-line-id': getLineUserId(), // 真實的 LINE User ID
};
```

## 除錯指南

1. **檢查瀏覽器控制台**：查看 LIFF 初始化日誌
2. **確認網路請求**：檢查 API 請求是否包含正確的 `x-line-id` 標頭
3. **驗證 LIFF 設定**：確認 LINE Developers Console 中的設定正確
4. **測試登入狀態**：確保使用者已登入 LINE

## 注意事項

- LIFF 應用程式必須在 LINE 環境中開啟才能取得真實的使用者 ID
- 開發環境可使用 Mock 模式進行測試
- 每個分頁對應不同的 LIFF ID，確保功能隔離
- 路由切換時會自動重新初始化對應的 LIFF 應用程式 