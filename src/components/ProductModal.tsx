import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "../data/products";
import { roastLabel } from "../data/products";
import {
  IconBag,
  IconBeanSolid,
  IconCheck,
  IconDrop,
  IconFlame,
  IconLeaf,
  IconMinus,
  IconMountain,
  IconPlus,
  IconStar,
  IconX,
} from "./icons";

interface Props {
  product: Product;
  onClose: () => void;
  onAdd: (p: Product, qty: number) => void;
}

function ProfileBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setW(value), 120 + delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-crema-400">{label}</span>
        <span className="font-bold text-caramel-300">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-espresso-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-caramel-600 to-caramel-400 transition-all duration-1000 ease-out"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}

export default function ProductModal({ product, onClose, onAdd }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [product.id]);

  const handleAdd = () => {
    onAdd(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const specs: Array<{ icon: React.ReactNode; k: string; v: string }> = [
    { icon: <IconMountain className="h-4 w-4" />, k: "产地", v: product.origin },
    { icon: <IconDrop className="h-4 w-4" />, k: "处理法", v: product.process },
    { icon: <IconLeaf className="h-4 w-4" />, k: "海拔", v: product.altitude },
    { icon: <IconFlame className="h-4 w-4" />, k: "烘焙度", v: roastLabel(product.roast) },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="absolute inset-0 bg-espresso-950/85 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-espresso-700 bg-espresso-900 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)] sm:rounded-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-espresso-700 bg-espresso-950/70 p-2 text-crema-300 backdrop-blur-sm transition-all hover:rotate-90 hover:border-caramel-500 hover:text-caramel-300"
          aria-label="关闭详情"
        >
          <IconX className="h-4.5 w-4.5" />
        </button>

        <div className="grid sm:grid-cols-2">
          {/* 图 */}
          <div className="relative aspect-[5/4] overflow-hidden sm:aspect-auto sm:min-h-full">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-espresso-900/50 to-transparent sm:bg-gradient-to-r" />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-caramel-500 px-3 py-1 text-[11px] font-bold text-espresso-950">
                {product.badge}
              </span>
            )}
          </div>

          {/* 信息 */}
          <div className="p-6 sm:p-8">
            <p className="eyebrow">
              {product.category} · {product.en}
            </p>
            <h3 className="mt-2 font-display text-2xl font-black leading-tight text-crema-50">
              {product.name}
            </h3>

            <div className="mt-2.5 flex items-center gap-2 text-xs text-crema-400">
              <span className="flex items-center gap-1">
                <IconStar className="h-3.5 w-3.5 text-caramel-400" />
                <b className="text-crema-100">{product.rating.toFixed(1)}</b>
              </span>
              <span>· {product.reviews} 条评价</span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <IconBeanSolid
                    key={i}
                    className={`h-3 w-3 ${i <= product.roast ? "text-caramel-500" : "text-espresso-700"}`}
                  />
                ))}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-crema-300">{product.desc}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.notes.map((n) => (
                <span key={n} className="chip">
                  {n}
                </span>
              ))}
            </div>

            {/* 风味强度 */}
            <div className="mt-6 space-y-3 rounded-xl border border-espresso-800 bg-espresso-950/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-crema-500">
                Cup Profile · 风味强度
              </p>
              <ProfileBar label="酸质 Acidity" value={product.profile.acidity} delay={0} />
              <ProfileBar label="甜感 Sweetness" value={product.profile.sweetness} delay={150} />
              <ProfileBar label="醇厚 Body" value={product.profile.body} delay={300} />
            </div>

            {/* 规格 */}
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {specs.map((s) => (
                <div key={s.k} className="flex items-start gap-2">
                  <span className="mt-0.5 text-caramel-500">{s.icon}</span>
                  <div>
                    <dt className="text-[10px] tracking-wider text-crema-500">{s.k}</dt>
                    <dd className="text-xs font-medium text-crema-200">{s.v}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <p className="mt-5 flex items-start gap-2 rounded-lg border border-sage-500/30 bg-sage-500/10 p-3 text-xs leading-relaxed text-sage-300">
              <IconFlame className="mt-0.5 h-4 w-4 shrink-0" />
              {product.brewTip}
            </p>

            {/* 价格 + 数量 + 加购 */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-espresso-800 pt-6">
              <p className="font-display text-3xl font-black text-caramel-300">
                <span className="mr-1 text-base font-bold">¥</span>
                {product.price}
                <span className="ml-2 text-xs font-normal text-crema-500">/ {product.weight}</span>
              </p>

              <div className="ml-auto flex items-center rounded-full border border-espresso-600">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="p-2.5 text-crema-300 transition-colors hover:text-caramel-300 disabled:opacity-30"
                  aria-label="减少数量"
                >
                  <IconMinus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-display text-base font-bold text-crema-50">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  disabled={qty >= 20}
                  className="p-2.5 text-crema-300 transition-colors hover:text-caramel-300 disabled:opacity-30"
                  aria-label="增加数量"
                >
                  <IconPlus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 active:scale-95 ${
                  added
                    ? "bg-sage-400 text-espresso-950"
                    : "bg-caramel-500 text-espresso-950 hover:bg-caramel-400 hover:shadow-[0_10px_30px_-8px_rgba(214,143,63,0.55)]"
                }`}
              >
                {added ? (
                  <>
                    <IconCheck className="h-4 w-4" /> 已加入购物袋
                  </>
                ) : (
                  <>
                    <IconBag className="h-4 w-4" /> 加入购物袋 · ¥{product.price * qty}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
