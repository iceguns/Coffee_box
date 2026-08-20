import { motion } from "framer-motion";
import type { SellableProduct } from "../api/client";
import { FREE_SHIPPING_AT } from "../data/products";
import { IconArrowRight, IconBag, IconMinus, IconPlus, IconTrash, IconTruck, IconX } from "./icons";

export interface CartLine {
  product: SellableProduct;
  qty: number;
}

interface Props {
  open: boolean;
  lines: CartLine[];
  subtotal: number;
  onClose: () => void;
  onSetQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ open, lines, subtotal, onClose, onSetQty, onRemove, onCheckout }: Props) {
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);
  const gap = FREE_SHIPPING_AT - subtotal;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-espresso-950/80 backdrop-blur-sm ${open ? "" : "pointer-events-none"}`}
      />
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="fixed inset-y-0 right-0 z-[75] flex w-full max-w-md flex-col border-l border-espresso-700 bg-espresso-900 shadow-2xl"
        role="dialog"
        aria-label="购物袋"
      >
        <header className="flex items-center justify-between border-b border-espresso-800 px-6 py-5">
          <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-crema-50">
            <IconBag className="h-5 w-5 text-caramel-400" />
            购物袋
            <span className="rounded-full bg-espresso-800 px-2.5 py-0.5 text-xs font-semibold text-crema-300">
              {count} 件
            </span>
          </h2>
          <button
            onClick={onClose}
            className="rounded-full border border-espresso-700 p-2 text-crema-300 transition-all hover:rotate-90 hover:border-caramel-500 hover:text-caramel-300"
            aria-label="关闭购物袋"
          >
            <IconX className="h-4 w-4" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-espresso-850">
              <IconBag className="h-9 w-9 text-espresso-500" />
            </span>
            <h3 className="mt-6 font-display text-lg font-bold text-crema-100">购物袋还空着</h3>
            <p className="mt-2 text-sm leading-relaxed text-crema-500">
              去豆单里挑一袋刚出炉的豆子吧，
              <br />
              满 ¥{FREE_SHIPPING_AT} 还能顺丰包邮。
            </p>
            <a href="#shop" onClick={onClose} className="btn-primary mt-7">
              去逛豆单 <IconArrowRight className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <>
            {/* 包邮进度 */}
            <div className="border-b border-espresso-800 px-6 py-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-crema-300">
                  <IconTruck className="h-4 w-4 text-caramel-400" />
                  {gap > 0 ? (
                    <>
                      再加 <b className="text-caramel-300">¥{gap}</b> 即可顺丰包邮
                    </>
                  ) : (
                    <b className="text-sage-300">已达包邮门槛，顺丰免费配送</b>
                  )}
                </span>
                <span className="font-bold text-crema-400">¥{FREE_SHIPPING_AT}</span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-espresso-800">
                <motion.div
                  className={`h-full rounded-full ${gap > 0 ? "bg-caramel-500" : "bg-sage-400"}`}
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-espresso-800 overflow-y-auto px-6">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 shrink-0 rounded-lg border border-espresso-700 object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="truncate font-display text-sm font-bold text-crema-50">
                          {product.name}
                        </h4>
                        <p className="mt-0.5 text-[11px] text-crema-500">
                          {product.weight} · ¥{product.price}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemove(product.id)}
                        className="shrink-0 rounded-full p-1.5 text-crema-500 transition-colors hover:bg-espresso-800 hover:text-copper-400"
                        aria-label={`移除 ${product.name}`}
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-espresso-600">
                        <button
                          onClick={() => onSetQty(product.id, qty - 1)}
                          className="p-1.5 text-crema-300 transition-colors hover:text-caramel-300"
                          aria-label="减少数量"
                        >
                          <IconMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold text-crema-50">{qty}</span>
                        <button
                          onClick={() => onSetQty(product.id, qty + 1)}
                          className="p-1.5 text-crema-300 transition-colors hover:text-caramel-300"
                          aria-label="增加数量"
                        >
                          <IconPlus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-display text-base font-black text-caramel-300">
                        ¥{product.price * qty}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-espresso-800 bg-espresso-950/60 px-6 py-5">
              <div className="flex items-center justify-between text-sm text-crema-400">
                <span>运费</span>
                <span className={gap > 0 ? "" : "font-semibold text-sage-300"}>
                  {gap > 0 ? "结算时计算（约 ¥8）" : "免费"}
                </span>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-sm text-crema-400">小计</span>
                <span className="font-display text-3xl font-black text-crema-50">¥{subtotal}</span>
              </div>
              <button onClick={onCheckout} className="btn-primary mt-4 w-full">
                去结算 <IconArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center text-[11px] text-crema-500">
                烘焙日期印于袋身 · 开封后 30 天内风味最佳
              </p>
            </footer>
          </>
        )}
      </motion.aside>
    </>
  );
}
