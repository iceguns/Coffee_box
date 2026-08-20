import { IconArrowDown, IconFlame } from "./icons";

const HERO_IMG =
  "https://image.qwenlm.ai/generated-images/08b3431c-17fd-493f-bbf9-198a534e8483/_result.png";

function CoffeeRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="10" opacity="0.5" />
      <circle
        cx="100"
        cy="100"
        r="88"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="40 26 18 30"
        opacity="0.8"
      />
      <circle cx="100" cy="100" r="66" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24">
      {/* 背景层 */}
      <CoffeeRing className="pointer-events-none absolute -left-24 top-24 h-72 w-72 text-espresso-800/80" />
      <CoffeeRing className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 text-espresso-800/60" />
      <p
        className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.5em] text-espresso-600 xl:block"
        style={{ writingMode: "vertical-rl" }}
      >
        Hearth Roasters — Single Origin · Small Batch · Est. 2019
      </p>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        {/* 左：文案 */}
        <div className="relative z-10 lg:col-span-7">
          <p className="hero-fade flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.3em] text-caramel-400">
            <span className="anim-pulse-dot h-2 w-2 rounded-full bg-caramel-500" />
            Specialty Coffee · 每周五 新鲜出炉
          </p>

          <h1 className="mt-6 font-display font-black leading-[1.06] text-crema-50">
            <span className="hero-line-mask text-[clamp(2.7rem,7vw,5.2rem)]">
              <span style={{ animationDelay: "0.1s" }}>炉火慢焙，</span>
            </span>
            <span className="hero-line-mask text-[clamp(2.7rem,7vw,5.2rem)]">
              <span style={{ animationDelay: "0.28s" }}>
                山野<em className="not-italic text-caramel-400">入杯</em>。
              </span>
            </span>
          </h1>

          <p
            className="hero-fade mt-7 max-w-xl text-[15px] leading-relaxed text-crema-300"
            style={{ animationDelay: "0.45s" }}
          >
            我们每周一从产地直采生豆，周三截单、周五清晨开炉，按豆子的脾气曲线烘焙，
            48 小时内发出——你喝到的每一袋，都带着出炉的余温。
          </p>

          <div className="hero-fade mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.58s" }}>
            <a href="#shop" className="btn-primary group">
              逛逛本季豆单
              <IconArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
            <a href="#schedule" className="btn-ghost">
              <IconFlame className="h-4 w-4 text-caramel-400" />
              查看烘焙日程
            </a>
          </div>

          {/* 数据行 */}
          <dl
            className="hero-fade mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-espresso-800 pt-6"
            style={{ animationDelay: "0.72s" }}
          >
            {[
              ["06", "款在售豆单"],
              ["周五", "每周固定开炉"],
              ["48h", "出炉后发货"],
            ].map(([num, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl font-bold text-caramel-300 sm:text-3xl">{num}</dd>
                <dd className="mt-1 text-xs tracking-wide text-crema-500">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 右：拱形影像 */}
        <div className="hero-fade relative lg:col-span-5" style={{ animationDelay: "0.35s" }}>
          <div className="relative mx-auto max-w-[420px]">
            <div className="overflow-hidden rounded-t-[999px] rounded-b-2xl border border-espresso-700 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
              <img
                src={HERO_IMG}
                alt="手冲咖啡注入滤杯，蒸汽升腾"
                className="anim-kenburns aspect-[4/5] w-full object-cover"
              />
            </div>

            {/* 浮卡：本周烘焙 */}
            <div className="anim-float absolute -right-3 top-10 w-44 rounded-xl border border-espresso-700 bg-espresso-900/95 p-4 shadow-xl backdrop-blur-sm sm:-right-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-caramel-400">
                本周烘焙 · No.07
              </p>
              <p className="mt-1.5 font-display text-sm font-bold text-crema-50">耶加雪菲 G1</p>
              <p className="mt-0.5 text-[11px] text-crema-500">浅烘 · 水洗 · 茉莉 / 柑橘</p>
            </div>

            {/* 旋转圆章 */}
            <div className="absolute -bottom-8 -left-4 h-28 w-28 sm:-left-10 sm:h-32 sm:w-32">
              <svg viewBox="0 0 120 120" className="anim-spin-slow h-full w-full text-caramel-400">
                <defs>
                  <path id="ring-path" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text fontSize="10.5" letterSpacing="2.6" fill="currentColor" fontWeight="700">
                  <textPath href="#ring-path">FRESHLY ROASTED · SMALL BATCH · 炉火烘焙 ·</textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <IconFlame className="h-7 w-7 text-caramel-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FlavorMarquee() {
  const words = [
    "茉莉花",
    "佛手柑",
    "黑巧克力",
    "烤榛果",
    "水蜜桃",
    "红糖",
    "太妃糖",
    "红苹果",
    "伯爵茶",
    "蜂蜜",
    "可可碎",
    "橘皮",
  ];
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {words.map((w) => (
        <span key={key + w} className="flex items-center">
          <span className="px-6 font-display text-sm font-semibold tracking-widest text-crema-400">
            {w}
          </span>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-caramel-600" fill="currentColor" aria-hidden>
            <path d="M12 3c4.4 0 7 3.8 7 9s-2.6 9-7 9-7-3.8-7-9 2.6-9 7-9Z" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-espresso-800 bg-espresso-900/70 py-3.5">
      <div className="anim-marquee flex w-max">{[row("a"), row("b")]}</div>
    </div>
  );
}
