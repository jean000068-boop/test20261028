import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

type ErrorBoundaryState = {
  error: Error | null;
};

class AppErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('應用程式渲染錯誤：', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 760, margin: '48px auto', padding: '24px', color: '#0f172a' }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>系統載入時發生錯誤</h1>
          <p style={{ lineHeight: 1.7, marginBottom: 16 }}>
            網頁資源已載入，但畫面執行時遇到錯誤。請將下方錯誤訊息提供給維護人員，以便定位問題。
          </p>
          <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, padding: 16 }}>
            {this.state.error.message || String(this.state.error)}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, border: 0, borderRadius: 8, background: '#047857', color: 'white', padding: '10px 16px', cursor: 'pointer' }}
          >
            重新載入
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
} else {
  document.body.innerHTML = '<main style="font-family:system-ui,sans-serif;padding:24px"><h1>系統載入失敗</h1><p>找不到網頁根元素 #root。</p></main>';
}
