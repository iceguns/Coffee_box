import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Category, Product } from "./data/products";
import { PRODUCTS } from "./data/products";
import Header from "./components/Header";
import Hero, { FlavorMarquee } from "./components/Hero";
import ShopSection, { type SortKey } from "./components/ShopSection";
import ProductModal from "./components/ProductModal";
import CartDrawer, { type CartLine } from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import { ScheduleSection, BrewSection, AboutSection } from "./components/StorySections";
import Footer from "./components/Footer";
import Toast, { type ToastData } from "./components/Toast";

interface CartItem {
  id: string;
  qty: number;
}

const STORAGE_KEY = "hearth-cart-v1";
const MAX_QTY = 20;

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed.filter((c) => PRODUCTS.some((p) => p.id === c.id)) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "全部">("全部");
  const [sort, setSort] = useState<SortKey>("featured");

  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [detail, setDetail] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const toastTimer = useRef<number | null>(null);

  /* ---------- 购物车持久化 ---------- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* 忽略隐私模式下的写入失败 */
    }
  }, [cart]);

  /* ---------- 锁定背景滚动 ---------- */
  useEffect(() => {
    const locked = Boolean(detail || cartOpen || checkoutOpen);
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [detail, cartOpen, checkoutOpen]);

  /* ---------- Esc 关闭 ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (checkoutOpen) setCheckoutOpen(false);
      else if (detail) setDetail(null);
      else if (cartOpen) setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [checkoutOpen, detail, cartOpen]);

  const showToast = useCallback((title: string, sub?: string, icon: "bag" | "check" = "bag") => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), title, sub, icon });
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  /* ---------- 购物袋操作 ---------- */
  const addToCart = useCallback(
    (p: Product, qty = 1) => {
      setCart((prev) => {
        const found = prev.find((c) => c.id === p.id);
        if (found) {
          return prev.map((c) =>
            c.id === p.id ? { ...c, qty: Math.min(MAX_QTY, c.qty + qty) } : c,
          );
        }
        return [...prev, { id: p.id, qty: Math.min(MAX_QTY, qty) }];
      });
      showToast(`已加入购物袋`, `${p.name} × ${qty}`);
    },
    [showToast],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      qty < 1
        ? prev.filter((c) => c.id !== id)
        : prev.map((c) => (c.id === id ? { ...c, qty: Math.min(MAX_QTY, qty) } : c)),
    );
  }, []);

  const removeLine = useCallback(
    (id: string) => {
      setCart((prev) => prev.filter((c) => c.id !== id));
      showToast("已从购物袋移除", undefined, "check");
    },
    [showToast],
  );

  const cartLines: CartLine[] = useMemo(
    () =>
      cart
        .map((c) => {
          const product = PRODUCTS.find((p) => p.id === c.id);
          return product ? { product, qty: c.qty } : null;
        })
        .filter((x): x is CartLine => x !== null),
    [cart],
  );

  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);
  const subtotal = cartLines.reduce((s, l) => s + l.product.price * l.qty, 0);

  /* ---------- 筛选 & 排序 ---------- */
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = PRODUCTS.filter((p) => {
      const matchCat = category === "全部" || p.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      const haystack = [p.name, p.en, p.origin, p.process, p.category, p.badge ?? "", ...p.notes]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    if (sort === "priceAsc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    return result;
  }, [query, category, sort]);

  return (
    <div className="min-h-screen overflow-x-clip font-body">
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      <main>
        <Hero />
        <FlavorMarquee />
        <ShopSection
          query={query}
          onQuery={setQuery}
          category={category}
          onCategory={setCategory}
          sort={sort}
          onSort={setSort}
          list={list}
          onDetail={setDetail}
          onAdd={addToCart}
        />
        <ScheduleSection />
        <BrewSection />
        <AboutSection />
      </main>

      <Footer />

      {/* 浮层们 */}
      <CartDrawer
        open={cartOpen}
        lines={cartLines}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onSetQty={setQty}
        onRemove={removeLine}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <AnimatePresence>
        {detail && (
          <ProductModal key={detail.id} product={detail} onClose={() => setDetail(null)} onAdd={addToCart} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal
            key="checkout"
            lines={cartLines}
            onClose={() => setCheckoutOpen(false)}
            onPlaced={() => setCart([])}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast toast={toast} />}
      </AnimatePresence>
    </div>
  );
}
