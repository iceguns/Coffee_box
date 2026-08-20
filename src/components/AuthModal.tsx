import { useState } from "react";
import { motion } from "framer-motion";
import { ApiError, type UserPublic } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { BrandMark, IconFlame, IconSpinner, IconX } from "./icons";

type Mode = "login" | "register";

interface Props {
  initialMode?: Mode;
  notice?: string;
  onClose: () => void;
  onSuccess?: (user: UserPublic) => void;
}

export default function AuthModal({ initialMode = "login", notice, onClose, onSuccess }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setErrors({});
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const errs: Record<string, string> = {};
    if (mode === "register" && !name.trim()) errs.name = "请填写昵称";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = "请输入有效的邮箱地址";
    if (password.length < 6) errs.password = "密码至少 6 位";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const u =
        mode === "login" ? await login(email, password) : await register(name, email, password);
      onSuccess?.(u);
      onClose();
    } catch (err) {
      setErrors({ form: err instanceof ApiError ? err.message : "网络异常，请稍后再试" });
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = () => {
    switchMode("login");
    setEmail("admin@hearth.coffee");
    setPassword("hearth2026");
  };

  return (
    <div className="fixed inset-0 z-[88] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={busy ? undefined : onClose}
        className="absolute inset-0 bg-espresso-950/85 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        role="dialog"
        aria-modal="true"
        aria-label="登录或注册"
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-xl border border-espresso-700 bg-espresso-900 p-6 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)] sm:rounded-xl sm:p-8"
      >
        <button
          onClick={onClose}
          disabled={busy}
          className="absolute right-4 top-4 rounded-full border border-espresso-700 bg-espresso-950/70 p-2 text-crema-300 transition-all hover:rotate-90 hover:border-caramel-500 hover:text-caramel-300 disabled:opacity-40"
          aria-label="关闭"
        >
          <IconX className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <BrandMark className="h-10 w-10 text-caramel-400" />
          <div>
            <h3 className="font-display text-xl font-black text-crema-50">
              {mode === "login" ? "回到炉火旁" : "成为炉火会员"}
            </h3>
            <p className="mt-0.5 text-xs text-crema-500">
              {mode === "login" ? "登录后下单，烘焙进度随时可查" : "注册即可下单，追踪每一炉豆子"}
            </p>
          </div>
        </div>

        {notice && (
          <p className="mt-4 flex items-start gap-2 rounded-lg border border-caramel-500/35 bg-caramel-500/10 px-3 py-2.5 text-xs leading-relaxed text-caramel-300">
            <IconFlame className="mt-0.5 h-4 w-4 shrink-0" />
            {notice}
          </p>
        )}

        {/* 切换选项卡 */}
        <div className="mt-6 flex border-b border-espresso-800">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`relative pb-2.5 pr-6 text-sm font-bold transition-colors ${
                mode === m ? "text-caramel-300" : "text-crema-500 hover:text-crema-200"
              }`}
            >
              {m === "login" ? "登录" : "注册"}
              {mode === m && (
                <motion.span
                  layoutId="auth-tab"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-caramel-400"
                />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          {mode === "register" && (
            <div>
              <label htmlFor="auth-name" className="mb-1.5 block text-xs font-semibold text-crema-300">
                昵称
              </label>
              <input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="怎么称呼你？"
                className="field"
              />
              {errors.name && <p className="mt-1.5 text-xs text-copper-400">{errors.name}</p>}
            </div>
          )}
          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-xs font-semibold text-crema-300">
              邮箱
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field"
            />
            {errors.email && <p className="mt-1.5 text-xs text-copper-400">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="auth-password" className="mb-1.5 block text-xs font-semibold text-crema-300">
              密码
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              className="field"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-copper-400">{errors.password}</p>
            )}
          </div>

          {errors.form && (
            <p className="rounded-lg border border-copper-500/40 bg-copper-500/10 px-3 py-2.5 text-xs font-semibold text-copper-300">
              {errors.form}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full py-3 disabled:opacity-60">
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <IconSpinner className="h-4 w-4 animate-spin" />
                正在与烘焙台确认…
              </span>
            ) : mode === "login" ? (
              "登录"
            ) : (
              "创建账号"
            )}
          </button>
        </form>

        {/* 演示账号 */}
        <div className="mt-5 rounded-lg border border-dashed border-espresso-600 bg-espresso-950/50 p-3.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-crema-500">
            Demo · 演示账号
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-crema-400">
            管理员：<span className="font-mono text-caramel-300">admin@hearth.coffee</span>
            <span className="mx-1.5 text-crema-500">/</span>
            <span className="font-mono text-caramel-300">hearth2026</span>
            <br />
            登录后可进入管理后台推进订单、管理库存；普通访客可自由注册。
          </p>
          <button
            onClick={fillDemo}
            className="mt-2.5 rounded-full border border-caramel-500/50 px-3.5 py-1.5 text-[11px] font-bold text-caramel-300 transition-all hover:bg-caramel-500 hover:text-espresso-950 active:scale-95"
          >
            一键填入管理员账号
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-crema-500">
          演示系统 · 账号与订单仅保存在你的浏览器本地
        </p>
      </motion.div>
    </div>
  );
}
