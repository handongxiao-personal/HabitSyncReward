import { useState } from 'react';

const ConfigWarning = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  
  // 检查是否有真实的Firebase配置
  const hasRealConfig = !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID &&
    import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key'
  );

  // 如果有真实配置或已被关闭，不显示警告
  if (hasRealConfig || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 p-4 z-40">
      <div className="max-w-4xl mx-auto flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              ⚠️ Firebase配置缺失
            </h3>
            <div className="mt-1 text-sm text-yellow-700">
              <p>当前使用Demo配置，数据不会保存到真实数据库。</p>
              <p className="mt-1">
                请在项目根目录创建 <code className="bg-yellow-100 px-1 rounded">.env.local</code> 文件并配置你的Firebase项目信息。
              </p>
              <p className="mt-1">
                📖 详细步骤请参考 <code className="bg-yellow-100 px-1 rounded">FIREBASE_SETUP.md</code> 文件
              </p>
            </div>
            <div className="mt-3">
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-800 underline hover:text-yellow-900 text-sm font-medium"
              >
                🔗 前往Firebase控制台
              </a>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="flex-shrink-0 text-yellow-400 hover:text-yellow-600 ml-4"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ConfigWarning;
