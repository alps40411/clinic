import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/clinic',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // 代理 API 請求到實際的 API 伺服器
      '/api': {
        target: 'http://tw1.openvpns.org:30001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // 添加 CORS 標頭和處理 OPTIONS 請求
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 確保 x-line-id 標頭被正確傳遞
            if (req.headers['x-line-id']) {
              proxyReq.setHeader('x-line-id', req.headers['x-line-id']);
            }
            // 確保 Content-Type 標頭被正確設置
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, x-line-id, accept';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          });
          
          // 處理 OPTIONS 預檢請求
          proxy.on('error', (err, req, res) => {
            // 記錄代理錯誤
          });
        }
      }
    }
  }
});
