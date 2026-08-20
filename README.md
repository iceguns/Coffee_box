# ☕ 炉火烘焙所 · HEARTH ROASTERS

> 一个精品咖啡电商 Web 应用 —— 炉火慢焙，山野入杯。
>
> 六款豆子，三种性格：浅烘留花果，中烘求平衡，深烘给醇厚。每周一从产地直采生豆，周三截单、周五清晨开炉，48 小时内带着出炉余温发出。

![cover](https://image.qwenlm.ai/generated-images/08b3431c-17fd-493f-bbf9-198a534e8483/_result.png)

## ✨ 功能特性

### 🛍 电商核心流程

| 功能 | 说明 |
| --- | --- |
| **商品浏览** | 6 款模拟商品（3 单品 / 2 拼配 / 1 挂耳礼盒），配备 AI 生成产品图、产地、处理法、海拔、烘焙度、评分与销量 |
| **实时搜索** | 按中英文名、产地、处理法、分类、风味关键词联合匹配，支持一键清除；无结果时提供空状态引导 |
| **分类筛选** | 「全部 / 单品 / 拼配 / 挂耳」胶囊筛选，显示各分类数量，可与搜索叠加使用 |
| **多维排序** | 主理人推荐 / 价格升序 / 价格降序 / 评分最高 |
| **商品详情** | 弹层展示大图、产地信息、处理法、风味标签、四项风味强度动画条、规格参数表与冲煮建议 |
| **购物袋** | 侧滑抽屉，数量步进调整（1–20）、整行移除、免邮进度条（满 ¥129 包邮）、实时小计 |
| **模拟结算** | 三步流程：收货信息表单校验 → 模拟支付处理 → 订单成功页（生成订单号、预计送达日），全程无真实支付 |
| **持久化** | 购物袋状态写入 `localStorage`（key: `hearth-cart-v1`），刷新与重开浏览器后仍保留 |

### 🎨 视觉与交互体验

- **温暖精致的设计语言**：深烘浓缩棕底色（`#16100a`）+ 焦糖金（`#d68f3f`）+ 奶油色（`#f4ecdf`）+ 鼠尾草绿点缀，全站无一处纯黑纯白
- **字体搭配**：英文标题 Fraunces（可变衬线）× 中文标题思源宋体，正文思源黑体
- **签名式开场**：不对称双栏版面——左侧巨字标题逐行揭示，右侧拱形影像缓慢缩放呼吸，配旋转文字圆章与浮动「本周烘焙」卡片
- **风味跑马灯**：茉莉花 · 佛手柑 · 黑巧克力 · 烤榛果…… 无缝循环滚动
- **微交互**：商品卡悬停抬升与图片放大、风味豆形圆点在悬停时旋转、购物袋徽标弹簧计数动画、加入购物袋轻提示 Toast
- **滚动显现**：各区块随滚动交错浮现（IntersectionObserver + 降级直显）
- **完整响应式**：桌面三栏网格 ↔ 移动端单栏，移动端汉堡菜单、抽屉全屏化适配
- **键盘支持**：`Esc` 依次关闭结算 / 详情 / 购物袋

## 🧰 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | React 18 + TypeScript 5 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 4（`@theme` 自定义设计令牌） |
| 动效 | Framer Motion（弹层 / 抽屉 / 徽标）+ 手写 CSS keyframes（Ken Burns、跑马灯、行遮罩揭示） |
| 图标 | 全站自绘内联 SVG（咖啡豆、火焰、烘焙曲线、滤杯、挂耳包、支付图标等 25+ 枚） |
| 持久化 | localStorage |
| 字体 | Google Fonts：Fraunces / Noto Serif SC / Noto Sans SC |

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 本地开发（默认 http://localhost:5173）
npm run dev

# 3. 类型检查
npm run typecheck

# 4. 生产构建（产物输出至 dist/）
npm run build

# 5. 本地预览构建产物
npm run preview
```

> 构建产物为纯静态站点，可直接部署到 GitHub Pages / Vercel / Netlify / Cloudflare Pages。

## 📁 项目结构

```
├── index.html                      # 入口 HTML（字体预连接、favicon、SEO 描述）
├── src/
│   ├── main.tsx                    # React 挂载入口
│   ├── App.tsx                     # 状态中枢：购物车 / 筛选 / 弹层编排
│   ├── index.css                   # 设计系统：@theme 令牌 + 动效 keyframes + 组件类
│   ├── data/
│   │   └── products.ts             # 6 款商品数据、分类、烘焙日程、冲煮指南、品牌数据
│   └── components/
│       ├── icons.tsx               # 自绘 SVG 图标库 + 品牌标
│       ├── Header.tsx              # 固定页头（通告条 / 导航 / 购物袋徽标 / 移动菜单）
│       ├── Hero.tsx                # 开场版面 + 风味跑马灯
│       ├── ShopSection.tsx         # 搜索 / 筛选 / 排序 / 商品网格 / 空状态
│       ├── ProductCard.tsx         # 商品卡片
│       ├── ProductModal.tsx        # 商品详情弹层
│       ├── CartDrawer.tsx          # 购物袋侧滑抽屉
│       ├── CheckoutModal.tsx       # 三步模拟结算
│       ├── StorySections.tsx       # 烘焙日程 / 冲煮指南 / 品牌故事
│       ├── Footer.tsx              # 页脚 + 邮件订阅
│       ├── Reveal.tsx              # 滚动显现容器
│       └── Toast.tsx               # 轻提示
└── README.md
```

## 🎯 设计系统速览

**色板（`@theme` 令牌）**

| 令牌 | 色值 | 用途 |
| --- | --- | --- |
| `espresso-950` | `#16100a` | 页面底色 |
| `espresso-900/850/800/700` | `#1e150d` ~ `#523c24` | 卡片、分隔线、边框层级 |
| `caramel-300~600` | `#eec084` ~ `#a05e1e` | 主强调色（CTA、价格、高亮） |
| `crema-50~500` | `#f7f2e9` ~ `#a08f74` | 文字层级（暖调米白系） |
| `sage-300/400` | `#b8cbb2` / `#8fae85` | 成功态、免邮进度条 |

**动效签名**

- `kenburns`：开场影像 18s 缓慢缩放呼吸
- `line-reveal`：标题逐行上推揭示（行遮罩）
- `marquee`：风味词带 36s 无缝循环
- `spin-slow` / `float`：圆章自转与浮卡漂浮
- `pulse-dot`：「新鲜出炉」呼吸点

## 📦 数据模型

```ts
interface Product {
  id: string;
  name: string;          // 中文名，如「耶加雪菲 · 果丁丁」
  en: string;            // 英文名
  category: "单品" | "拼配" | "挂耳";
  origin: string;        // 产地
  process: string;       // 处理法
  roast: string;         // 烘焙度
  altitude: string;      // 海拔
  variety?: string;      // 豆种
  notes: string[];       // 风味标签
  intensity: { sweetness: number; acidity: number; body: number; aroma: number }; // 1-5
  price: number;         // 售价（¥）
  weight: string;        // 规格
  rating: number;        // 评分
  reviews: number;       // 评价数
  image: string;         // 产品图 URL
  badge?: string;        // 角标（招牌 / 大师款 / 低因 / 礼盒装）
  story: string;         // 详情页故事文案
  brewing: string[];     // 冲煮建议
}
```

## 🔄 模拟结算流程说明

结算为**纯前端模拟**，不产生真实订单与支付：

1. **填写信息**：收货人 / 手机号（11 位校验）/ 地址（≥5 字校验），支付方式三选一（微信 / 支付宝 / 银行卡）
2. **确认订单**：订单快照在弹层打开时冻结，即使期间购物袋被清空，成功页金额仍正确
3. **处理中**：约 1.6s 模拟网关延时（旋转咖啡豆动画）
4. **下单成功**：生成 `HR26xxxx-xxxx` 订单号与预计送达日（+3 天），清空购物袋，可继续挑选

## 🖼 图片说明

产品图与主视觉由 AI 生成并托管于外部图床（URL 直链于 `src/data/products.ts` 与 `Hero.tsx`）。如需完全离线运行，可将图片下载至 `public/images/` 并替换对应 URL。

## 📝 许可与声明

- 本项目为**演示作品**，所有商品、价格、订单均为模拟数据
- 代码可自由学习使用；图片由 AI 生成，仅用于演示用途

---

<p align="center">用一炉火，换你清晨的<b>第一口</b> ☕</p>
