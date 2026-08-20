import type { Category, Product } from "../data/products";
import { CATEGORIES, PRODUCTS } from "../data/products";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { IconBean, IconSearch, IconX } from "./icons";

export type SortKey = "featured" | "priceAsc" | "priceDesc" | "rating";

interface Props {
  query: string;
  onQuery: (v: string) => void;
  category: Category | "全部";
  onCategory: (c: Category | "全部") => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  list: Product[];
  onDetail: (p: Product) => void;
  onAdd: (p: Product) => void;
}

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "featured", label: "主理人推荐" },
  { key: "priceAsc", label: "价格 低 → 高" },
  { key: "priceDesc", label: "价格 高 → 低" },
  { key: "rating", label: "评分最高" },
];

export default function ShopSection({
  query,
  onQuery,
  category,
  onCategory,
  sort,
  onSort,
  list,
  onDetail,
  onAdd,
}: Props) {
  const countOf = (c: Category | "全部") =>
    c === "全部" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c).length;

  return (
    <section id="shop" className="relative mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The Coffee List</p>
            <h2 className="mt-3 font-display text-3xl font-black text-crema-50 sm:text-5xl">
              本季豆单<span className="text-caramel-400">。</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-crema-400">
              六款豆子，三种性格。浅烘留花果，中烘求平衡，深烘给醇厚——都按下单顺序，周五清晨现烘。
            </p>
          </div>
          <p className="rounded-full border border-espresso-700 px-4 py-1.5 text-xs text-crema-400">
            共 <span className="font-bold text-caramel-300">{list.length}</span> 款
            {query || category !== "全部" ? " · 筛选中" : " 在售"}
          </p>
        </div>
      </Reveal>

      {/* 工具栏 */}
      <Reveal delay={90}>
        <div className="mt-9 flex flex-col gap-4 rounded-xl border border-espresso-800 bg-espresso-900/60 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-crema-500" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="搜索豆子、产地或风味，如「耶加雪菲 / 茉莉 / 巴拿马」"
              className="field pl-11 pr-10"
              aria-label="搜索商品"
            />
            {query && (
              <button
                onClick={() => onQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-crema-500 transition-colors hover:bg-espresso-800 hover:text-crema-100"
                aria-label="清除搜索"
              >
                <IconX className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  onClick={() => onCategory(c)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 active:scale-95 ${
                    active
                      ? "bg-caramel-500 text-espresso-950 shadow-[0_6px_20px_-6px_rgba(214,143,63,0.6)]"
                      : "border border-espresso-700 text-crema-300 hover:border-caramel-500 hover:text-caramel-300"
                  }`}
                >
                  {c}
                  <span className={`ml-1.5 ${active ? "text-espresso-700" : "text-crema-500"}`}>
                    {countOf(c)}
                  </span>
                </button>
              );
            })}
          </div>

          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="field w-auto cursor-pointer bg-espresso-900 text-xs"
            aria-label="排序方式"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </Reveal>

      {/* 商品网格 */}
      {list.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <ProductCard product={p} onDetail={onDetail} onAdd={onAdd} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center rounded-xl border border-dashed border-espresso-700 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-espresso-850">
            <IconBean className="h-8 w-8 text-caramel-500" />
          </span>
          <h3 className="mt-5 font-display text-xl font-bold text-crema-100">没有找到匹配的豆子</h3>
          <p className="mt-2 max-w-xs text-sm text-crema-500">
            换个关键词试试，比如「低因」「瑰夏」「礼盒」，或者清空筛选看看全部豆单。
          </p>
          <button
            onClick={() => {
              onQuery("");
              onCategory("全部");
            }}
            className="btn-ghost mt-6"
          >
            清空筛选条件
          </button>
        </div>
      )}
    </section>
  );
}
