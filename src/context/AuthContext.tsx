import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, getToken, type UserPublic } from "../api/client";

interface AuthState {
  user: UserPublic | null;
  booting: boolean;
  login: (email: string, password: string) => Promise<UserPublic>;
  register: (name: string, email: string, password: string) => Promise<UserPublic>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [booting, setBooting] = useState(true);

  /* 启动时尝试用本地令牌恢复会话 */
  useEffect(() => {
    let alive = true;
    (async () => {
      if (getToken()) {
        try {
          const u = await api.me();
          if (alive) setUser(u);
        } catch {
          /* 令牌失效，client 已清理 */
        }
      }
      if (alive) setBooting(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* 其他请求触发 401 时全局登出 */
  useEffect(() => {
    const onUnauth = () => setUser(null);
    window.addEventListener("hearth:unauthorized", onUnauth);
    return () => window.removeEventListener("hearth:unauthorized", onUnauth);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await api.login(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const u = await api.register(name, email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, booting, login, register, logout }}>{children}</Ctx.Provider>
  );
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth 必须在 <AuthProvider> 内使用");
  return v;
}
