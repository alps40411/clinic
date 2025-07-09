import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ApiTestResult {
  endpoint: string;
  success: boolean;
  data?: any;
  error?: string;
}

const ApiTestComponent: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<ApiTestResult[]>([]);

  const testApis = async () => {
    setTesting(true);
    setResults([]);
    
    const testResults: ApiTestResult[] = [];

    // Test get doctors
    try {
      const doctorsResponse = await apiService.getDoctors();
      testResults.push({
        endpoint: 'GET /doctors',
        success: doctorsResponse.success,
        data: doctorsResponse.data,
        error: doctorsResponse.message,
      });
    } catch (error) {
      testResults.push({
        endpoint: 'GET /doctors',
        success: false,
        error: error instanceof Error ? error.message : '未知錯誤',
      });
    }

    // Test get doctor by ID (根據實際 API 格式使用 ID "1")
    try {
      const doctorResponse = await apiService.getDoctorById('1');
      testResults.push({
        endpoint: 'GET /doctors/1',
        success: doctorResponse.success,
        data: doctorResponse.data,
        error: doctorResponse.message,
      });
    } catch (error) {
      testResults.push({
        endpoint: 'GET /doctors/1',
        success: false,
        error: error instanceof Error ? error.message : '未知錯誤',
      });
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">API 連接測試</h3>
      
      <button
        onClick={testApis}
        disabled={testing}
        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 flex items-center gap-2 mb-4"
      >
        {testing && <Loader2 className="w-4 h-4 animate-spin" />}
        {testing ? '測試中...' : '測試 API 連接'}
      </button>

      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">測試結果：</h4>
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="font-mono text-sm">{result.endpoint}</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    result.success
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {result.success ? '成功' : '失敗'}
                </span>
              </div>
              
              {result.error && (
                <p className="text-red-600 text-sm mb-2">錯誤: {result.error}</p>
              )}
              
              {result.success && result.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    查看回應資料
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent; 