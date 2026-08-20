import { useState } from "react";
import { motion } from "framer-motion";
import { FREE_SHIPPING_AT } from "../data/products";
import type { CartLine } from "./CartDrawer";
import {
  IconAlipay,
  IconCard,
  IconCheck,
  IconSpinner,
  IconTruck,
  IconWechat,
  IconX,
} from "./icons";

type Step = "form" | "processing" | "done";
type Pay = "wechat" | "alipay" | "card";

interface Props {
  lines: CartLine[];
  onClose: () => void;
  onPlaced: () => void;
}

const PAY_OPTIONS: Array<{ key: Pay; label: string; icon: React.ReactNode }> = [
  { key: "wechat", label: "微信支付", icon: <IconWechat className="h-5 w-5" /> },
  { key: "alipay", label: "支付宝", icon: <IconAlipay className="h-5 w-5" /> },
  { key: "card", label: "银行卡", icon: <IconCard className="h-5 w-5" /> },
];

export default function CheckoutModal({ lines, onClose, onPlaced }: Props) {
  // 挂载时快照订单，避免下单清空购物车后成功页金额归零
  const [snapshot] = useState(lines);
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pay, setPay] = useState<Pay>("wechat");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState("");

  const subtotal = snapshot.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : 8;
  const total = subtotal + shipping;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "请填写收货人姓名";
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) errs.phone = "请填写正确的 11 位手机号";
    if (address.trim().length < 6) errs.address = "请填写完整的收货地址";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setOrderId(`LH-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`);
    setStep("processing");
    window.setTimeout(() => {
      onPlaced();
      setStep("done");
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={step === "processing" ? undefined : onClose}
        className="absolute inset-0 bg-espresso-950/85 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        role="dialog"
        aria-modal="true"
        aria-label="结算"
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-espresso-700 bg-espresso-900 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)] sm:rounded-2xl"
      >
        {step !== "processing" && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full border border-espresso-700 bg-espresso-950/70 p-2 text-crema-300 backdrop-blur-sm transition-all hover:rotate-90 hover:border-caramel-500 hover:text-caramel-300"
            aria-label="关闭结算"
          >
            <IconX className="h-4.5 w-4.5" />
          </button>
        )}

        {step === "form" && (
          <div className="p-6 sm:p-8">
            <p className="eyebrow">Checkout</p>
            <h3 className="mt-2 font-display text-2xl font-black text-crema-50">确认订单</h3>

            {/* 订单快照 */}
            <div className="mt-5 rounded-xl border border-espresso-800 bg-espresso-950/50 p-4">
              <ul className="divide-y divide-espresso-800">
                {snapshot.map(({ product, qty }) => (
                  <li key={product.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <img
                      src={product.image}
                      alt=""
                      className="h-11 w-11 rounded-md border border-espresso-700 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-crema-100">{product.name}</p>
                      <p className="text-[11px] text-crema-500">
                        {product.weight} × {qty}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-crema-200">¥{product.price * qty}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1.5 border-t border-espresso-800 pt-3 text-sm">
                <div className="flex justify-between text-crema-400">
                  <span>商品小计</span>
                  <span>¥{subtotal}</span>
                </div>
                <div className="flex justify-between text-crema-400">
                  <span className="flex items-center gap-1.5">
                    <IconTruck className="h-4 w-4" /> 顺丰运费
                  </span>
                  <span className={shipping === 0 ? "font-semibold text-sage-300" : ""}>
                    {shipping === 0 ? "免费" : `¥${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-display text-lg font-black text-caramel-300">
                  <span>应付合计</span>
                  <span>¥{total}</span>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-name" className="mb-1.5 block text-xs font-semibold text-crema-300">
                    收货人
                  </label>
                  <input
                    id="co-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="张三"
                    className="field"
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-copper-400">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="co-phone" className="mb-1.5 block text-xs font-semibold text-crema-300">
                    手机号
                  </label>
                  <input
                    id="co-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    placeholder="13800000000"
                    inputMode="numeric"
                    className="field"
                  />
                  {errors.phone && <p className="mt-1.5 text-xs text-copper-400">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="co-addr" className="mb-1.5 block text-xs font-semibold text-crema-300">
                  收货地址
                </label>
                <textarea
                  id="co-addr"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="省 / 市 / 区 + 详细地址"
                  rows={2}
                  className="field resize-none"
                />
                {errors.address && <p className="mt-1.5 text-xs text-copper-400">{errors.address}</p>}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-crema-300">支付方式（模拟）</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {PAY_OPTIONS.map((o) => (
                    <button
                      type="button"
                      key={o.key}
                      onClick={() => setPay(o.key)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-semibold transition-all duration-300 active:scale-95 ${
                        pay === o.key
                          ? "border-caramel-500 bg-caramel-500/10 text-caramel-300"
                          : "border-espresso-700 text-crema-400 hover:border-espresso-500"
                      }`}
                    >
                      {o.icon}
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3.5">
                提交订单 · ¥{total}
              </button>
              <p className="text-center text-[11px] text-crema-500">
                演示应用，不会产生真实扣款 · 提交即视为同意《购买须知》
              </p>
            </form>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center px-8 py-20 text-center">
            <IconSpinner className="h-10 w-10 animate-spin text-caramel-400" />
            <h3 className="mt-6 font-display text-xl font-bold text-crema-50">正在下单…</h3>
            <p className="mt-2 text-sm text-crema-500">炉火正在为你登记这一炉豆子</p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center px-8 py-14 text-center">
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-400/15 ring-2 ring-sage-400/50"
            >
              <IconCheck className="h-9 w-9 text-sage-300" />
            </motion.span>
            <h3 className="mt-6 font-display text-2xl font-black text-crema-50">下单成功！</h3>
            <p className="mt-2 text-sm text-crema-400">
              订单号 <span className="font-mono font-bold text-caramel-300">{orderId}</span> · 实付{" "}
              <span className="font-bold text-caramel-300">¥{total}</span>
            </p>
            <div className="mt-6 w-full max-w-sm rounded-xl border border-espresso-800 bg-espresso-950/50 p-4 text-left text-sm">
              <div className="flex justify-between text-crema-400">
                <span>收货人</span>
                <span className="text-crema-100">
                  {name} {phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-crema-400">
                <span>配送</span>
                <span className="text-crema-100">顺丰速运 · 周六前发出</span>
              </div>
              <div className="mt-2 flex justify-between text-crema-400">
                <span>支付</span>
                <span className="text-crema-100">
                  {PAY_OPTIONS.find((o) => o.key === pay)?.label}（模拟）
                </span>
              </div>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-crema-500">
              周五清晨开炉烘焙，袋身印烘焙日期。
              <br />
              养豆 3–5 天后风味更佳，请耐心等一等炉火。
            </p>
            <button onClick={onClose} className="btn-primary mt-7">
              好的，继续逛
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
