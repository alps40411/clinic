# API 串接說明文件

## 概述

本專案已成功串接診所 API，使用 LINE User ID 作為 Bearer Token 進行身份驗證。所有醫生相關的資料現在都可以從 API 動態獲取，同時保留了本地資料作為 fallback 機制。

## 配置資訊

### API 基本設定
- **基礎 URL**: `http://tw1.openvpns.org:30001`
- **Bearer Token**: `U66bfb7dabdef424cd78c29bd352fc4cb`

### 可用端點
- `GET /doctors` - 獲取所有醫師資料
- `GET /doctors/{id}` - 獲取特定醫師資料

## 架構設計

### 檔案結構

```
src/
├── config/
│   └── api.ts                 # API 配置檔案
├── services/
│   └── apiService.ts          # API 服務層
├── hooks/
│   ├── useDoctors.ts          # 醫師列表 Hook
│   └── useDoctor.ts           # 單一醫師 Hook
├── utils/
│   └── doctorUtils.ts         # 資料轉換工具
├── components/
│   └── ApiTestComponent.tsx   # API 測試組件
└── pages/
    └── ApiTestPage.tsx        # API 測試頁面
```

### 核心元件說明

#### 1. API 配置 (`src/config/api.ts`)
集中管理 API 相關配置，包括 URL、端點和認證標頭。

#### 2. API 服務層 (`src/services/apiService.ts`)
提供統一的 API 呼叫介面：
- `getDoctors()` - 獲取醫師列表
- `getDoctorById(id)` - 獲取特定醫師資料
- 統一的錯誤處理機制

#### 3. 資料轉換工具 (`src/utils/doctorUtils.ts`)
將 API 返回的資料轉換為現有的型別格式：
- `convertApiToDoctorInfo()` - 轉換為詳細醫師資料
- `convertApiToDoctor()` - 轉換為簡化醫師資料

#### 4. 自定義 Hooks
- `useDoctors()` - 管理醫師列表狀態，包含 loading、error 處理
- `useDoctor(id)` - 管理單一醫師資料獲取

## 使用方式

### 在組件中使用醫師資料

```tsx
import { useDoctors } from '../hooks/useDoctors';

function MyComponent() {
  const { doctorsInfo, doctors, loading, error, refetch } = useDoctors();

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

### 獲取單一醫師資料

```tsx
import { useDoctor } from '../hooks/useDoctor';

function DoctorDetail({ doctorId }: { doctorId: string }) {
  const { doctor, loading, error } = useDoctor(doctorId);

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;
  if (!doctor) return <div>找不到醫師</div>;

  return <div>{doctor.name} - {doctor.specialty.join(', ')}</div>;
}
```

## 錯誤處理機制

### Fallback 策略
當 API 呼叫失敗時，系統會自動：
1. 顯示錯誤訊息給使用者
2. 使用本地資料作為 fallback
3. 記錄錯誤到 console 供開發者除錯

### 錯誤類型
- **網路錯誤**: 無法連接到 API 伺服器
- **認證錯誤**: Bearer Token 無效或過期
- **資料錯誤**: API 回應格式不正確

## 測試與除錯

### API 測試頁面
訪問 `/api-test` 路由可以進入 API 測試頁面，提供：
- 即時 API 連接測試
- 回應資料檢視
- Hook 狀態監控
- 錯誤資訊顯示

### 開發者工具
在瀏覽器的 Console 中可以看到：
- API 請求詳細資訊
- 錯誤堆疊追蹤
- 資料轉換過程

## 型別定義

### API 回應型別

```typescript
interface ApiDoctor {
  id: string;
  name: string;
  specialty: string[];
  title?: string;
  image?: string;
  education?: string[];
  experience?: string[];
  certifications?: string[];
  expertise?: string[];
  schedule?: { [key: string]: string[] };
  introduction?: string;
}
```

### Hook 回應型別

```typescript
interface UseDoctorsReturn {
  doctorsInfo: DoctorInfo[];  // 詳細醫師資料
  doctors: Doctor[];          // 簡化醫師資料
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

## 效能考量

### 快取策略
- Hook 在組件掛載時自動獲取資料
- 資料在組件生命週期內保持快取
- 提供 `refetch` 方法手動重新載入

### 載入狀態
- 提供 loading 狀態指示器
- 使用者友善的錯誤訊息
- 平滑的 UI 轉場效果

## 未來擴展

### 可能的改進方向
1. 增加資料快取機制（如 React Query）
2. 實現離線支援
3. 添加更多 API 端點支援
4. 實現即時資料更新（WebSocket）

### 新增 API 端點
要添加新的 API 端點，請：
1. 在 `api.ts` 中增加端點配置
2. 在 `apiService.ts` 中實現對應方法
3. 建立相應的 Hook
4. 更新型別定義

## 注意事項

1. **安全性**: Bearer Token 目前是寫死的，生產環境應該使用動態獲取
2. **CORS**: 確保 API 伺服器允許前端域名的跨域請求
3. **錯誤監控**: 建議在生產環境中添加錯誤監控服務
4. **API 版本**: 注意 API 版本兼容性問題

## 支援與維護

如有 API 相關問題，請檢查：
1. 網路連接狀態
2. Bearer Token 是否有效
3. API 伺服器是否正常運行
4. 瀏覽器 Console 中的錯誤訊息

開發者可以通過 `/api-test` 頁面快速診斷 API 連接問題。 