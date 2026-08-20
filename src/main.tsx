import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/**
 * 全局错误边界：任何运行时错误都会渲染可见的诊断界面，
 * 而不是让预览变成一片空白。
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#16100a",
            color: "#f6e9d6",
            fontFamily: "'Noto Sans SC', sans-serif",
            padding: 24,
          }}
        >
          <div
            style={{
              maxWidth: 520,
              border: "1px solid #523c24",
              borderRadius: 12,
              padding: 28,
              background: "#1e150d",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.24em", color: "#d68f3f" }}>
              HEARTH ROASTERS · 渲染异常
            </p>
            <h1 style={{ margin: "12px 0 8px", fontSize: 22 }}>炉火打了个盹 ☕</h1>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#c9b896" }}>
              应用遇到了运行时错误，错误信息如下。请尝试强制刷新（Ctrl/⌘ + Shift + R）；
              若仍无法恢复，可点击下方按钮重置本地数据。
            </p>
            <pre
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 8,
                background: "#16100a",
                border: "1px solid #3a2a18",
                fontSize: 12,
                color: "#d98a5f",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                maxHeight: 140,
                overflow: "auto",
              }}
            >
              {String(this.state.error?.message ?? this.state.error)}
            </pre>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button
                onClick={() => location.reload()}
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "none",
                  background: "#d68f3f",
                  color: "#16100a",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                重新加载
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch {
                    /* noop */
                  }
                  location.reload();
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid #523c24",
                  background: "transparent",
                  color: "#c9b896",
                  cursor: "pointer",
                }}
              >
                重置本地数据并重载
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
