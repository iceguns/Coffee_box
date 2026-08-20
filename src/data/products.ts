export type Category = "单品" | "拼配" | "挂耳";

export interface Product {
  id: string;
  name: string;
  en: string;
  category: Category;
  origin: string;
  process: string;
  altitude: string;
  roast: number; // 1 浅 — 5 深
  weight: string;
  price: number;
  rating: number;
  reviews: number;
  notes: string[];
  desc: string;
  badge?: string;
  image: string;
  profile: { acidity: number; sweetness: number; body: number };
  brewTip: string;
}

export const ROAST_LABELS = ["浅烘", "中浅烘", "中烘", "中深烘", "深烘"] as const;
export const roastLabel = (r: number) => ROAST_LABELS[Math.min(4, Math.max(0, r - 1))];

export const CATEGORIES: Array<Category | "全部"> = ["全部", "单品", "拼配", "挂耳"];

export const FREE_SHIPPING_AT = 129;

export const PRODUCTS: Product[] = [
  {
    id: "yirgacheffe-g1",
    name: "耶加雪菲 · 科契尔 G1",
    en: "Ethiopia Yirgacheffe Kochere",
    category: "单品",
    origin: "埃塞俄比亚 · 科契尔处理厂",
    process: "水洗",
    altitude: "1,900 – 2,100 m",
    roast: 1,
    weight: "227 g",
    price: 88,
    rating: 4.9,
    reviews: 342,
    notes: ["茉莉花", "佛手柑", "柑橘", "红茶尾韵"],
    desc: "来自耶加雪菲核心产区科契尔的海拔水洗批次。入口是明亮的柑橘酸质与茉莉花香，中段浮现伯爵茶般的佛手柑气息，尾韵干净悠长，像清晨山谷里的一阵风。",
    badge: "新到港",
    image:
      "https://image.qwenlm.ai/generated-images/691db534-4b6d-41d0-b08a-2e6c3711c165/_result.png",
    profile: { acidity: 92, sweetness: 78, body: 48 },
    brewTip: "V60 手冲：15g 粉 / 225g 水 / 92℃ / 2:00，慢注保留花香。",
  },
  {
    id: "geisha-esmeralda",
    name: "翡翠庄园 · 瑰夏 红标",
    en: "Panama Geisha Esmeralda Red",
    category: "单品",
    origin: "巴拿马 · 波奎特 翡翠庄园",
    process: "慢速日晒",
    altitude: "1,600 – 1,800 m",
    roast: 1,
    weight: "100 g",
    price: 268,
    rating: 5.0,
    reviews: 128,
    notes: ["茉莉", "水蜜桃", "蜂蜜", "白葡萄酒"],
    desc: "传奇庄园的竞标级红标瑰夏，小批次慢速日晒让花果香层层叠叠地绽放。冷杯后蜜桃与蜂蜜的甜感愈发清晰，是值得郑重其事冲一杯的豆子。每炉限量 12 袋。",
    badge: "限量",
    image:
      "https://image.qwenlm.ai/generated-images/e3f1abf5-0a63-4622-a50e-3e1e0f73df07/_result.png",
    profile: { acidity: 88, sweetness: 95, body: 42 },
    brewTip: "建议杯测式慢饮：90℃ 水温、稍粗研磨，让花香完整展开。",
  },
  {
    id: "huila-cauca",
    name: "慧兰 · 考卡山谷",
    en: "Colombia Huila Cauca Valley",
    category: "单品",
    origin: "哥伦比亚 · 慧兰省",
    process: "水洗 · 双重发酵",
    altitude: "1,750 m",
    roast: 3,
    weight: "227 g",
    price: 78,
    rating: 4.7,
    reviews: 501,
    notes: ["焦糖", "榛果", "红苹果", "可可"],
    desc: "小农联盟的经典水洗慧兰，双重发酵带来更干净的杯面。焦糖与烤榛果的基底上跳着一丝红苹果的活泼酸质，无论手冲还是摩卡壶都稳得住，是可靠的口粮之选。",
    image:
      "https://image.qwenlm.ai/generated-images/85dedd24-e02a-46a5-a77a-9797380fbb54/_result.png",
    profile: { acidity: 62, sweetness: 82, body: 70 },
    brewTip: "万能适配：手冲、法压、摩卡壶皆可，中深段甜感更突出。",
  },
  {
    id: "dawn-blend-no7",
    name: "晨光拼配 No.7",
    en: "Dawn Blend No.7 Espresso",
    category: "拼配",
    origin: "埃塞俄比亚 + 巴西 日晒",
    process: "日晒 / 半水洗",
    altitude: "1,200 – 1,900 m",
    roast: 4,
    weight: "227 g",
    price: 68,
    rating: 4.8,
    reviews: 876,
    notes: ["黑巧克力", "烤坚果", "红糖", "橘皮"],
    desc: "店内出品量最大的意式基底：日晒埃塞提供花果与甜感，巴西日晒撑起醇厚度与油脂。做成拿铁是浓郁的黑巧与烤坚果，加一勺红糖就是店里招牌的「炉火拿铁」。",
    badge: "招牌",
    image:
      "https://image.qwenlm.ai/generated-images/7f5fd6ad-30f4-4aaa-987b-b9249f15d95e/_result.png",
    profile: { acidity: 38, sweetness: 74, body: 90 },
    brewTip: "意式：18g 粉萃 36g 液 / 25–28s；配奶首选，直饮也顺口。",
  },
  {
    id: "dusk-decaf",
    name: "暮色 · 甘蔗低因",
    en: "Dusk Decaf Sugarcane EA",
    category: "拼配",
    origin: "哥伦比亚 · 慧兰",
    process: "甘蔗醋酸脱因",
    altitude: "1,650 m",
    roast: 3,
    weight: "227 g",
    price: 72,
    rating: 4.6,
    reviews: 289,
    notes: ["牛奶巧克力", "杏仁", "太妃糖"],
    desc: "以天然甘蔗醋酸温和脱因，保留了绝大部分甜感与醇厚度。牛奶巧克力与太妃糖的圆润口感，适合深夜想喝一杯又不想失眠的时刻——暮色四合，炉火正温。",
    badge: "低因",
    image:
      "https://image.qwenlm.ai/generated-images/b4e0c89d-34c3-4fe7-9654-6a1831c0d1c5/_result.png",
    profile: { acidity: 30, sweetness: 80, body: 76 },
    brewTip: "93℃ 略高水温能更好释出甜感，晚间手冲与拿铁皆宜。",
  },
  {
    id: "drip-four-seasons",
    name: "挂耳 · 四季礼盒",
    en: "Drip Bag · Four Seasons Box",
    category: "挂耳",
    origin: "四产区精选拼配",
    process: "水洗 / 日晒",
    altitude: "—",
    roast: 3,
    weight: "10 g × 12 包",
    price: 98,
    rating: 4.8,
    reviews: 640,
    notes: ["春·花香", "夏·莓果", "秋·坚果", "冬·黑巧"],
    desc: "以四个季节命名的十二包挂耳：春樱、夏涧、秋栗、冬炉各三包，从浅烘到深烘一次喝遍。附手冲注水卡与胡桃木封口夹，办公室、差旅或送人都体面。",
    badge: "礼盒",
    image:
      "https://image.qwenlm.ai/generated-images/7336b904-177e-4c9d-946b-ccd74fd900d5/_result.png",
    profile: { acidity: 55, sweetness: 68, body: 62 },
    brewTip: "200ml 热水分三段注入，闷蒸 20s 风味更佳。",
  },
];
