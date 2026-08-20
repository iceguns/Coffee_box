import { useCallback, useEffect, useState } from "react";
import {
  api,
  ApiError,
  ORDER_FLOW,
  STATUS_LABEL,
  type AdminProduct,
  type Order,
  type OrderStatus,
  type Stats,
} from "../api/client";
import { roastLabel } from "../data/products";
import { useAuth } from "../context/AuthContext";
import {
  BrandMark,
  IconBean,
  IconCheck,
  IconFlame,
  IconMinus,
  IconPlus,
  IconSpinner,
  IconX,
} from "./icons";

type Tab = "overview" | "orders" | "products";

const STATUS_BADGE: Record<OrderStatus, string> = {
  roasting: "border-caramel-500/45 bg-caramel-500/12 text-caramel-300",
  baked: "border-copper-500/45 bg-copper-500/12 text-copper-300",
  shipping: "border-sage-500/45 bg-sage-500/12 text-sage-300",
  done: "border-espresso-600 bg-espresso-800 text-crema-300",
  cancelled: "border-copper-600/40 bg-espresso-850 text-copper-400",
};

const fmt = (ts: number) => {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
};

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadAll = useCallback(async () => {
    try {
      const [o, p, s] = await Promise.all([api.allOrders(), api.adminProducts(), api.stats()]);
      setOrders(o);
      setProducts(p);
      setStats(s);
    } catch (e) {
      setNotice(e instanceof ApiError ? e.message : "加载失败");
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const run = async (key: string, fn: () => Promise<unknown>, okMsg: string) => {
    setBusyKey(key);
    setNotice("");
    try {
      await fn();
      await loadAll();
      setNotice(okMsg);
      window.setTimeout(() => setNotice(""), 2200);
    } catch (e) {
      setNotice(e instanceof ApiError ? e.message : "操作失败");
    } finally {
      setBusyKey(null);
    }
  };

  const advance = (o: Order) => {
    const next = ORDER_FLOW[ORDER_FLOW.indexOf(o.status) + 1];
    if (!next) return;
    void run(`adv-${o.id}`, () => api.updateOrderStatus(o.id, next), `订单已推进至「${STATUS_LABEL[next]}」`);
  };
  const cancel = (o: Order) =>
    void run(`cancel-${o.id}`, () => api.updateOrderStatus(o.id, "cancelled"), "订单已取消");
  const stock = (id: string, delta: number) =>
    void run(`stock-${id}-${delta}`, () => api.adjustStock(id, delta), "库存已更新");
  const toggle = (id: string, name: string, onSale: boolean) =>
    void run(`sale-${id}`, () => api.toggleSale(id), onSale ? `「${name}」已下架` : `「${name}」已重新上架`);

  const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
    roasting: "出炉",
    baked: "发货",
    shipping: "完成",
  };

  const loading = orders === null || products === null || stats === null;

  return (
    <div className="fixed inset-0 z-[75] flex flex-col bg-espresso-950">
      {/* 顶栏 */}
      <div className="border-b border-espresso-800 bg-espresso-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark className="h-9 w-9 text-caramel-400" />
            <div>
              <h2 className="font-display text-lg font-black leading-none text-crema-50">
                管理后台
              </h2>
              <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-crema-500">
                Backoffice · {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-espresso-700 px-4 py-2 text-sm text-crema-200 transition-all hover:border-caramel-500 hover:text-caramel-300"
          >
            <IconX className="h-4 w-4" />
            返回门店
          </button>
        </div>

        {/* 选项卡 */}
        <div className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
          {(
            [
              ["overview", "数据概览"],
              ["orders", `订单管理${stats ? ` · ${stats.orderCount}` : ""}`],
              ["products", "商品与库存"],
            ] as Array<[Tab, string]>
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative px-4 py-2.5 text-sm font-bold transition-colors ${
                tab === key ? "text-caramel-300" : "text-crema-500 hover:text-crema-200"
              }`}
            >
              {label}
              {tab === key && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-caramel-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 通知条 */}
      {notice && (
        <div className="border-b border-caramel-500/30 bg-caramel-500/10">
          <p className="mx-auto max-w-6xl px-4 py-2 text-xs font-semibold text-caramel-300 sm:px-6">
            {notice}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
          {loading ? (
            <div className="flex flex-col items-center py-24">
              <IconSpinner className="h-9 w-9 animate-spin text-caramel-400" />
              <p className="mt-4 text-sm text-crema-500">正在同步门店数据…</p>
            </div>
          ) : (
            <>
              {/* ============ 概览 ============ */}
              {tab === "overview" && stats && (
                <div>
                  <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
                    {[
                      ["订单总数", String(stats.orderCount), "单"],
                      ["销售额", `¥${stats.revenue}`, "不含已取消"],
                      ["待处理", String(stats.pending), "待烘焙 / 已出炉"],
                      ["已售出", String(stats.unitsSold), "袋 / 盒"],
                    ].map(([label, num, sub]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-espresso-800 bg-espresso-900/70 p-4"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-crema-500">
                          {label}
                        </p>
                        <p className="mt-2 font-display text-2xl font-black text-caramel-300 sm:text-3xl">
                          {num}
                        </p>
                        <p className="mt-1 text-[11px] text-crema-500">{sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    {/* 库存预警 */}
                    <div className="rounded-xl border border-espresso-800 bg-espresso-900/70 p-5">
                      <h3 className="flex items-center gap-2 font-display text-base font-bold text-crema-50">
                        <IconBean className="h-4.5 w-4.5 text-copper-400" />
                        库存预警
                      </h3>
                      {stats.lowStock.length === 0 ? (
                        <p className="mt-4 flex items-center gap-2 text-sm text-sage-300">
                          <IconCheck className="h-4 w-4" /> 库存充足，暂无预警
                        </p>
                      ) : (
                        <ul className="mt-4 space-y-2.5">
                          {stats.lowStock.map((p) => (
                            <li
                              key={p.id}
                              className="flex items-center justify-between rounded-lg border border-espresso-800 bg-espresso-950/50 px-3.5 py-2.5"
                            >
                              <span className="text-sm text-crema-200">{p.name}</span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                  p.stock === 0
                                    ? "bg-copper-500/15 text-copper-300"
                                    : "bg-caramel-500/15 text-caramel-300"
                                }`}
                              >
                                {p.stock === 0 ? "已售罄" : `仅剩 ${p.stock} 袋`}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        onClick={() => setTab("products")}
                        className="mt-4 text-xs font-bold text-caramel-400 transition-colors hover:text-caramel-300"
                      >
                        前往补货 →
                      </button>
                    </div>

                    {/* 最近订单 */}
                    <div className="rounded-xl border border-espresso-800 bg-espresso-900/70 p-5">
                      <h3 className="flex items-center gap-2 font-display text-base font-bold text-crema-50">
                        <IconFlame className="h-4.5 w-4.5 text-caramel-400" />
                        最近订单
                      </h3>
                      {orders.length === 0 ? (
                        <p className="mt-4 text-sm text-crema-500">还没有订单，先去门店逛逛吧。</p>
                      ) : (
                        <ul className="mt-4 space-y-2.5">
                          {orders.slice(0, 5).map((o) => (
                            <li
                              key={o.id}
                              className="flex items-center justify-between gap-2 rounded-lg border border-espresso-800 bg-espresso-950/50 px-3.5 py-2.5"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-mono text-xs font-bold text-caramel-300">
                                  {o.orderNo}
                                </p>
                                <p className="text-[11px] text-crema-500">
                                  {o.userName} · {fmt(o.createdAt)}
                                </p>
                              </div>
                              <span
                                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_BADGE[o.status]}`}
                              >
                                {STATUS_LABEL[o.status]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        onClick={() => setTab("orders")}
                        className="mt-4 text-xs font-bold text-caramel-400 transition-colors hover:text-caramel-300"
                      >
                        查看全部订单 →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ 订单管理 ============ */}
              {tab === "orders" && orders && (
                <div className="overflow-x-auto rounded-xl border border-espresso-800">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-espresso-900 text-[11px] uppercase tracking-[0.14em] text-crema-500">
                      <tr>
                        <th className="px-4 py-3 font-bold">订单号</th>
                        <th className="px-4 py-3 font-bold">顾客</th>
                        <th className="px-4 py-3 font-bold">商品</th>
                        <th className="px-4 py-3 font-bold">金额</th>
                        <th className="px-4 py-3 font-bold">状态</th>
                        <th className="px-4 py-3 font-bold">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-espresso-800 bg-espresso-950/40">
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-14 text-center text-crema-500">
                            暂无订单
                          </td>
                        </tr>
                      )}
                      {orders.map((o) => {
                        const nextLabel = NEXT_LABEL[o.status];
                        return (
                          <tr key={o.id} className="transition-colors hover:bg-espresso-900/50">
                            <td className="px-4 py-3.5">
                              <p className="font-mono text-xs font-bold text-caramel-300">
                                {o.orderNo}
                              </p>
                              <p className="mt-0.5 text-[11px] text-crema-500">{fmt(o.createdAt)}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="font-semibold text-crema-100">{o.userName}</p>
                              <p className="mt-0.5 text-[11px] text-crema-500">{o.contact.phone}</p>
                            </td>
                            <td className="max-w-[220px] px-4 py-3.5">
                              <p className="truncate text-crema-300">
                                {o.items.map((it) => `${it.name}×${it.qty}`).join("、")}
                              </p>
                            </td>
                            <td className="px-4 py-3.5 font-display font-bold text-crema-100">
                              ¥{o.total}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_BADGE[o.status]}`}
                              >
                                {STATUS_LABEL[o.status]}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              {nextLabel ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => advance(o)}
                                    disabled={busyKey === `adv-${o.id}`}
                                    className="flex items-center gap-1.5 rounded-full bg-caramel-500 px-3.5 py-1.5 text-xs font-bold text-espresso-950 transition-all hover:bg-caramel-400 active:scale-95 disabled:opacity-50"
                                  >
                                    {busyKey === `adv-${o.id}` ? (
                                      <IconSpinner className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <IconFlame className="h-3.5 w-3.5" />
                                    )}
                                    {nextLabel}
                                  </button>
                                  {o.status === "roasting" && (
                                    <button
                                      onClick={() => cancel(o)}
                                      disabled={busyKey === `cancel-${o.id}`}
                                      className="rounded-full border border-espresso-600 px-3 py-1.5 text-xs text-crema-400 transition-all hover:border-copper-500 hover:text-copper-300 disabled:opacity-50"
                                    >
                                      取消
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[11px] text-crema-500">
                                  {o.status === "cancelled" ? "—" : `完成于 ${fmt(o.updatedAt)}`}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ============ 商品与库存 ============ */}
              {tab === "products" && products && (
                <ul className="space-y-3.5">
                  {products.map((p) => (
                    <li
                      key={p.id}
                      className={`flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border bg-espresso-900/70 p-4 transition-opacity ${
                        p.onSale ? "border-espresso-800" : "border-espresso-800 opacity-55"
                      }`}
                    >
                      <img
                        src={p.image}
                        alt=""
                        className={`h-14 w-14 rounded-lg border border-espresso-700 object-cover ${
                          p.onSale ? "" : "grayscale"
                        }`}
                      />
                      <div className="min-w-0 flex-1 basis-40">
                        <p className="flex flex-wrap items-center gap-2 font-display text-sm font-bold text-crema-50">
                          {p.name}
                          {p.stock <= 10 && (
                            <span className="rounded-full bg-copper-500/15 px-2 py-0.5 text-[10px] font-bold text-copper-300">
                              {p.stock === 0 ? "已售罄" : `低库存 ${p.stock}`}
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-[11px] text-crema-500">
                          {p.en} · {roastLabel(p.roast)} · ¥{p.price}
                        </p>
                      </div>

                      {/* 库存控制 */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => stock(p.id, -1)}
                          disabled={busyKey === `stock-${p.id}--1` || p.stock === 0}
                          className="rounded-full border border-espresso-600 p-1.5 text-crema-300 transition-all hover:border-copper-500 hover:text-copper-300 active:scale-90 disabled:opacity-30"
                          aria-label="减一"
                        >
                          <IconMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-12 text-center font-display text-base font-black text-caramel-300 tabular-nums">
                          {p.stock}
                        </span>
                        <button
                          onClick={() => stock(p.id, 1)}
                          disabled={busyKey === `stock-${p.id}-1`}
                          className="rounded-full border border-espresso-600 p-1.5 text-crema-300 transition-all hover:border-caramel-500 hover:text-caramel-300 active:scale-90"
                          aria-label="加一"
                        >
                          <IconPlus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => stock(p.id, 10)}
                          disabled={busyKey === `stock-${p.id}-10`}
                          className="ml-1 rounded-full border border-caramel-500/50 px-3 py-1.5 text-[11px] font-bold text-caramel-300 transition-all hover:bg-caramel-500 hover:text-espresso-950 active:scale-95 disabled:opacity-50"
                        >
                          +10 补货
                        </button>
                      </div>

                      {/* 上架开关 */}
                      <button
                        onClick={() => toggle(p.id, p.name, p.onSale)}
                        disabled={busyKey === `sale-${p.id}`}
                        className="flex items-center gap-2.5"
                        role="switch"
                        aria-checked={p.onSale}
                        aria-label={`${p.name} 上架开关`}
                      >
                        <span
                          className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                            p.onSale ? "bg-sage-400" : "bg-espresso-700"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-crema-50 shadow transition-all duration-300 ${
                              p.onSale ? "left-[22px]" : "left-0.5"
                            }`}
                          />
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            p.onSale ? "text-sage-300" : "text-crema-500"
                          }`}
                        >
                          {p.onSale ? "在售" : "已下架"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
