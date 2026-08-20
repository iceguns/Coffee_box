import { useState } from "react";
import type { Product } from "../data/products";
import { roastLabel } from "../data/products";
import { IconArrowUpRight, IconBag, IconBeanSolid, IconFlame, IconPlus, IconStar } from "./icons";

interface Props {
  product: Product;
  onDetail: (p: Product) => void;
  onAdd: (p: Product) => void;
}

function RoastMeter({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-0.5" title={`烘焙度：${roastLabel(level)}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <IconBeanSolid
          key={i}
          className={`h-3 w-3 ${i <= level ? "text-caramel-500" : "text-espresso-700"}`}
        />
      ))}
    </span>
  );
}

export default function ProductCard({ product, onDetail, onAdd }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-espresso-800 bg-espresso-900/80 transition-all duration-500 hover:-translate-y-1.5 hover:border-espresso-600 hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.85)]">
      {/* 图片 */}
      <button
        onClick={() => onDetail(product)}
        className="relative block aspect-[5/4] w-full overflow-hidden text-left"
        aria-label={`查看 ${product.name} 详情`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-transparent opacity-70" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-caramel-500 px-3 py-1 text-[11px] font-bold tracking-wider text-espresso-950 shadow-lg">
            {product.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-espresso-950/75 px-3 py-1 text-[11px] font-semibold text-caramel-300 backdrop-blur-sm">
          <IconFlame className="h-3.5 w-3.5" />
          {roastLabel(product.roast)}
        </span>
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-crema-50/25 bg-espresso-950/60 text-crema-50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <IconArrowUpRight className="h-4 w-4" />
        </span>
      </button>

      {/* 信息 */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-crema-500">
            {product.category} · {product.origin.split("·")[0].trim()}
          </p>
          <RoastMeter level={product.roast} />
        </div>

        <h3
          onClick={() => onDetail(product)}
          className="mt-2 cursor-pointer font-display text-lg font-bold leading-snug text-crema-50 transition-colors hover:text-caramel-300"
        >
          {product.name}
        </h3>
        <p className="mt-0.5 text-[11px] italic tracking-wide text-crema-500">{product.en}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.notes.slice(0, 3).map((n) => (
            <span key={n} className="chip px-2.5 py-0.5 text-[11px]">
              {n}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-crema-400">
          <IconStar className="h-3.5 w-3.5 text-caramel-400" />
          <span className="font-semibold text-crema-200">{product.rating.toFixed(1)}</span>
          <span className="text-crema-500">· {product.reviews} 条评价</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-espresso-800 pt-4">
          <div className="mt-3">
            <p className="font-display text-[22px] font-black leading-none text-caramel-300">
              <span className="mr-0.5 text-sm font-bold">¥</span>
              {product.price}
            </p>
            <p className="mt-1 text-[11px] text-crema-500">{product.weight}</p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onDetail(product)}
              className="rounded-full border border-espresso-600 px-4 py-2 text-xs font-semibold text-crema-200 transition-all duration-300 hover:border-caramel-500 hover:text-caramel-300 active:scale-95"
            >
              详情
            </button>
            <button
              onClick={handleAdd}
              className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition-all duration-300 active:scale-95 ${
                added
                  ? "bg-sage-400 text-espresso-950"
                  : "bg-caramel-500 text-espresso-950 hover:bg-caramel-400 hover:shadow-[0_8px_24px_-8px_rgba(214,143,63,0.6)]"
              }`}
              aria-label={`将 ${product.name} 加入购物袋`}
            >
              {added ? "已加入" : <IconPlus className="h-3.5 w-3.5" />}
              {!added && <IconBag className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
