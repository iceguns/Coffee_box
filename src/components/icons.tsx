import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P): P => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const IconBean = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3c4.4 0 7 3.8 7 9s-2.6 9-7 9-7-3.8-7-9 2.6-9 7-9Z" />
    <path d="M12 3c-2.2 3-2.2 6 0 9s2.2 6 0 9" />
  </svg>
);

export const IconBeanSolid = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 3c4.4 0 7 3.8 7 9s-2.6 9-7 9-7-3.8-7-9 2.6-9 7-9Z" />
    <path
      d="M12 3c-2.2 3-2.2 6 0 9s2.2 6 0 9"
      stroke="var(--color-espresso-950)"
      strokeWidth="1.6"
      fill="none"
    />
  </svg>
);

export const IconBag = (p: P) => (
  <svg {...base(p)}>
    <path d="M5.5 8h13l-.9 11.2a1.8 1.8 0 0 1-1.8 1.65H8.2a1.8 1.8 0 0 1-1.8-1.66L5.5 8Z" />
    <path d="M8.5 10.5V6.8a3.5 3.5 0 0 1 7 0v3.7" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.4-3.4" />
  </svg>
);

export const IconX = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const IconFlame = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3s1 2.4 1 4.2c1.6-.6 3-2 3-2 .6 1.6 3 4.5 3 8A7 7 0 0 1 5 13c0-2.6 1.4-4.4 2.7-5.8C8.9 6 10 4.6 12 3Z" />
    <path d="M12 21a3.2 3.2 0 0 1-3.2-3.2c0-1.9 1.6-3 3.2-4.6 1.6 1.6 3.2 2.7 3.2 4.6A3.2 3.2 0 0 1 12 21Z" />
  </svg>
);

export const IconLeaf = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 19c0-8 5-14 16-15-.5 11-6 15-13 15" />
    <path d="M4 19c2.5-5 6.5-8.5 11-10.5" />
  </svg>
);

export const IconArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);

export const IconArrowDown = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v16m-6-6 6 6 6-6" />
  </svg>
);

export const IconArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const IconStar = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8L12 2.8Z" />
  </svg>
);

export const IconTrash = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 6.5h15M9.5 6V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3V6.5" />
    <path d="M6.5 6.5 7.3 19a1.8 1.8 0 0 0 1.8 1.7h5.8a1.8 1.8 0 0 0 1.8-1.7l.8-12.5" />
    <path d="M10 10.5v6m4-6v6" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 5 5L19.5 7" />
  </svg>
);

export const IconTruck = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2.2" />
  </svg>
);

export const IconMountain = (p: P) => (
  <svg {...base(p)}>
    <path d="m3 19 6-10 3.4 5.4L15 10l6 9H3Z" />
    <path d="m8 10.8 1 1.7" />
  </svg>
);

export const IconDrop = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5s6 6.6 6 10.7a6 6 0 0 1-12 0C6 10.1 12 3.5 12 3.5Z" />
    <path d="M9.5 14a2.6 2.6 0 0 0 2 2.5" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-6-7-11.2a7 7 0 0 1 14 0C19 15 12 21 12 21Z" />
    <circle cx="12" cy="9.6" r="2.6" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const IconSpinner = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);

export const IconWechat = (p: P) => (
  <svg {...base(p)}>
    <path d="M9.5 4.5C5.9 4.5 3 6.9 3 9.9c0 1.7 1 3.2 2.4 4.2L4.7 16l2.3-1.2c.8.3 1.6.4 2.5.4h.4a5.4 5.4 0 0 1-.2-1.5c0-2.9 2.7-5.3 6-5.3h.4c-.6-2.3-3.1-3.9-6.6-3.9Z" />
    <path d="M21 13.6c0-2.4-2.4-4.4-5.3-4.4S10.3 11.2 10.3 13.6s2.4 4.4 5.4 4.4c.7 0 1.3-.1 1.9-.3l1.9 1-.6-1.7c1.3-.8 2.1-2 2.1-3.4Z" />
  </svg>
);

export const IconAlipay = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M6.5 10.5h11M12 6.5v4m-3.6 0c0 3 1.4 5.3 3.6 6.6 1.9-1.1 3.3-2.8 3.7-5.2" />
  </svg>
);

export const IconCard = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M6.5 14.5h4" />
  </svg>
);

/** 品牌标：豆形 + 中缝 + 火苗 */
export const BrandMark = (p: P) => (
  <svg viewBox="0 0 40 40" fill="none" aria-hidden {...p}>
    <path
      d="M20 6c5.8 0 10 5.3 10 14s-4.2 14-10 14S10 28.7 10 20 14.2 6 20 6Z"
      stroke="currentColor"
      strokeWidth="2.4"
    />
    <path
      d="M20 6c-3 4.2-3 8.4 0 12.6s3 8.4 0 12.6"
      stroke="currentColor"
      strokeWidth="2.4"
    />
    <circle cx="20" cy="19.5" r="2.4" fill="#d68f3f" stroke="none" />
  </svg>
);
