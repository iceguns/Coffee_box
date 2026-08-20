import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  api,
  ApiError,
  ORDER_FLOW,
  STATUS_LABEL,
  type Order,
  type OrderStatus,
} from "../api/client";
import { IconArrowRight, IconBean, IconSpinner, IconX } from "./icons";

const STATUS_BADGE: Record<OrderStatus, string> = {
  roasting: "border-caramel-500/45 bg-caramel-500/12 text-caramel-300",
  baked: "border-copper-500/45 bg-copper-500/12 text-copper-300",
  shipping: "border-sage-500/45 bg-sage-500/12 text-sage-300",
  done: "border-espresso-600 bg-espresso-800 text-crema-300",
  cancelled: "border-copper-600/40 bg-espresso-850 text-copper-400",
};

const fmt = (ts: number) => {
  const d = new Date(ts);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日 ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
};

function StatusStepper({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <p className="mt-3 rounded-lg border border-copper-600/35 bg-copper-500/8 px-3 py-2 text-xs text-copper-300">
        该订单已取消，款项将在 1–3 个工作日内原路退回（模拟）。
      </p>
    );
  }
  const cur = ORDER_FLOW.indexOf(status);
  return (
    <div className="mt-4 flex items-center">
      {ORDER_FLOW.map((s, i) => (
        <div key={s} className={`flex items-center ${i < ORDER_FLOW.length - 1 ? "flex-1" : ""}`}>
          <div className="flex flex-col items-center">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-bold transition-colors ${
                i <= cur
                  ? "border-caramel-400 bg-caramel-500 text-espresso-950"
                  : "border-espresso-600 bg-espresso-850 text-crema-500"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`mt-1.5 text-[10px] whitespace-nowrap ${
                i <= cur ? "font-bold text-caramel-300" : "text-crema-500"
              }`}
            >
              {STATUS_LABEL[s]}
            </span>
          </div>
          {i < ORDER_FLOW.length - 1 && (
            <span
              className={`mx-1.5 mb-5 h-px flex-1 transition-colors ${
                i < cur ? "bg-caramel-500" : "bg-espresso-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OrdersModal({ onClose }: { onClose: () => void }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setOrders(null);
    else setRefreshing(true);
    setError("");
    try {
      setOrders(await api.myOrders());
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "加载失败，请稍后重试");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="fixed inset-0 z-[82] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-espresso-950/85 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        role="dialog"
        aria-modal="true"
        aria-label="我的订单"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-xl border border-espresso-700 bg-espresso-900 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)] sm:rounded-xl"
      >
        <div className="flex items-center justify-between border-b border-espresso-800 px-6 py-4">
          <div>
            <p className="eyebrow">My Orders</p>
            <h3 className="mt-1 font-display text-xl font-black text-crema-50">我的订单</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void load(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-full border border-espresso-700 px-3.5 py-1.5 text-xs font-semibold text-crema-300 transition-all hover:border-caramel-500 hover:text-caramel-300 disabled:opacity-50"
            >
              <IconArrowRight
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : "rotate-90"}`}
              />
              刷新
            </button>
            <button
              onClick={onClose}
              className="rounded-full border border-espresso-700 p-2 text-crema-300 transition-all hover:rotate-90 hover:border-caramel-500 hover:text-caramel-300"
              aria-label="关闭"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <p className="rounded-lg border border-copper-500/40 bg-copper-500/10 px-4 py-3 text-sm text-copper-300">
              {error}
            </p>
          )}

          {!error && orders === null && (
            <div className="flex flex-col items-center py-16">
              <IconSpinner className="h-8 w-8 animate-spin text-caramel-400" />
              <p className="mt-4 text-sm text-crema-500">正在从烘焙台拉取订单…</p>
            </div>
          )}

          {!error && orders !== null && orders.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-espresso-850">
                <IconBean className="h-8 w-8 text-caramel-500" />
              </span>
              <h4 className="mt-5 font-display text-lg font-bold text-crema-100">还没有订单</h4>
              <p className="mt-2 max-w-xs text-sm text-crema-500">
                挑一袋刚出炉的豆子，让它从烘焙曲线走进你的杯子里。
              </p>
              <a href="#shop" onClick={onClose} className="btn-primary mt-6">
                去挑一袋豆子
              </a>
            </div>
          )}

          {!error &&
            orders !== null &&
            orders.map((o) => (
              <article
                key={o.id}
                className="mb-4 rounded-xl border border-espresso-800 bg-espresso-950/50 p-4 last:mb-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-sm font-bold text-caramel-300">{o.orderNo}</p>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_BADGE[o.status]}`}
                  >
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-crema-500">
                  下单于 {fmt(o.createdAt)} · {o.payment} · 顺丰速运
                </p>

                <ul className="mt-3 space-y-1.5 border-t border-espresso-800 pt-3">
                  {o.items.map((it) => (
                    <li key={it.productId} className="flex justify-between text-sm">
                      <span className="text-crema-300">
                        {it.name}
                        <span className="ml-1.5 text-xs text-crema-500">× {it.qty}</span>
                      </span>
                      <span className="font-semibold text-crema-200">¥{it.price * it.qty}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-2.5 flex justify-between border-t border-espresso-800 pt-2.5 text-sm">
                  <span className="text-crema-500">
                    含运费 {o.shipping === 0 ? "¥0（免邮）" : `¥${o.shipping}`}
                  </span>
                  <span className="font-display text-base font-black text-caramel-300">
                    ¥{o.total}
                  </span>
                </div>

                <StatusStepper status={o.status} />
              </article>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
