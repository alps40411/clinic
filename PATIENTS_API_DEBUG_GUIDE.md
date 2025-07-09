# 患者 API 調試指南

## 問題症狀
- 錯誤訊息：`{"message":"Cannot PUT /patients/1","error":"Not Found","statusCode":404}`
- 其他 GET 請求也沒有正常接上

## 可能原因分析

### 1. API 端點路徑問題
- 當前使用路徑：`/patients/{id}`
- 可能的正確路徑：
  - `/patient/{id}` (單數形式)
  - `/api/patients/{id}` (需要 /api 前綴)
  - `/v1/patients/{id}` (需要版本號)

### 2. HTTP 方法問題
- 當前使用：PUT
- API 可能只支援：PATCH 或 POST

### 3. Swagger 文檔檢查
請手動訪問以下 URL 確認實際的 API 端點：
- 開發環境：http://localhost:5173/api-test
- Swagger 文檔：http://tw1.openvpns.org:30001/apidoc

## 修正措施

### 1. 已實施的改進
- ✅ 更新方法從 PUT 改為 PATCH，並在失敗時自動重試 PUT
- ✅ 添加詳細的調試日誌
- ✅ 改進錯誤處理，顯示更多錯誤細節
- ✅ 創建 API 測試工具頁面

### 2. 調試步驟

#### 步驟 1：檢查瀏覽器控制台
1. 打開瀏覽器開發者工具 (F12)
2. 進入 Console 標籤
3. 嘗試執行患者相關操作
4. 查看詳細的 API 請求和回應日誌

#### 步驟 2：使用 API 測試工具
1. 啟動開發伺服器：`npm run dev`
2. 在瀏覽器中訪問：http://localhost:5173/api-test
3. 點擊「開始測試」按鈕
4. 檢查所有端點的回應狀態

#### 步驟 3：手動 API 測試
在瀏覽器控制台中執行以下測試：

```javascript
// 測試 GET /patients
fetch('/api/patients', {
  headers: {
    'Content-Type': 'application/json',
    'x-line-id': 'U66bfb7dabdef424cd78c29bd352fc4cb'
  }
}).then(r => r.json()).then(console.log);

// 測試 POST /patients
fetch('/api/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-line-id': 'U66bfb7dabdef424cd78c29bd352fc4cb'
  },
  body: JSON.stringify({
    name: '測試患者',
    idNumber: 'A123456789',
    phone: '0912345678',
    email: 'test@example.com',
    birthDate: '1990-01-01',
    address: '台北市信義區',
    emergencyContact: '緊急聯絡人',
    emergencyPhone: '0987654321'
  })
}).then(r => r.json()).then(console.log);
```

### 3. 常見端點格式變體測試

#### 如果當前端點不正確，嘗試以下變體：

```javascript
// 測試不同的端點格式
const testEndpoints = [
  '/patients',     // 當前使用
  '/patient',      // 單數形式
  '/api/patients', // 帶 API 前綴
  '/v1/patients',  // 帶版本號
];

for (const endpoint of testEndpoints) {
  fetch(endpoint, {
    headers: {
      'x-line-id': 'U66bfb7dabdef424cd78c29bd352fc4cb'
    }
  }).then(r => {
    console.log(`${endpoint}: ${r.status}`);
    return r.text();
  }).then(text => {
    console.log(`${endpoint} response:`, text.substring(0, 200));
  }).catch(e => {
    console.log(`${endpoint} error:`, e.message);
  });
}
```

## 預期結果

### 成功的 API 回應應該包含：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "患者姓名",
    "idNumber": "A123456789",
    // ... 其他患者資料
  }
}
```

### 如果 API 結構不同，可能需要調整：
1. 更新 `src/config/api.ts` 中的端點路徑
2. 修改 `src/services/apiService.ts` 中的請求格式
3. 調整 `src/utils/patientUtils.ts` 中的資料轉換邏輯

## 下一步行動

1. **立即檢查**：在瀏覽器控制台查看詳細錯誤信息
2. **測試工具**：使用 /api-test 頁面確認可用的端點
3. **Swagger 文檔**：查看 http://tw1.openvpns.org:30001/apidoc 確認正確的 API 格式
4. **聯繫後端**：如果所有端點都返回 404，可能需要確認後端 API 服務是否正常運行

## 聯繫資訊
如果問題持續存在，請提供：
1. 瀏覽器控制台的完整錯誤日誌
2. API 測試工具的結果截圖
3. Swagger 文檔中實際可用的患者相關端點列表 