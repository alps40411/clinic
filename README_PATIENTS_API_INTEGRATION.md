# 患者 API 串接說明文檔

## 概述

本文檔說明患者 (patients) 相關 API 的串接實作，除了 `GET /patients` 端點外，其他所有患者相關的 API 端點都已完成串接。

## API 端點

### 已串接的端點

1. **POST /patients** - 創建新患者
2. **GET /patients/{id}** - 獲取特定患者資料
3. **PUT /patients/{id}** - 更新患者資料
4. **DELETE /patients/{id}** - 刪除患者
5. **GET /patients?idNumber={idNumber}** - 根據身分證字號搜尋患者

### 未使用的端點

- **GET /patients** - 獲取患者列表（依照需求不使用）

## 實作檔案

### 1. API 配置和服務層

- **src/config/api.ts** - 新增患者相關端點配置
- **src/services/apiService.ts** - 實作患者 API 方法
- **src/utils/patientUtils.ts** - 資料轉換工具

### 2. React Hook

- **src/hooks/usePatients.ts** - 患者資料管理 Hook

### 3. 更新的組件

- **src/components/PatientProfileManager.tsx** - 主要患者管理組件
- **src/components/PatientProfileList.tsx** - 患者列表組件
- **src/components/PatientProfileForm.tsx** - 患者表單組件
- **src/components/PatientLookup.tsx** - 患者查詢組件

## API 資料格式

### 請求格式 (PatientCreateData)

```typescript
interface PatientCreateData {
  name: string;
  idNumber: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}
```

### 回應格式 (ApiPatient)

```typescript
interface ApiPatient {
  id: number;
  name: string;
  idNumber: string;
  phone: string;
  email: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## 身分驗證

所有 API 請求都使用 LINE User ID 作為標頭參數：

```typescript
headers: {
  'Content-Type': 'application/json',
  'accept': 'application/json',
  'x-line-id': 'U66bfb7dabdef424cd78c29bd352fc4cb',
}
```

## 功能特色

### 1. 資料轉換

- 自動將 API 資料格式轉換為前端使用的格式
- 處理 ID 型別轉換 (number → string)
- 可選欄位的預設值處理

### 2. 錯誤處理

- API 請求失敗時的降級處理
- 使用者友善的錯誤訊息
- 載入狀態指示器

### 3. 搜尋功能

- 支援身分證字號搜尋患者
- 輸入格式驗證
- 找不到資料時的適當提示

### 4. CRUD 操作

- **新增患者** - 表單驗證 + API 創建
- **查看患者** - 詳細資料顯示
- **編輯患者** - 預填表單 + API 更新
- **刪除患者** - 確認對話框 + API 刪除

## 載入狀態

所有組件都支援載入狀態顯示：

- 表單提交時的載入指示器
- 搜尋時的載入狀態
- API 請求進行中的視覺回饋

## 錯誤處理策略

1. **網路錯誤** - 顯示重試提示
2. **找不到資料** - 顯示相應訊息
3. **驗證錯誤** - 即時表單驗證
4. **伺服器錯誤** - 使用者友善的錯誤訊息

## 測試建議

### 測試案例

1. **新增患者**
   - 填寫完整資料並提交
   - 測試必填欄位驗證
   - 測試身分證字號格式驗證

2. **搜尋患者**
   - 使用存在的身分證字號搜尋
   - 使用不存在的身分證字號搜尋
   - 測試格式錯誤的身分證字號

3. **編輯患者**
   - 修改患者資料並儲存
   - 測試表單預填功能

4. **刪除患者**
   - 刪除患者並確認
   - 測試刪除確認對話框

## 注意事項

1. **資料一致性** - 前端狀態與後端資料的同步
2. **身分證字號唯一性** - 系統應防止重複的身分證字號
3. **軟刪除** - API 使用軟刪除機制 (isDeleted 欄位)
4. **資料備份** - 重要資料的備份機制

## 後續改進建議

1. **快取機制** - 減少重複的 API 請求
2. **分頁支援** - 大量資料的分頁載入
3. **批次操作** - 支援批次編輯或刪除
4. **離線支援** - 網路斷線時的本地儲存 