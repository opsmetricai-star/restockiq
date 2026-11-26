// Central content model. Structure mirrors the reference site's information architecture;
// all wording is original to RestockIQ.

export const BRAND = "RestockIQ";

export type Solution = { slug: string; title: string; group: string; summary: string; outcome: string };

export const SOLUTION_GROUPS = ["Demand", "Inventory", "Procurement", "Intelligence"] as const;

export const SOLUTIONS: Solution[] = [
  { slug: "demand-planning-software", title: "Demand forecasting", group: "Demand", summary: "Models learn the demand pattern of every SKU, backtest competing methods on your own history, and commit to the one with the lowest error.", outcome: "Fewer stockouts and less excess stock from forecasts that are measured, not assumed" },
  { slug: "inventory-planning-software", title: "Inventory optimization", group: "Inventory", summary: "The engine converts forecast uncertainty and supplier lead time into safety stock and reorder points for each SKU, set against the service level you choose.", outcome: "Working capital released without sacrificing availability" },
  { slug: "automatic-replenishment-system", title: "Automated replenishment", group: "Inventory", summary: "RestockIQ monitors inventory position against reorder points and generates the exact order quantity, rounded to supplier minimums.", outcome: "Replenishment decisions made continuously instead of in weekly spreadsheet reviews" },
  { slug: "purchase-order-automation", title: "Purchase order automation", group: "Procurement", summary: "Recommended orders are grouped by supplier into draft purchase orders. Receiving an order updates stock automatically.", outcome: "Shorter path from signal to supplier order" },
  { slug: "planner-diagnostics-solution", title: "AI planning analyst", group: "Intelligence", summary: "A Gemini-powered analyst reads your live forecasts and stock positions, ranks the risks, and recommends the next action for each. Every figure it cites comes from the planning engine.", outcome: "Faster, better-informed decisions for every planner on the team" },
];

export type IndustryNode = { slug: string; title: string; children?: { slug: string; title: string }[] };
export const INDUSTRIES: IndustryNode[] = [
  { slug: "retail", title: "Retail", children: [
    { slug: "convenience-stores", title: "Convenience" },
    { slug: "diy-home-improvement", title: "DIY and home improvement" },
    { slug: "electronics", title: "Electronics retailers" },
    { slug: "general-merchandise-discount", title: "General merchandise and discount" },
    { slug: "grocery", title: "Grocery" },
    { slug: "health-beauty-pharmacy", title: "Health, beauty, and pharmacy" },
    { slug: "specialty", title: "Specialty retailers" },
  ]},
  { slug: "wholesale-distribution", title: "Wholesale & distribution", children: [
    { slug: "automotive-parts", title: "Automotive parts and tools" },
    { slug: "construction-technical-trade", title: "Building, construction and technical trade" },
    { slug: "grocery-foodservice", title: "Grocery and foodservice" },
    { slug: "pharmaceutical", title: "Pharmaceutical" },
  ]},
  { slug: "cpg-manufacturing", title: "Manufacturing", children: [
    { slug: "apparel-and-footwear", title: "Apparel and footwear" },
    { slug: "baked-goods", title: "Baked goods" },
    { slug: "beverage-brands", title: "Beverage consumer brands" },
    { slug: "dairy-processors", title: "Dairy processors" },
    { slug: "fresh-food", title: "Fresh and shelf-stable food manufacturers" },
    { slug: "beauty-personal-home-care", title: "Beauty, personal, home care" },
    { slug: "home-living-brands", title: "Home and living" },
    { slug: "industrial-manufacturing", title: "Industrial manufacturing" },
    { slug: "meat-processors", title: "Meat, poultry, and fish processors" },
  ]},
  { slug: "lifestyle", title: "RestockIQ Lifestyle", children: [
    { slug: "accessories", title: "Accessories" },
    { slug: "beauty-cosmetics", title: "Beauty and cosmetics" },
    { slug: "fashion-and-apparel", title: "Fashion and apparel" },
    { slug: "furniture-and-home", title: "Furniture and home" },
    { slug: "sport-and-outdoor", title: "Sport and outdoor" },
  ]},
];

export const PLATFORM_LINKS = [
  { href: "/platform", title: "Platform", desc: "One AI engine for forecasting, inventory and replenishment" },
  { href: "/platform/artificial-intelligence", title: "Artificial Intelligence", desc: "Models that forecast, decide and explain" },
  { href: "/platform/data-management", title: "Data Management", desc: "Validated, isolated and auditable planning data" },
];


export const PLANS = [
  { id: "starter", name: "Starter", price: 47, href: "https://selar.com/47plan?currency=USD", skus: 500, forecasts: 20, ai: 50, blurb: "For teams replacing spreadsheet replenishment.", features: ["Up to 500 SKUs", "20 forecast runs per month", "50 AI analyses per month", "CSV import and export", "Purchase order automation"] },
  { id: "growth", name: "Growth", price: 57, href: "https://selar.com/57plan?currency=USD", skus: 2500, forecasts: 100, ai: 250, blurb: "For operations managing a broad, fast-moving catalogue.", features: ["Up to 2,500 SKUs", "100 forecast runs per month", "250 AI analyses per month", "CSV import and export", "Purchase order automation"], popular: true },
  { id: "scale", name: "Scale", price: 97, href: "https://selar.com/97plan?currency=USD", skus: 10000, forecasts: 500, ai: 1000, blurb: "For high-volume catalogues that plan continuously.", features: ["Up to 10,000 SKUs", "500 forecast runs per month", "1,000 AI analyses per month", "CSV import and export", "Purchase order automation"] },
] as const;

export type PlanId = (typeof PLANS)[number]["id"] | "free";
export const FREE_LIMITS = { skus: 25, forecasts: 3, ai: 5 };

export const LEGAL_PAGES: Record<string, string> = {
  "privacy-policy": "Privacy Policy",
  "terms-of-use": "Terms of Use",
};
