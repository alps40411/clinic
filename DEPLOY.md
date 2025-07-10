# GitHub Pages 部署指引

## 自動部署（推薦）

### 1. 設定 GitHub Repository
1. 將您的專案推送到 GitHub repository
2. 確保 repository 名稱為 `clinic`（或修改 `vite.config.ts` 中的 `base` 設定）

### 2. 啟用 GitHub Pages
1. 前往您的 GitHub repository
2. 點擊 "Settings" 標籤
3. 在左側選單找到 "Pages"
4. 在 "Source" 部分選擇 "GitHub Actions"

### 3. 推送程式碼觸發部署
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

部署將自動開始，您可以在 "Actions" 標籤中查看進度。

### 4. 訪問您的網站
部署完成後，您的網站將可在以下網址訪問：
```
https://[您的GitHub用戶名].github.io/clinic/
```

## 手動部署

如果您偏好手動部署：

### 1. 安裝依賴
```bash
npm install
```

### 2. 建構專案
```bash
npm run build
```

### 3. 部署到 GitHub Pages
```bash
npm run deploy
```

## 注意事項

- 確保 `vite.config.ts` 中的 `base` 設定與您的 repository 名稱相符
- 如果 repository 名稱不是 `clinic`，請修改 `vite.config.ts`：
  ```ts
  base: '/您的repository名稱/',
  ```
- 專案已配置 SPA 路由支援，直接訪問子路由（如 `/appointment`）將正常工作

## 故障排除

- 如果樣式或資源載入失敗，請檢查 `base` 設定
- 如果路由不工作，請確保 `404.html` 和 `index.html` 中的路由處理腳本正確
- 查看 GitHub Actions 日誌以診斷建構問題 