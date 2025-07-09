import React from 'react';
import ApiTestComponent from '../components/ApiTestComponent';
import { useDoctors } from '../hooks/useDoctors';
import { Stethoscope, Settings } from 'lucide-react';

const ApiTestPage: React.FC = () => {
  const { doctorsInfo, doctors, loading, error } = useDoctors();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Settings className="w-8 h-8 text-cyan-500" />
            API 串接測試
          </h1>
          <p className="text-gray-600">測試診所 API 連接狀態</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API 測試組件 */}
          <ApiTestComponent />

          {/* Hook 測試結果 */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-cyan-500" />
              Hook 測試結果
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">載入狀態:</p>
                <p className={`text-sm ${loading ? 'text-yellow-600' : 'text-green-600'}`}>
                  {loading ? '載入中...' : '載入完成'}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-700">錯誤:</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">醫師資料 (詳細):</p>
                <p className="text-sm text-gray-600">
                  載入了 {doctorsInfo.length} 位醫師的詳細資訊
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">醫師資料 (簡化):</p>
                <p className="text-sm text-gray-600">
                  載入了 {doctors.length} 位醫師的基本資訊
                </p>
              </div>

              {doctorsInfo.length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium">
                    查看醫師列表
                  </summary>
                  <div className="mt-2 space-y-2">
                    {doctorsInfo.map((doctor) => (
                      <div key={doctor.id} className="p-2 bg-white rounded border text-xs">
                        <p><strong>ID:</strong> {doctor.id}</p>
                        <p><strong>姓名:</strong> {doctor.name}</p>
                        <p><strong>專科:</strong> {doctor.specialty.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">配置資訊</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>當前環境:</strong> {import.meta.env.DEV ? '開發環境' : '生產環境'}</p>
            <p><strong>API 基礎 URL:</strong> {import.meta.env.DEV ? '/api (代理到 tw1.openvpns.org:30001)' : 'http://tw1.openvpns.org:30001'}</p>
            <p><strong>Bearer Token:</strong> U66bfb7dabdef424cd78c29bd352fc4cb</p>
            <p><strong>端點:</strong></p>
            <ul className="ml-4 list-disc">
              <li>GET /doctors - 獲取所有醫師資料</li>
              <li>GET /doctors/{'{id}'} - 獲取特定醫師資料</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">CORS 解決方案</h4>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>已配置 Vite 代理來解決 CORS 問題：</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>開發環境：使用 /api 代理路徑</li>
              <li>代理目標：http://tw1.openvpns.org:30001</li>
              <li>自動添加 CORS 標頭</li>
            </ul>
            <p className="mt-2 font-medium">如果仍有問題，請重啟開發伺服器：</p>
            <code className="block mt-1 p-2 bg-yellow-100 rounded text-xs">
              npm run dev
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage; 