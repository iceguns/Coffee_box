/**
 * 炉火烘焙所 · API 客户端（门面层）
 * ------------------------------------------------------------------
 * 职责：
 *  1. 持有并持久化会话令牌（localStorage），为所有请求自动注入；
 *  2. 登录 / 注册成功后落令牌；收到 401 时清理令牌并广播
 *     `hearth:unauthorized` 事件，供 AuthContext 全局登出；
 *  3. 将 server/api.ts 的「(token, payload)」风格端点收敛为
 *     面向组件的 `api.xxx(payload)` 调用。
 *
 * 后端实现位于 src/server/（db.ts 数据层 + api.ts 端点层），
 * 以 localStorage 为存储引擎，带 240–700ms 模拟网络延迟与 HTTP 状态码语义。
 */
import {
  ApiError,
  ping as serverPing,
  register as serverRegister,
  login as serverLogin,
  me as serverMe,
  logout as serverLogout,
  listProducts,
  adminListProducts,
  createOrder as serverCreateOrder,
  myOrders as serverMyOrders,
  allOrders as serverAllOrders,
  updateOrderStatus as serverUpdateOrderStatus,
  adjustStock as serverAdjustStock,
  toggleSale as serverToggleSale,
  stats as serverStats,
  getLatency,
  FREE_SHIPPING_AT,
  SHIPPING_FEE,
  MAX_QTY,
  type SellableProduct,
  type AdminProduct,
  type CreateOrderPayload,
  type Stats,
} from "../server/api";
import {
  ORDER_FLOW,
  STATUS_LABEL,
  type Order,
  type OrderStatus,
  type UserPublic,
} from "../server/db";

/* ---------------- 类型与常量转出 ---------------- */

export {
  ApiError,
  ORDER_FLOW,
  STATUS_LABEL,
  getLatency,
  FREE_SHIPPING_AT,
  SHIPPING_FEE,
  MAX_QTY,
};
export type {
  SellableProduct,
  AdminProduct,
  CreateOrderPayload,
  Stats,
  Order,
  OrderStatus,
  UserPublic,
};

/* ---------------- 令牌管理 ---------------- */

const TOKEN_KEY = "hearth_token_v1";
let cachedToken: string | null = null;
try {
  cachedToken = localStorage.getItem(TOKEN_KEY);
} catch {
  /* 隐私模式下退化为纯内存会话 */
}

export function getToken(): string | null {
  return cachedToken;
}

export function setToken(token: string | null): void {
  cachedToken = token;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* noop */
  }
}

function onUnauthorized(): void {
  setToken(null);
  window.dispatchEvent(new CustomEvent("hearth:unauthorized"));
}

/** 统一包装：注入令牌；401 → 全局登出 */
async function call<T>(fn: (token: string | null) => Promise<T>): Promise<T> {
  try {
    return await fn(cachedToken);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) onUnauthorized();
    throw e;
  }
}

/* ---------------- 端点门面 ---------------- */

export const api = {
  /** 系统健康检查 */
  ping: () => call(() => serverPing()),

  /** 商品列表（公开，含实时库存，仅上架商品） */
  products: () => call(() => listProducts()),

  /** 登录：成功返回脱敏用户并落令牌 */
  async login(email: string, password: string): Promise<UserPublic> {
    const { token, user } = await serverLogin(email, password);
    setToken(token);
    return user;
  },

  /** 注册：成功即登录 */
  async register(name: string, email: string, password: string): Promise<UserPublic> {
    const { token, user } = await serverRegister(name, email, password);
    setToken(token);
    return user;
  },

  /** 当前会话用户（用于启动时恢复登录态） */
  me: () => call((t) => serverMe(t)),

  /** 登出：令牌失效也保证本地清理 */
  async logout(): Promise<void> {
    try {
      await serverLogout(cachedToken);
    } catch {
      /* 服务端令牌已失效亦视为登出成功 */
    }
    setToken(null);
  },

  /** 创建订单（服务端校验库存与价格并扣减） */
  createOrder: (payload: CreateOrderPayload) => call((t) => serverCreateOrder(t, payload)),

  /** 我的订单（按时间倒序） */
  myOrders: () => call((t) => serverMyOrders(t)),

  /* ---------- 管理端（需 admin 角色） ---------- */

  allOrders: () => call((t) => serverAllOrders(t)),
  adminProducts: () => call((t) => adminListProducts(t)),
  updateOrderStatus: (orderId: string, next: OrderStatus) =>
    call((t) => serverUpdateOrderStatus(t, orderId, next)),
  adjustStock: (productId: string, delta: number) =>
    call((t) => serverAdjustStock(t, productId, delta)),
  toggleSale: (productId: string) => call((t) => serverToggleSale(t, productId)),
  stats: () => call((t) => serverStats(t)),
};
