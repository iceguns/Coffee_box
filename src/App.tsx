import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Category } from "./data/products";
import { PRODUCTS } from "./data/products";
import { api, type SellableProduct } from "./api/client";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Hero, { FlavorMarquee } from "./components/Hero";
import ShopSection, { type SortKey } from "./components/ShopSection";
import ProductModal from "./components/ProductModal";
import CartDrawer, { type CartLine } from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import AuthModal from "./components/AuthModal";
import OrdersModal from "./components/OrdersModal";
import AdminPanel from "./components/AdminPanel";
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
  return (
    <AuthProvider>
      <Store />
    </AuthProvider>
  );
}

function Store() {
  const { user, logout } = useAuth();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "全部">("全部");
  const [sort, setSort] = useState<SortKey>("featured");

  const [products, setProducts] = useState<SellableProduct[] | null>(null);
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [detail, setDetail] = useState<SellableProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    mode: "login" | "register";
    notice?: string;
  }>({ open: false, mode: "login" });
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const toastTimer = useRef<number | null>(null);
  const authNext = useRef<"checkout" | null>(null);

  /* ---------- 从后端加载商品（含实时库存） ---------- */
  const refreshProducts = useCallback(async () => {
    try {
      setProducts(await api.products());
    } catch {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    void refreshProducts();
  }, [refreshProducts]);

  /* ---------- 购物车持久化 ---------- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* 忽略隐私模式下的写入失败 */
    }
  }, [cart]);

  /* ---------- 锁定背景滚动 ---------- */
  const overlayOpen = Boolean(
    detail || cartOpen || checkoutOpen || adminOpen || ordersOpen || authModal.open,
  );
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayOpen]);

  /* ---------- Esc 逐层关闭 ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (checkoutOpen) setCheckoutOpen(false);
      else if (adminOpen) setAdminOpen(false);
      else if (ordersOpen) setOrdersOpen(false);
      else if (authModal.open) setAuthModal((m) => ({ ...m, open: false }));
      else if (detail) setDetail(null);
      else if (cartOpen) setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [checkoutOpen, adminOpen, ordersOpen, authModal.open, detail, cartOpen]);

  const showToast = useCallback((title: string, sub?: string, icon: "bag" | "check" = "bag") => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), title, sub, icon });
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  /* ---------- 购物袋操作 ---------- */
  const addToCart = useCallback(
    (p: SellableProduct, qty = 1) => {
      setCart((prev) => {
        const found = prev.find((c) => c.id === p.id);
        if (found) {
          return prev.map((c) =>
            c.id === p.id ? { ...c, qty: Math.min(MAX_QTY, c.qty + qty) } : c,
          );
        }
        return [...prev, { id: p.id, qty: Math.min(MAX_QTY, qty) }];
      });
      showToast("已加入购物袋", `${p.name} × ${qty}`);
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

  const cartLines: CartLine[] = useMemo(() => {
    const source = products ?? PRODUCTS.map((p) => ({ ...p, stock: 0 }));
    return cart
      .map((c) => {
        const product = source.find((p) => p.id === c.id);
        return product ? { product, qty: c.qty } : null;
      })
      .filter((x): x is CartLine => x !== null);
  }, [cart, products]);

  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);
  const subtotal = cartLines.reduce((s, l) => s + l.product.price * l.qty, 0);

  /* ---------- 筛选 & 排序 ---------- */
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = (products ?? []).filter((p) => {
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
    if (sort === "rating")
      result = [...result].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    return result;
  }, [query, category, sort, products]);

  /* ---------- 结算 / 账号流程 ---------- */
  const handleCheckout = () => {
    setCartOpen(false);
    if (!user) {
      authNext.current = "checkout";
      setAuthModal({
        open: true,
        mode: "login",
        notice: "登录后即可结算，你的购物袋已为你保留。",
      });
    } else {
      setCheckoutOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    if (authNext.current === "checkout") {
      authNext.current = null;
      setCheckoutOpen(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAdminOpen(false);
    showToast("已退出登录", "期待与你再会", "check");
  };

  const handlePlaced = () => {
    setCart([]);
    void refreshProducts(); // 下单后刷新库存显示
  };

  return (
    <div className="min-h-screen overflow-x-clip font-body">
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        user={user}
        onLogin={() => setAuthModal({ open: true, mode: "login" })}
        onOrders={() => setOrdersOpen(true)}
        onAdmin={() => setAdminOpen(true)}
        onLogout={() => void handleLogout()}
      />

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
          loading={products === null}
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
        onCheckout={handleCheckout}
      />

      <AnimatePresence>
        {detail && (
          <ProductModal key={detail.id} product={detail} onClose={() => setDetail(null)} onAdd={addToCart} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {authModal.open && (
          <AuthModal
            key="auth"
            initialMode={authModal.mode}
            notice={authModal.notice}
            onClose={() => setAuthModal((m) => ({ ...m, open: false }))}
            onSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ordersOpen && <OrdersModal key="orders" onClose={() => setOrdersOpen(false)} />}
      </AnimatePresence>

      {adminOpen && user?.role === "admin" && <AdminPanel onClose={() => setAdminOpen(false)} />}

      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal
            key="checkout"
            lines={cartLines}
            user={user}
            onClose={() => setCheckoutOpen(false)}
            onPlaced={handlePlaced}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>
    </div>
  );
}
