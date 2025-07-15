import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, RefreshCw } from 'lucide-react';
import liffService from '../services/liffService';
import { getLineUserId, getLiffIdForCurrentRoute, LIFF_IDS } from '../config/api';

const LiffTestPage: React.FC = () => {
  const [liffStatus, setLiffStatus] = useState({
    isReady: false,
    userId: null as string | null,
    currentLiffId: null as string | null,
    error: null as string | null,
  });
  const [envInfo, setEnvInfo] = useState({
    isDev: false,
    mockEnabled: false,
    mockUserId: '',
  });

  const refreshStatus = () => {
    setLiffStatus({
      isReady: liffService.isReady(),
      userId: liffService.getUserId(),
      currentLiffId: liffService.getCurrentLiffId(),
      error: null,
    });

    setEnvInfo({
      isDev: import.meta.env.DEV,
      mockEnabled: import.meta.env.VITE_LIFF_MOCK === 'true',
      mockUserId: import.meta.env.VITE_MOCK_USER_ID || '',
    });
  };

  const testGetLineUserId = () => {
    try {
      const userId = getLineUserId();
      setLiffStatus(prev => ({ ...prev, userId, error: null }));
    } catch (error) {
      setLiffStatus(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">LIFF 狀態檢測</h1>
        <p className="text-gray-600">檢查 LIFF 整合狀態與配置</p>
      </div>

      {/* 環境資訊 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="font-semibold text-blue-800 mb-3 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          環境資訊
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>開發模式:</span>
            <span className={envInfo.isDev ? 'text-green-600' : 'text-gray-600'}>
              {envInfo.isDev ? '是' : '否'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Mock 模式:</span>
            <span className={envInfo.mockEnabled ? 'text-green-600' : 'text-gray-600'}>
              {envInfo.mockEnabled ? '啟用' : '停用'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Mock User ID:</span>
            <span className="text-gray-600 text-xs break-all">
              {envInfo.mockUserId || '未設定'}
            </span>
          </div>
        </div>
      </div>

      {/* LIFF 狀態 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
          LIFF 狀態
          <button
            onClick={refreshStatus}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>服務準備狀態:</span>
            <div className="flex items-center gap-2">
              <StatusIcon status={liffStatus.isReady} />
              <span className={liffStatus.isReady ? 'text-green-600' : 'text-red-600'}>
                {liffStatus.isReady ? '就緒' : '未就緒'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>用戶 ID:</span>
            <span className="text-xs text-gray-600 break-all max-w-32">
              {liffStatus.userId || '無'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>當前 LIFF ID:</span>
            <span className="text-xs text-gray-600 break-all max-w-32">
              {liffStatus.currentLiffId || '無'}
            </span>
          </div>

          {liffStatus.error && (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <p className="text-red-600 text-xs">{liffStatus.error}</p>
            </div>
          )}
        </div>
      </div>

      {/* 路由對應 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h2 className="font-semibold text-gray-800 mb-3">路由 LIFF 對應</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>當前路由:</span>
            <span className="text-blue-600">{window.location.pathname}</span>
          </div>
          <div className="flex justify-between">
            <span>對應 LIFF ID:</span>
            <span className="text-xs text-gray-600 break-all max-w-32">
              {getLiffIdForCurrentRoute()}
            </span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-300">
          <p className="text-xs text-gray-500 mb-2">所有路由對應:</p>
          <div className="space-y-1 text-xs">
            {Object.entries(LIFF_IDS).map(([route, liffId]) => (
              <div key={route} className="flex justify-between">
                <span className="text-gray-600">{route}:</span>
                <span className="text-gray-500 break-all max-w-32">{liffId}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 測試按鈕 */}
      <div className="space-y-3">
        <button
          onClick={testGetLineUserId}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          測試獲取 LINE User ID
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          重新載入頁面
        </button>
      </div>
    </div>
  );
};

export default LiffTestPage; 