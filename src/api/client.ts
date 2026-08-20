/**
 * 前端 API 客户端（网络边界）
 * ------------------------------------------------------------------
 * - 统一管理会话令牌（localStorage: hearth_token_v1）
 * - 所有需鉴权的请求自动附带令牌
 * - 捕获 401：清除本地令牌并广播 hearth:unauthorized，由认证上下文接管登出
 * - 将本项目替换为真实后端时，仅需把此处实现改为 fetch(BASE_URL + path)
 */
import * as srv from "../server/api";
import type { OrderStatus } from "../server/db";

export { ApiError, getLatency, FREE_SHIPPING_AT, SHIPPING_FEE, MAX_QTY } from "../server/api";
export type { SellableProduct, AdminProduct, CreateOrderPayload, Stats } from "../server/api";
export type { UserPublic, Order, OrderStatus, OrderItem } from "../server/db";
export { ORDER_FLOW, STATUS_LABEL } from "../server/db";

const TOKEN_KEY = "hearth_token_v1";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(t: string | null): void {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

async function guard<T>(p: Promise<T>): Promise<T> {
  try {
    return await p;
  } catch (e) {
    if (e instanceof srv.ApiError && e.status === 401) {
      setToken(null);
      window.dispatchEvent(new Event("hearth:unauthorized"));
    }
    throw e;
  }
}

export const api = {
  /* 系统 */
  ping: srv.ping,

  /* 认证 */
  register: async (name: string, email: string, password: string) => {
    const r = await srv.register(name, email, password);
    setToken(r.token);
    return r.user;
  },
  login: async (email: string, password: string) => {
    const r = await srv.login(email, password);
    setToken(r.token);
    return r.user;
  },
  me: () => guard(srv.me(getToken())),
  logout: async () => {
    try {
      await srv.logout(getToken());
    } catch {
      /* ignore */
    }
    setToken(null);
  },

  /* 商品 */
  products: srv.listProducts,
  adminProducts: () => guard(srv.adminListProducts(getToken())),

  /* 订单 */
  createOrder: (payload: srv.CreateOrderPayload) => guard(srv.createOrder(getToken(), payload)),
  myOrders: () => guard(srv.myOrders(getToken())),
  allOrders: () => guard(srv.allOrders(getToken())),
  updateOrderStatus: (orderId: string, next: OrderStatus) =>
    guard(srv.updateOrderStatus(getToken(), orderId, next)),

  /* 库存 */
  adjustStock: (productId: string, delta: number) =>
    guard(srv.adjustStock(getToken(), productId, delta)),
  toggleSale: (productId: string) => guard(srv.toggleSale(getToken(), productId)),

  /* 统计 */
  stats: () => guard(srv.stats(getToken())),
};
