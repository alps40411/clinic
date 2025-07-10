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
5. **重要**：確保 repository 在 Settings > Actions > General 中，"Workflow permissions" 設定為 "Read and write permissions"

### 3. 推送程式碼觸發部署
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin deploy
```

部署將自動開始，您可以在 "Actions" 標籤中查看進度。部署過程分為兩個階段：
- **Build**: 建構專案並上傳構建產物
- **Deploy**: 部署到 GitHub Pages

### 4. 訪問您的網站
部署完成後，您的網站將可在以下網址訪問：
```
https://alps40411.github.io/clinic/
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

## 故障排除

### Git 權限錯誤（退出代碼 128）
如果遇到 "git failed with exit code 128" 錯誤：

1. **檢查 Actions 權限**：
   - 前往 Repository Settings > Actions > General
   - 在 "Workflow permissions" 部分選擇 "Read and write permissions"
   - 勾選 "Allow GitHub Actions to create and approve pull requests"

2. **檢查 Pages 設定**：
   - 前往 Repository Settings > Pages
   - 確保 Source 設為 "GitHub Actions"

3. **重新推送觸發部署**：
   ```bash
   git commit --allow-empty -m "Trigger deployment"
   git push origin deploy
   ```

### 其他常見問題
- 如果樣式或資源載入失敗，請檢查 `base` 設定
- 如果路由不工作，請確保 `404.html` 和 `index.html` 中的路由處理腳本正確
- 查看 GitHub Actions 日誌以診斷建構問題

## 分支說明
- **deploy**: 部署分支，推送到此分支會觸發自動部署
- **gh-pages**: GitHub Pages 自動生成的分支，包含建構後的靜態檔案 