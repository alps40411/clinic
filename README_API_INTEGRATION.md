# API 串接說明文件

## 概述

本專案已成功串接診所 API，使用 LINE User ID (x-line-id header) 進行身份驗證。所有 API 都支援醫生和看診進度資料的動態獲取，同時保留了本地資料作為 fallback 機制。

## 配置資訊

### API 基本設定
- **基礎 URL**: `http://tw1.openvpns.org:30001`
- **認證方式**: `x-line-id` header
- **LINE User ID**: `U66bfb7dabdef424cd78c29bd352fc4cb`

### 可用端點
- `GET /doctors` - 獲取所有醫師資料
- `GET /doctors/{id}` - 獲取特定醫師資料
- `GET /schedules` - 獲取看診進度資料

## 架構設計

### 檔案結構

```
src/
├── config/
│   └── api.ts                 # API 配置檔案 (包含 LINE User ID)
├── services/
│   └── apiService.ts          # API 服務層 (支援所有端點)
├── hooks/
│   ├── useDoctors.ts          # 醫師列表 Hook
│   ├── useDoctor.ts           # 單一醫師 Hook
│   └── useSchedules.ts        # 看診進度 Hook
├── utils/
│   ├── doctorUtils.ts         # 醫師資料轉換工具
│   └── scheduleUtils.ts       # 看診進度資料轉換工具
├── types/
│   ├── doctor.ts              # 醫師型別定義
│   └── schedule.ts            # 看診進度型別定義
└── components/
    ├── ClinicInfoDisplay.tsx  # 診所資訊 (使用醫師 API)
    ├── DoctorSelection.tsx    # 醫師選擇 (使用醫師 API)
    └── ClinicProgress.tsx     # 看診進度 (使用進度 API)
```

### 核心元件說明

#### 1. API 配置 (`src/config/api.ts`)
- 集中管理 API 相關配置
- 支援環境感知 (開發/生產)
- LINE User ID 配置
- 動態 headers 生成

#### 2. API 服務層 (`src/services/apiService.ts`)
提供統一的 API 呼叫介面：
- `getDoctors(lineUserId?)` - 獲取醫師列表
- `getDoctorById(id, lineUserId?)` - 獲取特定醫師資料
- `getSchedules(params?, lineUserId?)` - 獲取看診進度
- 統一的錯誤處理機制
- 支援查詢參數 (分頁、日期範圍等)

#### 3. 資料轉換工具
**醫師資料轉換** (`src/utils/doctorUtils.ts`)：
- `convertApiToDoctorInfo()` - 轉換為詳細醫師資料
- `convertApiToDoctor()` - 轉換為簡化醫師資料

**看診進度轉換** (`src/utils/scheduleUtils.ts`)：
- `convertApiToSchedule()` - 轉換為看診排程
- `convertToScheduleProgress()` - 轉換為進度顯示格式
- `formatTimeSlot()` - 時段格式化

#### 4. 自定義 Hooks
- `useDoctors(lineUserId?)` - 管理醫師列表狀態
- `useDoctor(id, lineUserId?)` - 管理單一醫師資料
- `useSchedules(params?, lineUserId?)` - 管理看診進度資料

## 使用方式

### 醫師資料獲取

```tsx
import { useDoctors } from '../hooks/useDoctors';

function MyComponent() {
  const { doctorsInfo, doctors, loading, error, refetch } = useDoctors();
  // 可選擇傳入自定義 LINE User ID
  // const { ... } = useDoctors('custom-line-user-id');

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;

  return (
    <div>
      {doctorsInfo.map(doctor => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
}
```

### 看診進度獲取

```tsx
import { useSchedules } from '../hooks/useSchedules';

function ProgressComponent() {
  const today = new Date().toISOString().split('T')[0];
  
  const { schedules, loading, error, refetch } = useSchedules({
    page: 1,
    limit: 50,
    startDate: `${today}T00:00:00Z`,
    endDate: `${today}T23:59:59Z`,
  });

  return (
    <div>
      {schedules.map(schedule => (
        <div key={schedule.scheduleId}>
          {schedule.doctorName} - {schedule.progress}%
        </div>
      ))}
    </div>
  );
}
```

## API 資料格式

### 醫師資料 (GET /doctors)
```json
{
  "data": [
    {
      "id": 1,
      "name": "王大明",
      "specialty": "內科",
      "information": {
        "title": "主任醫師",
        "experience": "20年",
        "education": "台大醫學系",
        "image": "https://example.com/image.jpg"
      },
      "createdAt": "2025-07-09T07:17:34.449Z",
      "updatedAt": "2025-07-09T07:17:34.449Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 看診進度 (GET /schedules)
```json
{
  "data": [
    {
      "id": 1,
      "doctorId": 1,
      "clinicId": 1,
      "date": "2024-03-20T10:00:00.000Z",
      "timeSlot": "MORNING",
      "currentAppointments": 0,
      "doctor": {
        "id": 1,
        "name": "王大明",
        "specialty": "內科",
        "information": { ... }
      },
      "clinic": {
        "id": 1,
        "name": "診間一",
        "capacity": 50
      }
    }
  ],
  "meta": { ... }
}
```

## 認證機制

### LINE User ID 使用
每個 API 請求都會自動加入以下 header：
```
x-line-id: U66bfb7dabdef424cd78c29bd352fc4cb
```

### 自定義 User ID
所有 Hook 和 API 方法都支援傳入自定義的 LINE User ID：
```tsx
// 使用預設 ID
const { doctors } = useDoctors();

// 使用自定義 ID
const { doctors } = useDoctors('custom-user-id');
```

## 錯誤處理機制

### Fallback 策略
- **醫師資料**: API 失敗時使用本地醫師資料
- **看診進度**: API 失敗時顯示錯誤訊息，無本地資料
- **用戶友善提示**: 顯示載入狀態和錯誤訊息
- **開發者除錯**: Console 中提供詳細錯誤資訊

### CORS 解決方案
- 開發環境: 使用 Vite 代理 (`/api` → `http://tw1.openvpns.org:30001`)
- 生產環境: 直接訪問 API

## 功能特色

### 看診進度功能
- 即時進度顯示
- 時段篩選 (上午/下午/晚上)
- 等待時間估算
- 手動重新整理
- 載入狀態和錯誤處理

### 醫師資料功能
- 詳細醫師資訊
- 專科分類
- 診所資訊整合
- 預約選擇功能

## 型別定義

### 看診進度型別
```typescript
interface ScheduleProgress {
  scheduleId: string;
  doctorName: string;
  clinicName: string;
  timeSlot: string;
  currentNumber: number;
  totalCapacity: number;
  progress: number; // 0-100 百分比
  status: 'waiting' | 'in-progress' | 'completed';
}
```

### API 參數型別
```typescript
interface ScheduleParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}
```

## 效能考量

### 快取策略
- Hook 在組件掛載時自動獲取資料
- 資料在組件生命週期內保持快取
- 提供 `refetch` 方法手動重新載入

### 查詢優化
- 支援分頁查詢
- 日期範圍篩選
- 時段篩選功能

## 未來擴展

### 可能的改進方向
1. WebSocket 即時更新
2. 離線資料快取
3. 推播通知整合
4. 更多查詢篩選條件

### 新增功能建議
1. 預約狀態查詢
2. 病患資料管理
3. 醫師排班管理
4. 統計分析功能

## 注意事項

1. **認證**: LINE User ID 目前是寫死的，生產環境應該動態獲取
2. **時區**: 注意 API 時間格式和本地時區轉換
3. **效能**: 大量資料時考慮分頁和虛擬滾動
4. **即時性**: 看診進度建議定期更新或使用 WebSocket

## 支援與維護

### 除錯步驟
1. 檢查網路連接狀態
2. 確認 LINE User ID 是否有效
3. 檢查 API 伺服器運行狀態
4. 查看瀏覽器 Console 錯誤訊息

### 開發工具
- 瀏覽器 DevTools 查看 API 請求
- Console 日誌記錄詳細資訊
- Network 標籤監控請求狀態 