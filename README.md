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
| **模拟结算** | 订单由「后端服务」创建：服务端校验库存与价格 → 扣减库存 → 生成订单号，库存不足返回 409 并提示原因 |
| **持久化** | 购物袋状态写入 `localStorage`（key: `hearth-cart-v1`），刷新与重开浏览器后仍保留 |
| **账号系统** | 注册 / 登录 / 7 天会话令牌，401 全局自动登出；内置管理员演示账号，支持一键填入 |
| **订单系统** | 订单状态机「待烘焙 → 已出炉 → 配送中 → 已完成 / 已取消」；「我的订单」带四段进度时间线，可刷新同步 |
| **管理后台** | 销售统计（订单数 / 销售额 / 待处理 / 售出件数）、订单推进与取消、补货与上/下架开关；下架商品实时从门店消失 |
| **库存引擎** | 下单即时扣减库存、「仅剩 n 袋」稀缺提示、售罄自动禁购、低库存预警（瑰夏红标种子库存仅 8 袋） |

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
| 后端 | 浏览器内模拟服务：REST 风格 API 层（延迟 / HTTP 状态码 / 会话 / 状态机）+ localStorage 数据库，可平替真实后端 |
| 持久化 | localStorage（购物袋 `hearth-cart-v1`、数据库 `hearth_db_v1`、令牌 `hearth_token_v1`） |
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
│   ├── App.tsx                     # 状态中枢：购物车 / 筛选 / 弹层与路由编排
│   ├── index.css                   # 设计系统：@theme 令牌 + 动效 keyframes + 组件类
│   ├── data/
│   │   └── products.ts             # 6 款商品种子数据、分类、烘焙日程、冲煮指南、品牌数据
│   ├── server/                     # ★ 模拟后端
│   │   ├── db.ts                   # 数据库层：users / tokens / orders / productMeta 四表 + 种子数据
│   │   └── api.ts                  # REST 风格 API：延迟、状态码、鉴权、库存引擎、订单状态机
│   ├── api/
│   │   └── client.ts               # 前端 API 客户端（网络边界）：令牌管理 + 401 全局处理
│   ├── context/
│   │   └── AuthContext.tsx         # 认证上下文：会话恢复 / 登录 / 注册 / 登出
│   └── components/
│       ├── icons.tsx               # 自绘 SVG 图标库 + 品牌标
│       ├── Header.tsx              # 固定页头（通告条 / 导航 / 账号菜单 / 购物袋徽标 / 移动菜单）
│       ├── Hero.tsx                # 开场版面 + 风味跑马灯
│       ├── ShopSection.tsx         # 搜索 / 筛选 / 排序 / 商品网格 / 加载骨架 / 空状态
│       ├── ProductCard.tsx         # 商品卡片（含库存 / 售罄 / 稀缺状态）
│       ├── ProductModal.tsx        # 商品详情弹层
│       ├── CartDrawer.tsx          # 购物袋侧滑抽屉
│       ├── CheckoutModal.tsx       # 结算：表单校验 → 服务端建单 → 成功页
│       ├── AuthModal.tsx           # 登录 / 注册（含演示账号一键填入）
│       ├── OrdersModal.tsx         # 我的订单 + 四段进度时间线
│       ├── AdminPanel.tsx          # 管理后台：数据概览 / 订单管理 / 商品与库存
│       ├── StorySections.tsx       # 烘焙日程 / 冲煮指南 / 品牌故事
│       ├── Footer.tsx              # 页脚 + 邮件订阅 + 后端心跳状态
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

## 🖥 后端系统（浏览器内模拟服务）

最终部署目标是纯静态环境，因此后端实现为运行在浏览器内的「服务」：前端通过统一的 `api` 客户端像调用真实 HTTP 服务一样访问它，内部由 **API 层 → 数据库层 → localStorage 存储引擎** 三层构成，架构上可无缝平替为真实后端。

### 分层架构

```
┌───────────────────────────────────────────────────┐
│  React UI（ShopSection / CartDrawer / AdminPanel …）│
├───────────────────────────────────────────────────┤
│  src/api/client.ts            网络边界             │
│  · 令牌管理（hearth_token_v1）                     │
│  · 请求自动附带令牌 / 401 全局登出广播              │
├───────────────────────────────────────────────────┤
│  src/server/api.ts            REST 风格端点        │
│  · 240–700ms 模拟网络延迟                          │
│  · HTTP 状态码语义（400 / 401 / 403 / 404 / 409）  │
│  · 库存与价格服务端权威校验、订单状态机             │
├───────────────────────────────────────────────────┤
│  src/server/db.ts             数据库层             │
│  · 表：users / tokens / orders / productMeta       │
│  · 内存缓存 + localStorage 持久化 + 种子数据        │
└───────────────────────────────────────────────────┘
```

### API 端点一览

| 端点 | 鉴权 | 说明 |
| --- | --- | --- |
| `POST /auth/register` | — | 注册新用户（邮箱查重、密码 ≥6 位），签发令牌 |
| `POST /auth/login` | — | 校验加盐口令散列，签发 7 天令牌 |
| `GET /auth/me` | ✔ | 令牌换取当前用户（脱敏，不下发哈希与盐） |
| `POST /auth/logout` | ✔ | 作废令牌 |
| `GET /products` | — | 在售商品列表（含实时库存） |
| `POST /orders` | ✔ | 创建订单：校验库存 / 上架状态 / 限购 → 扣减库存 → 核算运费 → 生成订单号 |
| `GET /orders/mine` | ✔ | 我的订单（时间倒序） |
| `GET /admin/orders` | 管理员 | 全部订单 |
| `PATCH /admin/orders/:id/status` | 管理员 | 按状态机推进 / 取消订单 |
| `PATCH /admin/products/:id/stock` | 管理员 | 调整库存（0–999 钳制） |
| `PATCH /admin/products/:id/sale` | 管理员 | 上架 / 下架切换 |
| `GET /admin/stats` | 管理员 | 订单数 / 销售额 / 待处理 / 售出件数 / 低库存预警 |

> 代码中以上端点与 `src/api/client.ts` 中 `api` 对象的方法一一对应。

### 种子数据与演示账号

| 账号 | 密码 | 角色 |
| --- | --- | --- |
| `admin@hearth.coffee` | `hearth2026` | 管理员（可进入管理后台） |

- 口令以**加盐散列**存储（演示级 FNV 变体，详见 `db.ts` 注释；生产环境应换用 bcrypt / argon2）
- 令牌 7 天有效，过期后任意鉴权请求触发 401，客户端清除令牌并全局登出
- 瑰夏红标种子库存刻意设为 **8 袋**，用于演示「仅剩 n 袋」稀缺态与售罄禁购流程

### 订单状态机

```
下单 ──▶ 待烘焙 ──▶ 已出炉 ──▶ 配送中 ──▶ 已完成
           │
           └──（管理员取消）──▶ 已取消
```

- 仅允许正向逐步推进，已完成 / 已取消为终态，违规变更返回 409
- 用户在「我的订单」看到的四段进度时间线与管理后台实时联动
- 建单时库存在服务端扣减：门店「现货」数实时刷新，归零即售罄禁购

### 替换为真实后端

只需将 `src/api/client.ts` 中各方法的实现改写为 `fetch(BASE_URL + path)`（方法签名已按 REST 语义设计），并移除 `src/server/` 目录，UI 层**零改动**。

## 📦 数据模型

```ts
interface Product {                 // src/data/products.ts（种子数据）
  id: string;
  name: string;                     // 中文名，如「耶加雪菲 · 科契尔 G1」
  en: string;                       // 英文名
  category: "单品" | "拼配" | "挂耳";
  origin: string;                   // 产地 / 处理厂
  process: string;                  // 处理法
  altitude: string;                 // 海拔
  roast: number;                    // 烘焙度 1（浅）— 5（深）
  weight: string;                   // 规格，如 "227 g"
  price: number;                    // 售价（¥）
  rating: number;                   // 评分
  reviews: number;                  // 评价数
  notes: string[];                  // 风味标签
  desc: string;                     // 详情描述
  badge?: string;                   // 角标（新到港 / 限量 / 招牌 / 低因 / 礼盒）
  image: string;                    // 产品图 URL
  profile: { acidity: number; sweetness: number; body: number }; // 风味强度 0–100
  brewTip: string;                  // 冲煮建议
}

interface SellableProduct extends Product { stock: number }      // 服务端合并实时库存

interface Order {                   // src/server/db.ts
  orderNo: string;                  // HRyyyymmdd-xxxx
  userId: string;  userName: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  subtotal: number;  shipping: number;  total: number;
  payment: string;
  contact: { name: string; phone: string; address: string };
  status: "roasting" | "baked" | "shipping" | "done" | "cancelled";
  createdAt: number;  updatedAt: number;
}
```

## 🔄 下单全流程说明

1. **登录闸口**：游客可自由浏览与加购；点击「去结算」时若未登录，弹出登录框，购物袋保留，登录后自动继续结算
2. **填写信息**：收货人 / 手机号（11 位校验）/ 地址（≥6 字校验），支付方式三选一（微信 / 支付宝 / 银行卡）
3. **服务端建单**：前端只提交 `productId + qty`；校验（库存 / 上架 / 限购）、价格核算、运费（¥8，满 ¥129 免邮）、库存扣减、订单号生成均在服务端完成，库存不足返回 409 并附原因
4. **下单成功**：返回 `HRyyyymmdd-xxxx` 订单号与实付金额，清空购物袋，门店库存即时刷新
5. **进度追踪**：「我的订单」四段时间线；管理员在后台推进状态后，用户刷新即可见

## 🖼 图片说明

产品图与主视觉由 AI 生成并托管于外部图床（URL 直链于 `src/data/products.ts` 与 `Hero.tsx`）。如需完全离线运行，可将图片下载至 `public/images/` 并替换对应 URL。

## 📝 许可与声明

- 本项目为**演示作品**，所有商品、价格、订单均为模拟数据
- 代码可自由学习使用；图片由 AI 生成，仅用于演示用途

---

<p align="center">用一炉火，换你清晨的<b>第一口</b> ☕</p>
