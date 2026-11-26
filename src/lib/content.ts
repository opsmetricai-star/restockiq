// Central content model. Structure mirrors the reference site's information architecture;
// all wording is original to RestockIQ.

export const BRAND = "RestockIQ";

export type Solution = { slug: string; title: string; group: string; summary: string; outcome: string };

export const SOLUTION_GROUPS = [
  "Demand Planning",
  "Manufacturing Planning",
  "Inventory & Replenishment",
  "Fresh Operations",
  "Retail Operations",
  "Space & Assortment",
  "Pricing & Promotions",
  "Strategic Planning",
  "Diagnostics",
  "Collaboration",
] as const;

export const SOLUTIONS: Solution[] = [
  { slug: "demand-planning-software", title: "Demand planning", group: "Demand Planning", summary: "Statistical and machine-learning forecasts at every product, location and channel level, blended with planner judgement.", outcome: "Higher forecast accuracy with less manual rework" },
  { slug: "demand-sensing-software", title: "Demand sensing", group: "Demand Planning", summary: "Short-horizon signals such as weather, local events and point-of-sale shifts sharpen the near-term forecast daily.", outcome: "Faster reaction to changes in real demand" },
  { slug: "retail-connected-planning-for-manufacturers", title: "Retail connected planning for manufacturers", group: "Demand Planning", summary: "Bring retailer sell-out and stock data into manufacturer plans so production follows what shoppers actually buy.", outcome: "Plans anchored in shelf reality" },
  { slug: "master-planning", title: "Master planning", group: "Manufacturing Planning", summary: "Balance supply capacity and demand across plants, tiers and suppliers in a single constrained plan.", outcome: "Feasible plans, fewer expedites" },
  { slug: "production-scheduling-software", title: "Production scheduling", group: "Manufacturing Planning", summary: "Sequence production runs against line capacity, changeovers, shelf-life and material availability.", outcome: "Higher line utilisation with lower waste" },
  { slug: "distribution-planning-software", title: "Distribution planning", group: "Manufacturing Planning", summary: "Plan transport and distribution-centre flows with visibility from supplier dock to store door.", outcome: "Lower logistics cost per unit" },
  { slug: "supply-chain-collaboration-software", title: "Supply chain collaboration", group: "Collaboration", summary: "Share forecasts, orders and inventory positions with suppliers and customers through governed portals.", outcome: "One version of the truth across partners" },
  { slug: "inventory-planning-software", title: "End-to-end inventory planning", group: "Inventory & Replenishment", summary: "Set targets, safety stock and reorder points for every node in the network from a single optimization engine.", outcome: "Less capital tied up, higher availability" },
  { slug: "fresh-inventory-software", title: "Fresh inventory", group: "Inventory & Replenishment", summary: "Plan perishable stock with shelf-life aware ordering, allocation and waste-minimising policies.", outcome: "Less spoilage, fuller shelves" },
  { slug: "automatic-replenishment-system", title: "Automatic replenishment and allocation", group: "Inventory & Replenishment", summary: "Generate store and warehouse orders automatically, with exceptions routed to planners only when judgement is needed.", outcome: "Touchless ordering at scale" },
  { slug: "omnichannel-supply-chain-software", title: "Channel planning", group: "Inventory & Replenishment", summary: "Plan stock across stores, e-commerce and marketplaces with channel-specific service targets.", outcome: "Right stock in every channel" },
  { slug: "planner-diagnostics-solution", title: "Planner diagnostics", group: "Diagnostics", summary: "Pinpoint why forecasts or inventory drifted off target and which planning decisions to revisit.", outcome: "Faster root-cause analysis" },
  { slug: "diagnostics", title: "Diagnostics", group: "Diagnostics", summary: "Continuous monitoring of forecast quality, service level and stock health across the whole portfolio.", outcome: "Problems found before customers feel them" },
  { slug: "fresh-expiration-management", title: "Fresh expiration management", group: "Fresh Operations", summary: "Track expiry dates by batch and trigger markdowns, transfers or donations before value is lost.", outcome: "Reduced write-offs" },
  { slug: "fresh-markdowns", title: "Fresh markdowns", group: "Fresh Operations", summary: "Dynamic markdown recommendations timed to clear short-life products while protecting margin.", outcome: "Margin-aware clearance" },
  { slug: "fresh-recipe-management", title: "Fresh recipe management", group: "Fresh Operations", summary: "Explode prepared-food demand into ingredient requirements using recipe and yield data.", outcome: "Accurate ingredient ordering" },
  { slug: "fresh-store-ordering", title: "Fresh store ordering", group: "Fresh Operations", summary: "Daily store order proposals tuned to freshness windows, delivery cut-offs and local demand.", outcome: "Fresh ordering in minutes, not hours" },
  { slug: "in-store-production-planning", title: "In-store production planning", group: "Fresh Operations", summary: "Tell bakeries, delis and kitchens what to produce, when and how much, hour by hour.", outcome: "Right quantities, right time" },
  { slug: "workload-forecasting-software", title: "Workload forecasting", group: "Retail Operations", summary: "Translate sales and deliveries into labour hours by task and department for smarter rostering.", outcome: "Staffing matched to the work" },
  { slug: "store-execution-software", title: "Store execution", group: "Retail Operations", summary: "Mobile task lists and alerts that put planning decisions into practice on the shop floor.", outcome: "Plans executed, not just published" },
  { slug: "predictive-inventory", title: "Predictive inventory", group: "Retail Operations", summary: "Estimate real on-hand stock from sales and receipt patterns to expose phantom inventory.", outcome: "Trustworthy stock records" },
  { slug: "assortment-planning-software", title: "Assortment planning", group: "Space & Assortment", summary: "Decide which products belong in which stores using demand transference and local preferences.", outcome: "Ranges that fit the local shopper" },
  { slug: "planogram-software", title: "Planogram optimization", group: "Space & Assortment", summary: "Automatically build shelf layouts that balance sales, margin, facings and supply constraints.", outcome: "Productive shelf space" },
  { slug: "retail-floor-planning-software", title: "Retail floor planning", group: "Space & Assortment", summary: "Design floor layouts and fixture allocation with category adjacency and traffic patterns in mind.", outcome: "Better store flow, higher basket size" },
  { slug: "deal-management", title: "Deal management", group: "Pricing & Promotions", summary: "Track supplier funding, trade deals and promotional agreements in one system of record.", outcome: "Funding captured, not forgotten" },
  { slug: "price-optimization-software", title: "Price optimization", group: "Pricing & Promotions", summary: "Elasticity-driven price recommendations constrained by brand rules, competitors and margin goals.", outcome: "Profit-protecting price moves" },
  { slug: "promotion-planning-software", title: "Promotion planning", group: "Pricing & Promotions", summary: "Forecast promotional lift and cannibalisation, then plan stock to match before the campaign starts.", outcome: "Promotions that pay for themselves" },
  { slug: "markdown-pricing-and-optimization-software", title: "Seasonal planning", group: "Pricing & Promotions", summary: "Plan seasonal buys and markdown cadence to exit the season with minimal leftover stock.", outcome: "Clean season exits" },
  { slug: "integrated-business-planning", title: "Integrated Business Planning (IBP)", group: "Strategic Planning", summary: "Align commercial, operational and financial plans in a single monthly cycle with scenario comparison.", outcome: "One plan the whole business owns" },
  { slug: "soe-and-sop-software", title: "S&OE and S&OP", group: "Strategic Planning", summary: "Connect sales and operations planning with weekly execution so deviations are corrected quickly.", outcome: "Strategy and execution in step" },
  { slug: "mfp-otb", title: "MFP/OTB", group: "Strategic Planning", summary: "Merchandise financial planning and open-to-buy controls tied directly to forecasts and inventory.", outcome: "Buying budgets grounded in demand" },
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
  { href: "/platform", title: "Platform", desc: "One planning platform from supplier to shelf" },
  { href: "/platform/artificial-intelligence", title: "Artificial Intelligence", desc: "Built-in machine learning and agentic AI" },
  { href: "/platform/data-management", title: "Data Management", desc: "A governed data foundation for every plan" },
  { href: "/platform/integrations", title: "Integrations", desc: "Connect ERP, POS, WMS and e-commerce data" },
  { href: "/platform/meet-the-agents", title: "Meet the Agents", desc: "AI agents that act on planning exceptions" },
  { href: "/platform/sustainability", title: "Sustainability", desc: "Cut waste and emissions through better planning" },
  { href: "/platform/unified-merchandising", title: "Unified Merchandising", desc: "Range, price, promote and replenish together" },
];

export const COMPANY_LINKS = [
  { href: "/company/about", title: "About us" },
  { href: "/company/collaboration", title: "Collaboration" },
  { href: "/company/contact", title: "Contact info" },
  { href: "/company/in-the-news", title: "In the news" },
  { href: "/company/leadership", title: "Leadership" },
  { href: "/company/media", title: "Media" },
  { href: "/company/sustainability", title: "Sustainability" },
];

export const CAREER_LINKS = [
  { href: "/careers", title: "Careers overview" },
  { href: "/careers/customer-operations", title: "Customer operations" },
  { href: "/careers/marketing", title: "Marketing" },
  { href: "/careers/operational-functions", title: "Operational functions" },
  { href: "/careers/product-technology", title: "Product & technology" },
  { href: "/careers/sales", title: "Sales" },
  { href: "/careers/people-stories", title: "People stories" },
];

export const TOP_LINKS = [
  { href: "/community", title: "Community" },
  { href: "/partners", title: "Partners" },
  { href: "/analysts", title: "Analysts" },
  { href: "/events", title: "Events" },
  { href: "/news", title: "News" },
];

export type Guide = { slug: string; title: string; summary: string; type: "Guide" | "Report" | "Video" };
export const GUIDES: Guide[] = [
  { slug: "how-to-build-a-better-diy-supply-chain", title: "Build a better DIY and home improvement supply chain", type: "Guide", summary: "How long-tail assortments, seasonality and project-driven demand reshape replenishment in home improvement." },
  { slug: "business-case-development-for-supply-chain-technology-investment", title: "Business case development for supply chain technology investment", type: "Guide", summary: "A practical framework to quantify benefits, cost and risk before committing to planning software." },
  { slug: "category-management", title: "Category management: develop and execute a customer-first product strategy", type: "Guide", summary: "Roles, data and decision rhythms that turn category plans into shelf results." },
  { slug: "demand-forecasting", title: "Demand forecasting for retail and consumer goods", type: "Guide", summary: "Methods, data inputs and governance behind accurate forecasts at SKU-location level." },
  { slug: "demand-planning", title: "Demand planning: key features and best practices", type: "Guide", summary: "What strong demand planning looks like across process, people and technology." },
  { slug: "inventory-planning", title: "How to take inventory planning to the next level", type: "Guide", summary: "Move from static min/max rules to dynamic, service-level driven inventory policies." },
  { slug: "machine-learning-in-retail-demand-forecasting", title: "Machine learning in retail demand forecasting", type: "Guide", summary: "Where machine learning beats classical methods, and where simple models still win." },
  { slug: "measuring-forecast-accuracy", title: "Measuring forecast accuracy", type: "Guide", summary: "WAPE, bias, FVA and when to use each metric." },
  { slug: "retail-promotion-optimization", title: "Promotion optimization: maximizing results", type: "Guide", summary: "Lift, cannibalisation and halo effects explained for promotion planners." },
  { slug: "promotion-planning-optimization-how-to-build-a-case-for-technology-investment", title: "Promotion planning & optimization: building a case for technology", type: "Guide", summary: "Quantifying the profit upside of better promotion decisions." },
  { slug: "retail-space-planning-technology-business-case", title: "Retail space planning: building a business case", type: "Guide", summary: "Linking planogram and floor decisions to sales density and labour savings." },
  { slug: "supply-chain-planning", title: "Supply chain planning: the key to optimizing the end-to-end value chain", type: "Guide", summary: "How connected planning removes silos between demand, supply and inventory." },
  { slug: "inventory-planning-software", title: "The best inventory planning software: AI-powered, planner-driven", type: "Guide", summary: "Evaluation criteria for inventory planning platforms." },
  { slug: "wholesale-supply-chain", title: "Wholesale supply chain optimization: benefits, challenges, & tips", type: "Guide", summary: "Managing thin margins, long lead times and multi-channel demand in wholesale." },
];

export const FEATURED_RESOURCES = [
  { type: "Guide", title: "From knowing to doing: how planning agents close the gap in retail planning", desc: "See how agents turn insight into action, from inventory to promotion optimization.", href: "/resources" },
  { type: "Report", title: "State of Supply Chain: volatility, trade-offs and the rise of AI", desc: "Why most planning leaders stay optimistic even as disruption and demand volatility reshape the job.", href: "/resources" },
  { type: "Video", title: "Connecting pricing and promotions planning with AI", desc: "A walkthrough of unifying price optimization and promotion planning to protect margin.", href: "/resources" },
];

export const TESTIMONIALS = [
  { quote: "We picked RestockIQ for its depth in home improvement and for how adaptable the inventory engine is. The automation and the dashboards are what our planners talk about most.", name: "Avery Collins", role: "SVP, Inventory, Replenishment and Planning", org: "Northline Home Supply" },
  { quote: "The biggest win is that the platform bends to our processes, not the other way round. We configure it to how we work instead of rebuilding how we work around the software.", name: "Jonas Keller", role: "Director of Supply Chain", org: "Brightmarkt Drogerie" },
  { quote: "Machine-learning forecasts are critical for our hardest categories, whether short-shelf-life items or products driven by weather. It is the bedrock of our growth plans.", name: "Rhys Ellison", role: "Head of Supply Chain", org: "Corner & Co Convenience" },
  { quote: "Culture matters when you pick a supplier and a system. We found a partner who understood us at every level, from the planners to the leadership team.", name: "Elin Berglund", role: "Business and IT Development Manager", org: "Nordhandel Grocery" },
  { quote: "It gave our analysts insight into their whole business in one place. It was easy to learn, and word spread across the floor about how simple it was to use.", name: "Maya Brennan", role: "VP, Inventory Management", org: "Daily Dollar Stores" },
];

export const CUSTOMER_LOGOS = ["Northline", "Brightmarkt", "Corner&Co", "Nordhandel", "Daily Dollar", "Hartwell", "PetPlus", "Kestrel Foods", "Alderwood", "Meridian Pharma"];

export const PLANS = [
  { id: "starter", name: "Starter", price: 47, href: "https://selar.com/47plan?currency=USD", skus: 500, forecasts: 20, ai: 50, blurb: "For single-location sellers getting off spreadsheets.", features: ["Up to 500 SKUs", "20 forecast runs / month", "50 AI insights / month", "CSV import & export", "Reorder suggestions", "Email support"] },
  { id: "growth", name: "Growth", price: 57, href: "https://selar.com/57plan?currency=USD", skus: 2500, forecasts: 100, ai: 250, blurb: "For growing teams that replenish across multiple locations.", features: ["Up to 2,500 SKUs", "100 forecast runs / month", "250 AI insights / month", "Purchase order drafts", "Multi-location inventory", "Priority support"], popular: true },
  { id: "scale", name: "Scale", price: 97, href: "https://selar.com/97plan?currency=USD", skus: 10000, forecasts: 500, ai: 1000, blurb: "For operations that need volume, automation and AI planning.", features: ["Up to 10,000 SKUs", "500 forecast runs / month", "1,000 AI insights / month", "AI planning assistant", "Team seats & roles", "Dedicated onboarding"] },
] as const;

export type PlanId = (typeof PLANS)[number]["id"] | "free";
export const FREE_LIMITS = { skus: 25, forecasts: 3, ai: 5 };

export const LEGAL_PAGES: Record<string, string> = {
  "privacy-policy": "Privacy Policy",
  "terms-of-use": "Terms of Use",
  "code-of-conduct": "Code of Conduct",
  "corporate-responsibility": "Corporate Responsibility",
  "environmental": "Environmental Policy",
  "modern-slavery-statement": "Modern Slavery Statement",
  "anti-bribery-anti-corruption": "Anti-Bribery & Anti-Corruption Policy",
  "whistleblowing": "Whistleblowing Policy",
  "ai-governance-trust": "AI Governance & Trust",
  "infosec-faq": "Information Security FAQ",
  "vulnerability-disclosure": "Report a vulnerability",
  "privacy-trust-center": "Privacy Trust Center",
  "security-compliance": "Security Compliance",
};
