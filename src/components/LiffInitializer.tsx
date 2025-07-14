import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import liffService from '../services/liffService';
import { LIFF_IDS, getLiffIdForCurrentRoute } from '../config/api';

interface LiffInitializerProps {
  children: React.ReactNode;
}

const LiffInitializer: React.FC<LiffInitializerProps> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const initializeLiff = async () => {
      setIsInitializing(true);
      setInitError(null);
      setShowError(false);
      
      try {
        const liffId = getLiffIdForCurrentRoute();
        const isDev = import.meta.env.DEV;
        const isMockEnabled = import.meta.env.VITE_LIFF_MOCK === 'true';
        const mockUserId = import.meta.env.VITE_MOCK_USER_ID;
        
        // 開發環境默認使用 Mock 模式
        const shouldUseMock = isDev && (isMockEnabled || !mockUserId);
        
        const config = {
          liffId,
          mock: shouldUseMock,
          mockUserId: mockUserId || 'U66bfb7dabdef424cd78c29bd352fc4cb',
        };
        
        console.log('Initializing LIFF with config:', config);
        console.log('Environment:', { isDev, isMockEnabled, mockUserId });
        
        // 如果是路由變化，使用reinitialize方法
        if (liffService.isReady()) {
          await liffService.reinitialize(config);
        } else {
          await liffService.init(config);
        }
        
        console.log('LIFF initialized successfully for route:', location.pathname);
        setInitError(null);
      } catch (error) {
        console.error('Failed to initialize LIFF:', error);
        const errorMessage = error instanceof Error ? error.message : 'LIFF初始化失敗';
        setInitError(errorMessage);
        
        // 在開發環境中，如果初始化失敗，延遲顯示錯誤並自動重試 Mock 模式
        if (import.meta.env.DEV) {
          console.log('Development mode: Attempting fallback to mock mode');
          try {
            const fallbackConfig = {
              liffId: getLiffIdForCurrentRoute(),
              mock: true,
              mockUserId: 'U66bfb7dabdef424cd78c29bd352fc4cb',
            };
            await liffService.init(fallbackConfig);
            console.log('Fallback mock initialization successful');
            setInitError(null);
          } catch (fallbackError) {
            console.error('Fallback initialization also failed:', fallbackError);
            // 延遲顯示錯誤，給用戶更好的體驗
            setTimeout(() => {
              setShowError(true);
            }, 1500);
          }
        } else {
          // 生產環境立即顯示錯誤
          setShowError(true);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeLiff();
  }, [location.pathname]); // 當路由變化時重新初始化

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在初始化 LINE 服務...</p>
          <p className="text-sm text-gray-500 mt-2">路由: {location.pathname}</p>
          {import.meta.env.DEV && (
            <p className="text-xs text-blue-500 mt-1">開發模式</p>
          )}
        </div>
      </div>
    );
  }

  if (initError && showError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">LINE初始化失敗：</strong>
            <span className="block sm:inline mt-1"> {initError}</span>
          </div>
          {import.meta.env.DEV ? (
            <div>
              <p className="text-gray-600 mb-4">
                開發環境：請檢查 .env 文件配置或網路連線。
              </p>
              <div className="text-sm text-left bg-gray-100 p-3 rounded mb-4">
                <p className="font-semibold">建議配置 .env 文件：</p>
                <code className="block mt-2">
                  VITE_LIFF_MOCK=true<br/>
                  VITE_MOCK_USER_ID=U66bfb7dabdef424cd78c29bd352fc4cb
                </code>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 mb-4">
              請確認您的 LINE 登入狀態，或檢查網路連線。
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  // 如果有錯誤但不顯示錯誤畫面（開發環境延遲），顯示應用程式但帶警告
  if (initError && !showError && import.meta.env.DEV) {
    return (
      <div>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-sm">
          <p className="font-bold">開發模式警告：</p>
          <p>LIFF 初始化遇到問題，已切換至 Mock 模式</p>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default LiffInitializer; 