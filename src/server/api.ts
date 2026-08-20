/**
 * 炉火烘焙所 · 模拟后端 API 层
 * ------------------------------------------------------------------
 * REST 风格端点：每个请求经过 240–700ms 模拟网络延迟，
 * 以 HTTP 状态码语义抛出 ApiError（400 / 401 / 403 / 404 / 409）。
 * 库存与价格一律以服务端为准，前端传入的仅作为意图（itemId + qty）。
 */
import type { Product } from "../data/products";
import { PRODUCTS } from "../data/products";
import {
  getDB,
  persist,
  uid,
  hashPassword,
  ORDER_FLOW,
  type User,
  type UserPublic,
  type Order,
  type OrderItem,
  type OrderStatus,
  type TokenRow,
} from "./db";

/* ================= 公共类型与常量 ================= */

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface SellableProduct extends Product {
  stock: number;
}
export interface AdminProduct extends SellableProduct {
  onSale: boolean;
}
export interface CreateOrderPayload {
  items: Array<{ productId: string; qty: number }>;
  contact: { name: string; phone: string; address: string; note?: string };
  payment: string;
}
export interface Stats {
  orderCount: number;
  revenue: number;
  pending: number;
  unitsSold: number;
  lowStock: Array<{ id: string; name: string; stock: number; onSale: boolean }>;
}

export const FREE_SHIPPING_AT = 129;
export const SHIPPING_FEE = 8;
export const MAX_QTY = 20;
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

/* ================= 模拟网络 ================= */

let lastLatency = 0;
export const getLatency = () => lastLatency;

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

async function net<T>(fn: () => T): Promise<T> {
  const ms = 240 + Math.floor(Math.random() * 460);
  await sleep(ms);
  lastLatency = ms;
  return fn();
}

/* ================= 鉴权工具 ================= */

function requireUser(token: string | null): User {
  if (!token) throw new ApiError(401, "未登录或登录已过期");
  const db = getDB();
  const row = db.tokens.find((t) => t.token === token);
  if (!row || row.exp < Date.now()) throw new ApiError(401, "未登录或登录已过期");
  const user = db.users.find((u) => u.id === row.userId);
  if (!user) throw new ApiError(401, "账号不存在");
  return user;
}

function requireAdmin(token: string | null): User {
  const user = requireUser(token);
  if (user.role !== "admin") throw new ApiError(403, "该操作需要管理员权限");
  return user;
}

function issueToken(userId: string): TokenRow {
  return { token: `hr_${uid()}${uid()}`, userId, exp: Date.now() + SESSION_MS };
}

function toPublic(u: User): UserPublic {
  return { id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt };
}

/* ================= 端点：系统 ================= */

export async function ping() {
  return net(() => ({ ok: true, service: "hearth-mock-api", ts: Date.now() }));
}

/* ================= 端点：认证 ================= */

export async function register(name: string, email: string, password: string) {
  return net(() => {
    const db = getDB();
    const mail = email.trim().toLowerCase();
    if (!name.trim()) throw new ApiError(400, "请填写昵称");
    if (!/^\S+@\S+\.\S+$/.test(mail)) throw new ApiError(400, "邮箱格式不正确");
    if (password.length < 6) throw new ApiError(400, "密码至少 6 位");
    if (db.users.some((u) => u.email === mail))
      throw new ApiError(409, "该邮箱已注册，直接登录即可");
    const salt = uid();
    const user: User = {
      id: uid(),
      name: name.trim().slice(0, 16),
      email: mail,
      salt,
      passHash: hashPassword(password, salt),
      role: "customer",
      createdAt: Date.now(),
    };
    db.users.push(user);
    db.tokens.push(issueToken(user.id));
    persist();
    return {
      token: db.tokens[db.tokens.length - 1].token,
      user: toPublic(user),
    };
  });
}

export async function login(email: string, password: string) {
  return net(() => {
    const db = getDB();
    const mail = email.trim().toLowerCase();
    const user = db.users.find((u) => u.email === mail);
    if (!user || user.passHash !== hashPassword(password, user.salt))
      throw new ApiError(401, "邮箱或密码不正确");
    db.tokens.push(issueToken(user.id));
    persist();
    return { token: db.tokens[db.tokens.length - 1].token, user: toPublic(user) };
  });
}

export async function me(token: string | null) {
  return net(() => toPublic(requireUser(token)));
}

export async function logout(token: string | null) {
  return net(() => {
    const db = getDB();
    db.tokens = db.tokens.filter((t) => t.token !== token);
    persist();
    return { ok: true };
  });
}

/* ================= 端点：商品 ================= */

function mergeProducts(): SellableProduct[] {
  const db = getDB();
  return PRODUCTS.map((p) => ({ ...p, stock: db.productMeta[p.id]?.stock ?? 0 }));
}

/** 商品列表（公开）：仅返回上架商品 */
export async function listProducts() {
  return net(() => {
    const db = getDB();
    return mergeProducts().filter((p) => db.productMeta[p.id]?.onSale !== false);
  });
}

/** 商品列表（管理端）：含下架商品与上架开关 */
export async function adminListProducts(token: string | null) {
  requireAdmin(token);
  return net(() => {
    const db = getDB();
    return mergeProducts().map<AdminProduct>((p) => ({
      ...p,
      onSale: db.productMeta[p.id]?.onSale !== false,
    }));
  });
}

/* ================= 端点：订单 ================= */

/** 创建订单：服务端校验库存与价格，扣减库存，写入订单表 */
export async function createOrder(token: string | null, payload: CreateOrderPayload) {
  const user = requireUser(token);
  return net(() => {
    const db = getDB();
    if (!payload.items.length) throw new ApiError(400, "购物袋是空的");

    const items: OrderItem[] = payload.items.map(({ productId, qty }) => {
      const p = PRODUCTS.find((x) => x.id === productId);
      if (!p) throw new ApiError(400, "商品不存在或已删除");
      const meta = db.productMeta[productId];
      if (!meta || meta.onSale === false) throw new ApiError(409, `「${p.name}」已下架`);
      if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY)
        throw new ApiError(400, `单件商品最多购买 ${MAX_QTY} 份`);
      if (meta.stock < qty)
        throw new ApiError(409, `「${p.name}」库存不足，仅剩 ${meta.stock} 袋，请调整数量`);
      return { productId, name: p.name, price: p.price, qty };
    });

    // 扣减库存
    for (const it of items) db.productMeta[it.productId].stock -= it.qty;

    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
    const d = new Date();
    const orderNo = `HR${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
      d.getDate(),
    ).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order: Order = {
      id: uid(),
      orderNo,
      userId: user.id,
      userName: user.name,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      payment: payload.payment,
      contact: payload.contact,
      status: "roasting",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    db.orders.unshift(order);
    persist();
    return order;
  });
}

/** 我的订单（按时间倒序） */
export async function myOrders(token: string | null) {
  const user = requireUser(token);
  return net(() =>
    getDB()
      .orders.filter((o) => o.userId === user.id)
      .sort((a, b) => b.createdAt - a.createdAt),
  );
}

/** 全部订单（管理端） */
export async function allOrders(token: string | null) {
  requireAdmin(token);
  return net(() => getDB().orders.slice().sort((a, b) => b.createdAt - a.createdAt));
}

/** 推进订单状态（管理端，严格状态机） */
export async function updateOrderStatus(
  token: string | null,
  orderId: string,
  next: OrderStatus,
) {
  requireAdmin(token);
  return net(() => {
    const db = getDB();
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) throw new ApiError(404, "订单不存在");
    if (order.status === "cancelled") throw new ApiError(409, "已取消的订单不可变更");
    if (order.status === "done") throw new ApiError(409, "订单已完成，不可再变更");
    if (next === "cancelled") {
      if (order.status !== "roasting") throw new ApiError(409, "仅待烘焙订单可取消");
    } else {
      const cur = ORDER_FLOW.indexOf(order.status);
      if (ORDER_FLOW.indexOf(next) !== cur + 1)
        throw new ApiError(409, "状态只能按流程逐步推进");
    }
    order.status = next;
    order.updatedAt = Date.now();
    persist();
    return order;
  });
}

/* ================= 端点：库存（管理端） ================= */

export async function adjustStock(token: string | null, productId: string, delta: number) {
  requireAdmin(token);
  return net(() => {
    const db = getDB();
    const meta = db.productMeta[productId];
    if (!meta) throw new ApiError(404, "商品不存在");
    meta.stock = Math.max(0, Math.min(999, meta.stock + delta));
    persist();
    return { stock: meta.stock };
  });
}

export async function toggleSale(token: string | null, productId: string) {
  requireAdmin(token);
  return net(() => {
    const db = getDB();
    const meta = db.productMeta[productId];
    if (!meta) throw new ApiError(404, "商品不存在");
    meta.onSale = !meta.onSale;
    persist();
    return { onSale: meta.onSale };
  });
}

/* ================= 端点：统计（管理端） ================= */

export async function stats(token: string | null): Promise<Stats> {
  requireAdmin(token);
  return net(() => {
    const db = getDB();
    const valid = db.orders.filter((o) => o.status !== "cancelled");
    const lowStock = PRODUCTS.filter((p) => (db.productMeta[p.id]?.stock ?? 0) <= 10).map((p) => ({
      id: p.id,
      name: p.name,
      stock: db.productMeta[p.id]?.stock ?? 0,
      onSale: db.productMeta[p.id]?.onSale !== false,
    }));
    return {
      orderCount: db.orders.length,
      revenue: valid.reduce((s, o) => s + o.total, 0),
      pending: db.orders.filter((o) => o.status === "roasting" || o.status === "baked").length,
      unitsSold: valid.reduce((s, o) => s + o.items.reduce((x, it) => x + it.qty, 0), 0),
      lowStock,
    };
  });
}
