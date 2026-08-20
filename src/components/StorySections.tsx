import Reveal from "./Reveal";
import {
  IconClock,
  IconDrop,
  IconFlame,
  IconLeaf,
  IconPin,
  IconTruck,
  IconBean,
} from "./icons";

/* ---------- 烘焙日程 ---------- */
const STEPS = [
  {
    icon: IconClock,
    day: "周三 23:59",
    title: "截单",
    desc: "统计本周所有订单，按单配豆，不多烘一炉，也不少你一粒。",
  },
  {
    icon: IconFlame,
    day: "周五 06:00",
    title: "开炉烘焙",
    desc: "清晨气压稳定，是烘豆的黄金时段。曲线师按每支豆子的脾气调整火力。",
  },
  {
    icon: IconTruck,
    day: "周六 12:00 前",
    title: "顺丰发出",
    desc: "出炉冷却后即刻装袋，单向排气阀封存风味，48 小时内送到你手上。",
  },
];

export function ScheduleSection() {
  return (
    <section id="schedule" className="relative scroll-mt-28 border-y border-espresso-800 bg-espresso-900/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Roast Schedule</p>
          <h2 className="mt-3 font-display text-3xl font-black text-crema-50 sm:text-4xl">
            一周一炉，只烘新鲜<span className="text-caramel-400">。</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-crema-400">
            我们不囤熟豆。每一袋都从生豆开始，按订单烘焙——你在袋子上摸到的日期，就是它离开炉火的日子。
          </p>
        </Reveal>

        <div className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* 虚线连接 */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-espresso-700 md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 130}>
              <div className="group relative">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-caramel-500/60 bg-espresso-950 text-caramel-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-caramel-500 group-hover:text-espresso-950">
                  <s.icon className="h-6 w-6" />
                </span>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-caramel-400">
                  {s.day}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-bold text-crema-50">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-crema-400">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 冲煮指南 ---------- */
const BREWS = [
  {
    icon: IconDrop,
    name: "V60 手冲",
    params: ["15 g 粉", "225 g 水", "92 ℃", "2:00"],
    tip: "三段式注水，闷蒸 30 秒，浅烘豆尤其受用。",
  },
  {
    icon: IconFlame,
    name: "意式浓缩",
    params: ["18 g 粉", "36 g 液", "93 ℃", "25–28 s"],
    tip: "中深烘拼配做基底，配奶是黑巧与烤坚果的盛宴。",
  },
  {
    icon: IconLeaf,
    name: "冷萃",
    params: ["60 g 粉", "720 g 水", "冷藏", "12–14 h"],
    tip: "1:12 粉水比，一夜之后得到顺滑如蜜的冰咖啡。",
  },
];

export function BrewSection() {
  return (
    <section id="brew" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">Brew Guide</p>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight text-crema-50 sm:text-4xl">
            好豆子，
            <br />
            也值得一套
            <br />
            好参数<span className="text-caramel-400">。</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-crema-400">
            这是吧台每天使用的起点参数。每支豆子的袋内都附一张冲煮卡，按你的器具微调即可——
            咖啡没有标准答案，好喝就是答案。
          </p>
          <blockquote className="mt-6 border-l-2 border-caramel-500 pl-4 font-display text-base italic leading-relaxed text-crema-300">
            「先称豆，再称水，
            <br />
            最后才轮到心情。」
            <footer className="mt-2 text-xs not-italic text-crema-500">—— 主理人 阿炉</footer>
          </blockquote>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
          {BREWS.map((b, i) => (
            <Reveal key={b.name} delay={i * 120}>
              <div className="group flex h-full flex-col rounded-xl border border-espresso-800 bg-espresso-900/70 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-caramel-600/50">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-caramel-500/12 text-caramel-400 transition-colors duration-500 group-hover:bg-caramel-500 group-hover:text-espresso-950">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-crema-50">{b.name}</h3>
                <dl className="mt-4 space-y-2">
                  {b.params.map((p, idx) => (
                    <div
                      key={p}
                      className="flex items-center justify-between border-b border-dashed border-espresso-800 pb-2 text-sm"
                    >
                      <dt className="text-crema-500">{["粉量", "水量", "水温", "时间"][idx]}</dt>
                      <dd className="font-mono font-bold text-crema-100">{p}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-crema-400">{b.tip}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 关于 ---------- */
export function AboutSection() {
  return (
    <section
      id="about"
      className="relative scroll-mt-28 overflow-hidden border-y border-espresso-800 bg-espresso-900/50 py-20"
    >
      <IconBean className="pointer-events-none absolute -right-10 top-8 h-64 w-64 rotate-12 text-espresso-800/70" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="eyebrow">About Hearth</p>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight text-crema-50 sm:text-4xl">
            一间开在巷口的
            <br />
            小型烘焙所<span className="text-caramel-400">。</span>
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-crema-300">
            <p>
              2019 年冬天，我们把一台 5 公斤的 Probat 搬进老巷的砖房，炉火烘焙所就此开张。
              六年过去，炉子换了两台，不变的还是每周五清晨的那一炉——豆子在滚筒里噼啪作响，
              整条巷子都是焦糖香。
            </p>
            <p>
              我们与埃塞、巴拿马、哥伦比亚的八个庄园保持直接贸易，生豆到港后两周内完成杯测与上架。
              卖不完的豆？不存在的——周三截单，按需烘焙，是我们对新鲜最笨拙也最固执的坚持。
            </p>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="flex h-full flex-col justify-center gap-4">
            {[
              {
                icon: IconPin,
                title: "门店地址",
                lines: ["上海市 · 愚园路 1088 弄 内", "砖房红门，闻着焦糖香就能找到"],
              },
              {
                icon: IconClock,
                title: "营业时间",
                lines: ["周二至周日 09:00 – 18:00", "周五烘焙日 14:00 后闭店"],
              },
              {
                icon: IconFlame,
                title: "到店体验",
                lines: ["每周五 15:00 开放杯测台", "当炉豆子免费试喝，带杯减 5 元"],
              },
            ].map((c) => (
              <div
                key={c.title}
                className="group flex gap-4 rounded-xl border border-espresso-800 bg-espresso-950/60 p-5 transition-all duration-300 hover:border-caramel-600/50 hover:bg-espresso-950"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-caramel-500/12 text-caramel-400 transition-colors group-hover:bg-caramel-500 group-hover:text-espresso-950">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-crema-50">{c.title}</h3>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-1 text-xs leading-relaxed text-crema-400">
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
