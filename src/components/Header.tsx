import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { UserPublic } from "../api/client";
import { BrandMark, IconBag, IconClock, IconFlame, IconMenu, IconX } from "./icons";

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  user: UserPublic | null;
  onLogin: () => void;
  onOrders: () => void;
  onAdmin: () => void;
  onLogout: () => void;
}

const NAV = [
  { href: "#shop", label: "豆单" },
  { href: "#schedule", label: "烘焙日程" },
  { href: "#brew", label: "冲煮指南" },
  { href: "#about", label: "关于炉火" },
];

export default function Header({
  cartCount,
  onCartOpen,
  user,
  onLogin,
  onOrders,
  onAdmin,
  onLogout,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* 顶部通告条 */}
      <div className="bg-caramel-600 text-espresso-950">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-[11px] font-bold tracking-[0.18em]">
          <IconFlame className="h-3.5 w-3.5" />
          本周三 23:59 截单 · 周五出炉 · 满 ¥129 顺丰包邮
        </p>
      </div>

      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "border-b border-espresso-800 bg-espresso-950/92 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.8)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="group flex items-center gap-2.5">
            <BrandMark className="h-9 w-9 text-caramel-400 transition-transform duration-500 group-hover:rotate-[18deg]" />
            <span className="leading-none">
              <span className="block font-display text-lg font-bold tracking-wide text-crema-50">
                炉火烘焙所
              </span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.32em] text-crema-500">
                Hearth Roasters
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="group relative text-sm text-crema-300 transition-colors hover:text-caramel-300"
              >
                {n.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-caramel-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* 账号区 */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-espresso-700 bg-espresso-900/70 py-1.5 pl-1.5 pr-3 transition-all duration-300 hover:border-caramel-500"
                  aria-label="账号菜单"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-caramel-500 font-display text-sm font-black text-espresso-950">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden max-w-20 truncate text-sm font-semibold text-crema-100 sm:block">
                    {user.name}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-3.5 w-3.5 text-crema-500 transition-transform duration-300 ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <>
                      <button
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setAccountOpen(false)}
                        aria-label="关闭菜单"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-espresso-700 bg-espresso-900 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
                      >
                        <p className="border-b border-espresso-800 px-4 py-2.5 text-[11px] text-crema-500">
                          {user.email}
                        </p>
                        <button
                          onClick={() => {
                            setAccountOpen(false);
                            onOrders();
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-crema-200 transition-colors hover:bg-espresso-850 hover:text-caramel-300"
                        >
                          <IconClock className="h-4 w-4 text-caramel-400" /> 我的订单
                        </button>
                        {user.role === "admin" && (
                          <button
                            onClick={() => {
                              setAccountOpen(false);
                              onAdmin();
                            }}
                            className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-crema-200 transition-colors hover:bg-espresso-850 hover:text-caramel-300"
                          >
                            <IconFlame className="h-4 w-4 text-caramel-400" /> 管理后台
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setAccountOpen(false);
                            onLogout();
                          }}
                          className="flex w-full items-center gap-2.5 border-t border-espresso-800 px-4 py-3 text-left text-sm text-crema-400 transition-colors hover:bg-espresso-850 hover:text-copper-300"
                        >
                          <IconX className="h-4 w-4" /> 退出登录
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="rounded-full border border-espresso-700 bg-espresso-900/70 px-4 py-2 text-sm font-semibold text-crema-100 transition-all duration-300 hover:border-caramel-500 hover:text-caramel-300 active:scale-95"
              >
                登录
              </button>
            )}

            <button
              onClick={onCartOpen}
              className="relative flex items-center gap-2 rounded-full border border-espresso-700 bg-espresso-900/70 px-4 py-2 text-sm font-medium text-crema-100 transition-all duration-300 hover:border-caramel-500 hover:text-caramel-300 active:scale-95"
              aria-label="打开购物袋"
            >
              <IconBag className="h-5 w-5" />
              <span className="hidden sm:inline">购物袋</span>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel-500 px-1 text-[11px] font-bold text-espresso-950"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              className="rounded-full border border-espresso-700 p-2 text-crema-200 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="菜单"
            >
              {menuOpen ? <IconX className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden border-t border-espresso-800 bg-espresso-950/97 lg:hidden"
            >
              <div className="flex flex-col px-6 py-3">
                {NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-espresso-850 py-3.5 font-display text-lg text-crema-100 last:border-none hover:text-caramel-300"
                  >
                    {n.label}
                  </a>
                ))}
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onOrders();
                      }}
                      className="border-b border-espresso-850 py-3.5 text-left font-display text-lg text-crema-100 hover:text-caramel-300"
                    >
                      我的订单
                    </button>
                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onAdmin();
                        }}
                        className="border-b border-espresso-850 py-3.5 text-left font-display text-lg text-crema-100 hover:text-caramel-300"
                      >
                        管理后台
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout();
                      }}
                      className="py-3.5 text-left font-display text-lg text-copper-300"
                    >
                      退出登录
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogin();
                    }}
                    className="py-3.5 text-left font-display text-lg text-caramel-300"
                  >
                    登录 / 注册
                  </button>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
