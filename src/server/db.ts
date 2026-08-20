/**
 * 炉火烘焙所 · 模拟后端数据库层
 * ------------------------------------------------------------------
 * 以 localStorage 为存储引擎的关系型表结构：users / tokens / orders / productMeta。
 * 数据在内存中缓存，写操作统一经 persist() 落盘，模拟真实数据库的读写分离。
 */
import { PRODUCTS } from "../data/products";

/* ================= 类型定义 ================= */

export interface User {
  id: string;
  name: string;
  email: string;
  passHash: string;
  salt: string;
  role: "customer" | "admin";
  createdAt: number;
}
/** 对外脱敏的用户信息（不下发密码哈希与盐） */
export type UserPublic = Omit<User, "passHash" | "salt">;

export interface TokenRow {
  token: string;
  userId: string;
  exp: number;
}

export type OrderStatus = "roasting" | "baked" | "shipping" | "done" | "cancelled";
/** 订单正向状态机：待烘焙 → 已出炉 → 配送中 → 已完成 */
export const ORDER_FLOW: OrderStatus[] = ["roasting", "baked", "shipping", "done"];
export const STATUS_LABEL: Record<OrderStatus, string> = {
  roasting: "待烘焙",
  baked: "已出炉",
  shipping: "配送中",
  done: "已完成",
  cancelled: "已取消",
};

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}
export interface OrderContact {
  name: string;
  phone: string;
  address: string;
  note?: string;
}
export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: string;
  contact: OrderContact;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
}

export interface ProductMeta {
  stock: number;
  onSale: boolean;
}

interface DBShape {
  v: number;
  users: User[];
  tokens: TokenRow[];
  orders: Order[];
  productMeta: Record<string, ProductMeta>;
}

/* ================= 工具函数 ================= */

export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);

/**
 * 演示用口令散列（FNV-1a 双路 48 轮混淆）。
 * 注意：仅为演示，生产环境请使用 bcrypt / argon2 等服务端算法。
 */
export function hashPassword(password: string, salt: string): string {
  const s = `${salt}::${password}::hearth-roasters`;
  let h1 = 0x811c9dc5;
  let h2 = 0x9747b28c;
  for (let round = 0; round < 48; round++) {
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
      h2 = (Math.imul(h2 + c + round, 0x5bd1e995) ^ (h2 >>> 13)) >>> 0;
    }
  }
  return h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0");
}

/* ================= 种子数据 ================= */

const SEED_STOCK: Record<string, number> = {
  "yirgacheffe-g1": 36,
  "geisha-esmeralda": 8, // 限量批次，刻意营造「仅剩 n 袋」的稀缺感
  "huila-cauca": 42,
  "dawn-blend-no7": 64,
  "dusk-decaf": 27,
  "drip-four-seasons": 80,
};

function seed(): DBShape {
  const salt = "hearth-admin-salt";
  const admin: User = {
    id: "u-admin",
    name: "主理人阿炉",
    email: "admin@hearth.coffee",
    salt,
    passHash: hashPassword("hearth2026", salt),
    role: "admin",
    createdAt: Date.now(),
  };
  const productMeta: Record<string, ProductMeta> = {};
  for (const p of PRODUCTS) {
    productMeta[p.id] = { stock: SEED_STOCK[p.id] ?? 30, onSale: true };
  }
  return { v: 1, users: [admin], tokens: [], orders: [], productMeta };
}

/* ================= 读写引擎 ================= */

const KEY = "hearth_db_v1";
let cache: DBShape | null = null;

export function getDB(): DBShape {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DBShape;
      if (parsed && parsed.v === 1 && Array.isArray(parsed.users) && parsed.productMeta) {
        // 版本迭代新增商品时，自动补齐库存记录
        for (const p of PRODUCTS) {
          if (!parsed.productMeta[p.id]) parsed.productMeta[p.id] = { stock: 30, onSale: true };
        }
        cache = parsed;
        return cache;
      }
    }
  } catch {
    /* 数据损坏则重新播种 */
  }
  cache = seed();
  persist();
  return cache;
}

export function persist(): void {
  if (!cache) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* 隐私模式下静默降级为纯内存数据库 */
  }
}

/** 恢复出厂数据（清空用户 / 订单 / 会话，库存回到种子值） */
export function resetDB(): void {
  cache = seed();
  persist();
}
