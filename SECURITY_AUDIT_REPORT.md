# 安全審核報告 - 假資料汙染與資料洩露風險

## 🔍 審核日期
2024-12-20

## 🚨 發現的問題

### 1. **關鍵安全問題**: API端點使用錯誤 (已修正)
**問題**: `src/services/apiService.ts` 中的 `getPatients` 方法使用了錯誤的API端點
- **錯誤**: `API_CONFIG.ENDPOINTS.PATIENTS` (`/patients`) - 獲取所有患者資料
- **正確**: `API_CONFIG.ENDPOINTS.PATIENTS_BY_LINE` (`/patients/line`) - 根據LINE ID獲取患者資料
- **風險**: 極高！用戶可能看到所有患者的資料，嚴重的資料洩露風險

**修正措施**:
```typescript
// 修正前
return this.request<ApiPatientsResponse>(API_CONFIG.ENDPOINTS.PATIENTS, activeLineUserId);

// 修正後  
return this.request<ApiPatientsResponse>(API_CONFIG.ENDPOINTS.PATIENTS_BY_LINE, activeLineUserId);
```

### 2. 醫師資料假資料汙染 (已修正)
**問題**: `src/hooks/useDoctors.ts` 在API失敗時會回退到假資料
- 初始狀態設定為假資料: `useState<Doctor[]>(mockDoctors)`
- API失敗時顯示假醫師: `setDoctorsState(mockDoctors)`
- **風險**: 用戶可能預約到不存在的醫師

**修正措施**:
- 移除假資料導入
- 初始狀態改為空陣列: `useState<Doctor[]>([])`
- API失敗時保持空陣列，不回退假資料

### 3. 諮詢記錄假資料回退 (已修正)
**問題**: `src/components/ConsultationRecords.tsx` 在API失敗時顯示假資料
- `setRecords(mockConsultationRecords.slice(0, 3))`
- **風險**: 用戶可能看到不屬於自己的諮詢記錄

**修正措施**:
- 移除假資料回退邏輯
- API失敗時顯示適當錯誤訊息
- 只顯示真實API資料

### 4. 不必要的假資料導入 (已修正)
**問題**: `src/hooks/usePatients.ts` 導入但未使用假資料
- `import { mockPatientProfiles } from '../data/patientData'`
- **風險**: 潛在的資料洩露風險

**修正措施**:
- 移除不必要的假資料導入
- 確保所有patient操作都通過API進行

### 5. 預約查詢潛在安全問題 (需要後端確認)
**問題**: `src/components/PatientLookup.tsx` 使用身分證字號查詢預約
- `searchAppointmentsByIdNumber` API可能沒有正確的LINE ID過濾
- **風險**: 用戶可能查詢到其他人的預約資料

**建議措施**:
- 後端API需要確保根據LINE ID過濾結果
- 不應該僅根據身分證字號返回預約資料
- 需要交叉驗證LINE ID和身分證字號的對應關係

## ✅ 修正後的安全特性

### 1. 正確的API端點使用
- `getPatients` 使用 `/patients/line` 端點 (根據LINE ID獲取)
- `createPatient` 使用 `/patients` 端點 (創建新患者)
- `searchPatientByIdNumber` 使用 `/patients/line` 端點 (根據LINE ID搜尋)

### 2. 嚴格的LINE ID過濾
- 所有API請求都正確設定`x-line-id` header
- Patient相關操作都正確使用LINE ID過濾
- Consultation相關操作都正確使用LINE ID過濾

### 3. 無假資料汙染
- 所有假資料回退邏輯已移除
- API失敗時顯示適當的錯誤訊息
- 用戶只會看到屬於自己的真實資料

### 4. 正確的錯誤處理
- API失敗時不顯示假資料
- 提供清晰的錯誤訊息
- 維護用戶體驗的同時確保資料安全

## 🔒 建議的後續措施

### 1. 後端API驗證
- 確認所有API端點都正確過濾LINE ID
- 特別檢查`searchAppointmentsByIdNumber` API的實作
- 確保沒有資料洩露的風險

### 2. 測試建議
- 使用不同的LINE ID測試所有功能
- 確認用戶無法存取其他人的資料
- 測試API失敗時的錯誤處理

### 3. 監控建議
- 添加日誌記錄，追蹤所有API請求
- 監控異常的資料存取模式
- 定期審核資料存取權限

## 📊 修正檔案列表

1. **`src/services/apiService.ts`** - 🔥 **修正關鍵安全問題：API端點使用錯誤**
2. `src/hooks/useDoctors.ts` - 移除假資料回退
3. `src/components/ConsultationRecords.tsx` - 移除假資料回退
4. `src/hooks/usePatients.ts` - 移除不必要的假資料導入
5. `src/components/PatientLookup.tsx` - 添加安全警告註解

## 結論

系統現在已經修正了**關鍵的安全漏洞**和假資料汙染問題。最重要的修正是 `getPatients` 方法現在使用正確的 `/patients/line` 端點，確保用戶只能看到屬於自己的患者資料。

**風險等級已從高風險降低到低風險**，但仍建議後端團隊確認 `searchAppointmentsByIdNumber` API是否正確實作了LINE ID過濾。 