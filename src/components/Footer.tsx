import { useEffect, useState } from "react";
import { api, getLatency } from "../api/client";
import { BrandMark, IconArrowRight, IconCheck } from "./icons";

/** 模拟后端心跳：每 6 秒 ping 一次，展示实时响应延迟 */
function ServerStatus() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    const tick = () => {
      api
        .ping()
        .then(() => {
          if (alive) setMs(getLatency());
        })
        .catch(() => undefined);
    };
    tick();
    const t = window.setInterval(tick, 6000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, []);
  return (
    <p className="flex items-center gap-2 rounded-full border border-espresso-800 bg-espresso-900/70 px-3 py-1.5">
      <span className="anim-pulse-dot h-1.5 w-1.5 rounded-full bg-sage-400" />
      本地模拟后端 · 响应 {ms === null ? "—" : `${ms} ms`}
    </p>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-espresso-800 bg-espresso-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#top" className="flex items-center gap-2.5">
              <BrandMark className="h-9 w-9 text-caramel-400" />
              <span className="leading-none">
                <span className="block font-display text-lg font-bold text-crema-50">炉火烘焙所</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.32em] text-crema-500">
                  Hearth Roasters
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-crema-400">
              订阅「炉火来信」：每周一封，只说三件事——新到港的生豆、周五的烘焙曲线、以及一张当季冲煮卡。
            </p>
            {subscribed ? (
              <p className="mt-5 flex items-center gap-2 rounded-lg border border-sage-500/40 bg-sage-500/10 px-4 py-3 text-sm font-semibold text-sage-300">
                <IconCheck className="h-4 w-4" /> 订阅成功！第一封信将于下周一清晨抵达。
              </p>
            ) : (
              <form onSubmit={subscribe} className="mt-5 flex max-w-sm gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="field"
                  aria-label="订阅邮箱"
                />
                <button type="submit" className="btn-primary shrink-0 px-4" aria-label="订阅">
                  <IconArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          <nav className="md:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-crema-500">导航</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["#shop", "本季豆单"],
                ["#schedule", "烘焙日程"],
                ["#brew", "冲煮指南"],
                ["#about", "关于炉火"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-crema-300 transition-colors hover:text-caramel-300"
                  >
                    <span className="h-px w-0 bg-caramel-400 transition-all duration-300 group-hover:w-3" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-crema-500">找到我们</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-crema-300">
              <li>上海市 · 愚园路 1088 弄内</li>
              <li>周二至周日 09:00 – 18:00</li>
              <li>
                电话 / 微信：
                <span className="font-mono text-caramel-300">021-5288-0919</span>
              </li>
              <li className="text-crema-500">企业团购与生豆贸易请邮件联系</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-espresso-850 pt-6 text-[11px] text-crema-500 sm:flex-row">
          <p>© 2026 炉火烘焙所 HEARTH ROASTERS · 演示应用，商品与订单均为模拟数据</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ServerStatus />
            <p className="flex items-center gap-1.5">
              用一炉火，换你清晨的
              <span className="text-caramel-400">第一口</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
