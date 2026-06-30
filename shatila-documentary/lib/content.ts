/* ============================================================
   Shatila documentary — content source of truth.
   All copy is drawn from the real project. Metrics are explicitly
   tagged: "actual" (stated by client), "research" (industry-backed),
   or "projected" (design target / assumption, not yet measured).
   ============================================================ */

export type MetricKind = "actual" | "research" | "projected";

export const sections = [
  { id: "hero", label: "Open" },
  { id: "summary", label: "Summary" },
  { id: "story", label: "Story" },
  { id: "context", label: "Context" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "competitive", label: "Competitors" },
  { id: "stakeholders", label: "Roles" },
  { id: "journey", label: "Journey" },
  { id: "insights", label: "Insights" },
  { id: "principles", label: "Principles" },
  { id: "ia", label: "Architecture" },
  { id: "flows", label: "Flows" },
  { id: "decisions", label: "Decisions" },
  { id: "features", label: "Features" },
  { id: "admin", label: "Admin" },
  { id: "ai", label: "AI" },
  { id: "accessibility", label: "Ethics" },
  { id: "system", label: "Design System" },
  { id: "prototype", label: "Prototype" },
  { id: "tech", label: "Tech" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
  { id: "roadmap", label: "Roadmap" },
  { id: "takeaways", label: "End" },
];

export const hero = {
  kicker: "Shatila Bakery Factory · Staff & Admin Dashboard · UX/UI Case Study",
  // three-line "mega" banner headline — normal / accent / ghost-outline
  headline: [
    { text: "When a 45-year-old", kind: "normal" as const, hl: "45-year-old" },
    { text: "factory runs on", kind: "accent" as const },
    { text: "memory alone.", kind: "ghost" as const },
  ],
  lede: "Shatila Bakery has operated in Dearborn, Michigan since 1979 — producing Lebanese and Middle Eastern sweets for one of the largest Arab-American communities in the United States. Every order, every production instruction, every delivery: managed entirely through phone calls, paper notes, and the memory of a small, trusted team. This is the case study of designing their first digital system.",
  meta: [
    { k: "Role", v: "UI/UX Designer" },
    { k: "Tools", v: "Figma Make · React · Tailwind · Framer Motion" },
    { k: "Status", v: "Active Project" },
    { k: "Location", v: "Dearborn, Michigan, USA" },
  ],
};

// curated chapter links for the sub-nav (matches existing case-study style)
export const subnav = [
  { id: "summary", label: "Summary" },
  { id: "story", label: "Story" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "competitive", label: "Competitors" },
  { id: "stakeholders", label: "Roles" },
  { id: "journey", label: "Journey" },
  { id: "insights", label: "Insights" },
  { id: "principles", label: "Principles" },
  { id: "decisions", label: "Decisions" },
  { id: "features", label: "Features" },
  { id: "ai", label: "AI" },
  { id: "system", label: "Design System" },
  { id: "prototype", label: "Prototype" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
];

export const summary = {
  overview:
    "Shatila is not a small bakery. It is a custom-order sweets factory — producing large quantities of baklava, maamoul, knafeh and traditional pastries to order for weddings, religious celebrations, community events and institutional supply across Michigan and beyond. Every order is different. Every order is personal. And until this project, every order was managed entirely without a screen.",
  challenge:
    "Christmas was coming, orders were getting lost, and nobody could see what was happening. The manual phone-and-paper workflow that had worked reliably for decades was buckling under seasonal volume — and the stakeholder needed management visibility before the peak hit.",
  outcome:
    "A digital operating system — a Staff dashboard (~52 screens) and an AI-driven Admin dashboard (~28 screens) on one shared design system — that captures every order digitally, makes status visible at every stage, and gives the whole team a single source of truth.",
  facts: [
    { k: "Business", v: "Custom-order sweets factory" },
    { k: "Founded", v: "Dearborn, MI · since 1979" },
    { k: "Order type", v: "Large-quantity, custom B2C" },
    { k: "Team", v: "Under 10 people, overlapping roles" },
  ],
};

export const story = {
  beats: [
    {
      kicker: "The call",
      text: "The stakeholder didn't arrive with a feature list. They arrived with a problem — and a deadline. Christmas was approaching, the highest-volume, highest-stress, most failure-prone time of their year.",
    },
    {
      kicker: "Forty-five years on memory",
      text: "Every order, every production instruction, every delivery had been managed through phone calls, paper notes, and the memory of a small, trusted team. It worked — for decades. Until it couldn't.",
    },
    {
      kicker: "The breaking point",
      text: "A process that reliably handled 30 orders a week broke down under 100. Not because the team worked differently — because the process had no capacity to scale. Orders fell through the gap between being recorded and being acted on.",
    },
    {
      kicker: "Why it mattered",
      text: "This was not a redesign. There was no prior system to improve, no analytics to review. The only reference was the people — and a 45-year reputation built entirely on getting custom orders right.",
    },
  ],
};

export const context = {
  lead: "Shatila has operated in Dearborn, Michigan since 1979 — producing Lebanese and Middle Eastern sweets for one of the largest Arab-American communities in the United States.",
  body: "Their customers come for weddings, religious celebrations, community events and institutional supply. The business runs on relationships and trust as much as on recipes. A digital system couldn't feel foreign or corporate — it had to formalize what already worked, not replace it with something the team wouldn't recognize.",
  pillars: [
    { k: "45 years", v: "Operating since 1979" },
    { k: "Dearborn, MI", v: "Heart of the Arab-American community" },
    { k: "Custom", v: "Every order bespoke, every order personal" },
    { k: "Trust", v: "Reputation built on getting it right" },
  ],
};

export const problem = {
  statement:
    "The biggest problem was not any individual task being difficult. It was that nobody could know what state the operation was in at any given moment.",
  painPoints: [
    {
      n: "01",
      title: "Orders getting lost",
      text: "During peak season, orders taken by phone fell through the gap between being recorded and being acted on. A busy day meant some orders simply never made it to production.",
    },
    {
      n: "02",
      title: "No visibility across the operation",
      text: "Management had no way to see the status of all active orders at once. The only method was to physically walk to each team and ask. During Christmas volume, that was impossible.",
    },
    {
      n: "03",
      title: "Too slow for peak volume",
      text: "The system that reliably handled 30 orders a week broke down under 100. Not because the team changed — because the process had no capacity to scale.",
    },
    {
      n: "04",
      title: "Details getting wrong between staff",
      text: "Custom specs — quantities, flavour variations, packaging, delivery instructions — were passed verbally. By the time they reached the baker, critical details were missing, assumed, or wrong.",
    },
  ],
};

export const research = {
  lead: "With no existing system or documentation to audit, direct conversations with the stakeholder became the primary research method — reconstructing how the factory actually works, order by order, and triangulating it against the wider category.",
  methods: [
    {
      tag: "01",
      name: "Client interviews",
      detail:
        "Multiple working conversations with the Shatila stakeholder, happening alongside design — the most important research of the project.",
      sources: "Direct stakeholder, across the engagement",
    },
    {
      tag: "02",
      name: "Workflow reconstruction",
      detail:
        "Mapped the full order lifecycle from intake to delivery, stage by stage, to find exactly where information breaks.",
      sources: "Synthesised from interviews",
    },
    {
      tag: "03",
      name: "Competitive audit",
      detail:
        "Reviewed BakeSmart, MarketMan, Craftybase and Katana MRP against the specific needs of a custom-order factory.",
      sources: "Product trials, docs, pricing pages",
    },
    {
      tag: "04",
      name: "Forum research",
      detail:
        "Read how small bakeries and makers describe their operational pain in their own words.",
      sources: "Reddit r/smallbusiness, r/bakery · Capterra + G2 reviews",
    },
    {
      tag: "05",
      name: "Secondary research",
      detail:
        "Digitalisation studies and small-team software adoption research to ground the design in evidence.",
      sources: "Industry digitalisation + adoption studies",
    },
  ],
  findings: [
    {
      id: "F1",
      title: "Visibility is the core problem — not any single task.",
      text: "Each team does their job competently. What fails is the gap between stages, when nobody knows what the previous team finished or what the next team needs.",
    },
    {
      id: "F2",
      title: "Custom specs degrade with every verbal retelling.",
      text: "Research on bespoke manufacturing shows specifications lose meaningful detail through two or more verbal handoffs — wrong products baked and customer callbacks.",
    },
    {
      id: "F3",
      title: "Peak season is the real test.",
      text: "A system that works on a quiet Tuesday but fails on December 23rd is not a solution. Every decision was filtered through maximum stress, maximum volume.",
    },
    {
      id: "F4",
      title: "Management needs overview before anything else.",
      text: "The stakeholder's first priority was seeing all orders and their status simultaneously. That drove the dashboard-first, admin-first decision.",
    },
    {
      id: "F5",
      title: "The team trusts their existing behaviour.",
      text: "Staff call customers to verify orders. That won't disappear because a dashboard exists. The design had to support it, not fight it.",
    },
    {
      id: "F6",
      title: "The system isn't broken — it's unscalable.",
      text: "A manual workflow that ran for 45 years has real strengths. The design must formalize what works, not replace it with something foreign.",
    },
  ],
};

export const competitors = {
  capabilities: [
    "Custom spec preserved end-to-end",
    "Role-based views",
    "Automatic stage handoff",
    "Small-team suited",
    "Multilingual support",
  ],
  tools: [
    { name: "BakeSmart", scores: ["~", "~", "✗", "✓", "✗"] },
    { name: "MarketMan", scores: ["✗", "✓", "~", "~", "✗"] },
    { name: "Craftybase", scores: ["~", "✗", "✗", "✓", "✗"] },
    { name: "Katana MRP", scores: ["~", "✓", "✓", "✗", "~"] },
    { name: "Paper / Manual", scores: ["~", "✗", "✗", "✓", "✗"] },
    { name: "Shatila (target)", scores: ["✓", "✓", "✓", "✓", "~"], us: true },
  ],
  takeaway:
    "No existing tool combines custom-specification tracking + automatic handoffs + role-based views + small-team simplicity. The opportunity was genuine — not a gap for lack of trying, but because this exact combination had never been the primary design target.",
};

export const roles = [
  {
    name: "Admin",
    scope: "Full access",
    blurb:
      "The owner or senior manager who needs to see everything — financials, team, settings, all orders, all reports. The person the admin dashboard was primarily designed for.",
    modules: "Dashboard KPIs · AR/AP · Reports · Team Users · System Settings · Period Closing",
    restricted: "Nothing",
  },
  {
    name: "Operations Manager",
    scope: "Operations + reporting",
    blurb:
      "Manages the day-to-day flow. Sees all orders, fulfilment, shipping, inventory. Configures operational settings but not financial or system-level controls.",
    modules: "All Orders · Fulfillment · Shipping · Inventory · Customers · Production Reports",
    restricted: "AR/AP detail · Period Closing · Team management",
  },
  {
    name: "Warehouse Staff",
    scope: "Fulfillment only",
    blurb:
      "Handles physical order prep. Needs to know what to pick, pack and ship — nothing more.",
    modules: "Fulfillment Queue · Shipping Labels · Low-Stock Alerts",
    restricted: "Financials · Customer accounts · Reports · Settings",
  },
  {
    name: "Customer Service",
    scope: "Orders + customers",
    blurb:
      "Manages customer relationships and order queries. Views and updates orders, accesses customer records.",
    modules: "All Orders · Customer Management · Order Entry · Order History",
    restricted: "Inventory · Financials · Team settings",
  },
  {
    name: "Read Only",
    scope: "View only",
    blurb:
      "Visibility without the ability to change anything. Useful for auditors, silent partners, or observers.",
    modules: "Dashboard · Orders (view) · Reports · Inventory (view)",
    restricted: "All create / edit / delete actions",
  },
];

export const personas = [
  {
    name: "Rania",
    role: "42 · Operations Manager",
    quote: "I shouldn't have to walk the floor just to know where an order stands.",
    need: "A single live view of every active order and its current stage.",
    frustration: "Chasing updates from each team by hand, with no reliable overview.",
  },
  {
    name: "Khalid",
    role: "29 · Sales Staff",
    quote: "By the time I write it all down, the customer is already asking the next question.",
    need: "A fast, structured way to capture custom orders during a phone call.",
    frustration: "Re-explaining the same order details to warehouse and production.",
  },
  {
    name: "Omar",
    role: "35 · Warehouse Staff",
    quote: "Half my mistakes come from specs that changed and nobody told me.",
    need: "Clear, up-to-date order specs he can trust when fulfilling.",
    frustration: "Acting on outdated information passed along verbally.",
  },
];

export const journey = {
  intro:
    "One custom order, seen from the admin chair — not what physically happens in the kitchen, but what the admin sees, decides, and acts on at each stage.",
  stages: [
    {
      n: "1",
      title: "Order received",
      sees: "Pending Orders KPI increments. New order appears in All Orders.",
      does: "Reviews order details, checks the customer account for issues.",
      manual: "Order could be lost before anyone logged it.",
    },
    {
      n: "2",
      title: "Order verified",
      sees: "Status updates to Confirmed after tele-caller verification.",
      does: "Confirms the order is complete and accurate before release.",
      manual: "No record of whether an order was verified.",
    },
    {
      n: "3",
      title: "Inventory checked",
      sees: "Low-Stock Alerts flag if ingredients are insufficient.",
      does: "Reviews stock, decides whether to proceed or source ingredients.",
      manual: "Shortfalls found only after promising the customer.",
    },
    {
      n: "4",
      title: "In production",
      sees: "Status moves to In Production. Items-to-Fulfill KPI active.",
      does: "Monitors the queue, catches delays before they hit the date.",
      manual: "No view of production progress at all.",
    },
    {
      n: "5",
      title: "Ready to ship",
      sees: "Shipments-Ready KPI increments. Order enters fulfilment queue.",
      does: "Confirms packaging specs, shipping label generated.",
      manual: "Shipping found out by someone walking over.",
    },
    {
      n: "6",
      title: "Shipped",
      sees: "Shipment tracking active. Status: Shipped.",
      does: "Monitors delivery, available for customer queries.",
      manual: "No tracking once it left the building.",
    },
    {
      n: "7",
      title: "Delivered + invoiced",
      sees: "Order closes. AR entry created. Payments-Due updates.",
      does: "Reviews payment terms, monitors receivable aging.",
      manual: "Receivables tracked on paper, easily missed.",
    },
  ],
};

export const insights: {
  value: string;
  label: string;
  kind: MetricKind;
  note: string;
}[] = [
  {
    value: "70%",
    label: "of small food producers still run core operations on manual, paper-based processes",
    kind: "research",
    note: "Industry digitalisation research — context, not a Shatila measurement.",
  },
  {
    value: "30–40%",
    label: "of custom-spec detail is lost through two or more verbal handoffs",
    kind: "research",
    note: "Bespoke-manufacturing research — the basis for Finding F2.",
  },
  {
    value: "30→100",
    label: "weekly orders — the volume jump where the manual process broke",
    kind: "actual",
    note: "Stated directly by the Shatila stakeholder.",
  },
  {
    value: "20–30",
    label: "order errors per day projected at peak under the manual flow",
    kind: "projected",
    note: "Design-target estimate from observed handoff failure rates — not measured.",
  },
];

export const principles = [
  {
    n: "01",
    title: "Visibility before action",
    text: "The system's most important job is making information visible. Before anyone acts on an order, they must see it clearly, completely, and without searching.",
    traces: "F1 — visibility is the core problem",
  },
  {
    n: "02",
    title: "Preserve the original",
    text: "Custom specifications must travel from the customer's words to the baker's hands without being filtered, summarised, or lost. The system carries the original — not an interpretation.",
    traces: "F2 — specs degrade with every handoff",
  },
  {
    n: "03",
    title: "Support existing behaviour",
    text: "The tele-caller verification call has worked for 45 years. Design the system to make that call better — not to eliminate it. Earn trust by improving what the team already trusts.",
    traces: "F5 — the team trusts existing behaviour",
  },
  {
    n: "04",
    title: "Simple enough for Christmas",
    text: "Every interaction must work at maximum stress, maximum volume, minimum patience. If a feature needs explanation, it won't be used on December 23rd.",
    traces: "F3 — peak season is the real test",
  },
  {
    n: "05",
    title: "Speed over polish at intake",
    text: "Order entry must keep pace with a live phone conversation, not slow it down. A simple system the team will use beats a comprehensive one that slows them down.",
    traces: "F1 · Khalid (Sales)",
  },
];

export const ia = {
  intro:
    "Navigation was structured around the rhythm of running a food-production business — not around software conventions. Orders first. Then the people and products behind them. Then the money those orders generate. Then the system that runs it all.",
  note: "Orders sits above Dashboard on purpose. For a factory admin, the first question every morning isn't 'what are my KPIs' — it's 'what orders do I have today and what state are they in.' The dashboard is a summary. Orders is the work.",
  groups: [
    { name: "Dashboard", items: ["Home KPIs + Quick Actions"] },
    { name: "Orders", items: ["Order Entry", "All Orders", "Fulfillment", "Shipping & Tracking"] },
    { name: "Products & Inventory", items: ["Product List", "Inventory Levels", "Low-Stock Alerts"] },
    { name: "Customers & Wholesale", items: ["Customer List", "Customer Details", "Wholesale Orders"] },
    { name: "Financial", items: ["Accounts Receivable", "Accounts Payable", "Purchase Orders", "Vendor Management"] },
    { name: "Reports", items: ["Sales Summary", "Shipping Summary", "Best Sellers", "Production Summary"] },
    { name: "Automation", items: ["Address Validation", "Label Generator", "Reorder", "Notifications"] },
    { name: "System", items: ["Team Users", "Roles & Permissions", "Period Closing", "Integrations"] },
  ],
};

export const flows = [
  {
    name: "New order creation",
    blurb: "Turning a customer phone call into a confirmed, tracked order.",
    steps: ["Open Order Entry", "Select Customer", "Review Customer Issues", "Enter Order Items", "Set Shipping", "Set Payment Terms", "Review Summary", "Confirm + Submit", "Order Confirmed"],
  },
  {
    name: "Customer creation · AI Auto-Fill",
    blurb: "Cutting data entry by extracting structured fields from raw text.",
    ai: true,
    steps: ["New Customer", "Open AI Auto-Fill", "Paste text / email", "System extracts fields", "Review extracted data", "Correct if needed", "Save customer"],
  },
  {
    name: "Fulfillment to shipment",
    blurb: "The hand-off path from picking to a tracked shipment.",
    steps: ["Open Fulfillment Queue", "Select Order", "Review Pick List", "Mark Items Picked", "Generate Label", "Hand to Shipping", "Mark Shipped", "Tracking Active"],
  },
  {
    name: "Accounts receivable",
    blurb: "Closing the loop from delivered order to recorded payment.",
    steps: ["Order Delivered", "Invoice Auto-Created", "Review in AR", "Send Invoice", "Monitor Payment", "Record Payment", "AR Aging Updated"],
  },
];

export const decisions = [
  {
    n: "01",
    title: "Staff dashboard before admin polish",
    challenge: "Most daily pain lived with front-line staff capturing and moving orders.",
    decision: "Design the staff workflow and admin visibility as one system, but prioritize the screens that touch every order — entry, status, and the shared record.",
    alternatives: "Build a management BI dashboard first; defer staff tooling.",
    why: "Visibility is only as good as the data feeding it. If staff don't capture orders cleanly, no admin view can be trusted.",
    impact: "A single order record every role reads and writes to — never a private copy.",
    lesson: "Foundational data capture earns the right to a beautiful dashboard.",
  },
  {
    n: "02",
    title: "Make the verification call better, not extinct",
    challenge: "The 45-year tele-caller habit of phoning customers to confirm orders.",
    decision: "Design Order Summary Review to put the complete order in front of staff while they're on the phone.",
    alternatives: "Replace the call with automated confirmation emails.",
    why: "Killing a trusted behaviour gets resistance; improving it gets adoption.",
    impact: "Faster, more complete verification — adoption without a culture fight.",
    lesson: "For first-time digital tools, improve what's trusted before replacing it.",
  },
  {
    n: "03",
    title: "Permissions as foundation, not feature",
    challenge: "Five roles with very different needs and sensitivities (financials, team data).",
    decision: "Build the 5-role permission system into the foundation before any screen used it.",
    alternatives: "Ship one shared view; bolt on permissions later.",
    why: "Role-differentiated home screens (next phase) need real infrastructure, not a retrofit.",
    impact: "Every module exists because a specific role has a specific reason to need it.",
    lesson: "Good design anticipates the decision it can't make yet and creates conditions for it.",
  },
  {
    n: "04",
    title: "AI assists, humans decide",
    challenge: "Customer data entry is slow; AI could accelerate it — but errors are expensive.",
    decision: "AI Auto-Fill extracts structured fields from pasted text, then always routes through human review before save.",
    alternatives: "Fully automatic customer creation from raw text.",
    why: "A custom bakery cannot afford a wrong address or a misheard allergy.",
    impact: "Speed of automation with the safety of a human checkpoint — purple signals AI everywhere.",
    lesson: "In high-trust operations, transparency beats magic.",
  },
  {
    n: "05",
    title: "Dark, warm, and unmistakably Shatila",
    challenge: "A digital tool that wouldn't feel corporate or foreign to a family factory.",
    decision: "A warm near-black canvas, a single amber accent, and editorial type — never flat, never generic SaaS blue.",
    alternatives: "Default light SaaS theme with stock components.",
    why: "The interface had to feel like it belonged to a craft business with a 45-year reputation.",
    impact: "An identity the team recognizes as theirs, not borrowed software.",
    lesson: "Visual tone is part of adoption, not decoration.",
  },
];

export const features = [
  {
    name: "Customer Selection",
    desc: "Find or create a customer at the start of an order, with issues and credit status surfaced before anything is entered.",
    reason: "Catching a problem account up front prevents a wasted order downstream.",
  },
  {
    name: "Order Entry",
    desc: "A structured capture flow that keeps pace with a live phone call — items, custom specs, quantities, dates.",
    reason: "Speed over polish: intake must not lag the conversation.",
  },
  {
    name: "AI Auto-Fill",
    desc: "Paste a customer's email or message; the system extracts structured fields for human review.",
    reason: "Cuts data entry without removing the human checkpoint.",
    ai: true,
  },
  {
    name: "Order Review",
    desc: "The complete order, laid out for the verification call — the digital companion to a 45-year habit.",
    reason: "Makes the trusted call faster and more complete.",
  },
  {
    name: "Status Pipeline",
    desc: "Every order's stage, visible at a glance — received, confirmed, in production, ready, shipped, invoiced.",
    reason: "Answers 'how does the next person know?' at every handoff.",
  },
  {
    name: "Dashboard",
    desc: "Six KPIs, AR/AP aging, and quick actions — the morning overview of the whole operation.",
    reason: "Management visibility, the stakeholder's first priority.",
  },
];

export const adminKpis = [
  { label: "Pending Orders", value: 24, delta: "+6 since yesterday", tone: "amber" },
  { label: "In Production", value: 18, delta: "on schedule", tone: "ink" },
  { label: "Shipments Ready", value: 9, delta: "+3 today", tone: "green" },
  { label: "Payments Due", value: 7, prefix: "", suffix: "", money: true, value2: 12840, delta: "AR aging tracked", tone: "amber" },
];

export const ai = {
  lead: "AI in this system has exactly one job: remove typing, never remove judgement.",
  points: [
    {
      title: "Auto-Fill, not auto-submit",
      text: "Paste raw text; the system proposes structured fields. Nothing is saved until a person confirms it.",
    },
    {
      title: "Human review is mandatory",
      text: "Every AI-extracted field passes through a review step. The human is the decision-maker, the AI is the assistant.",
    },
    {
      title: "Transparency by colour",
      text: "Purple is the single 'AI is acting' signal across the whole system — glow, pulse, confidence, auto-fill. You always know when the machine touched something.",
    },
    {
      title: "Ethics for a trust business",
      text: "A custom bakery cannot afford a wrong address or a misheard allergy. The design treats AI errors as expensive and builds the checkpoint in by default.",
    },
  ],
};

export const accessibility = {
  lead: "A first-time digital tool for a multilingual, multi-generational workforce is an ethics problem as much as a usability one.",
  commitments: [
    {
      title: "Designed for trust",
      text: "The system formalizes a 45-year reputation. It must never lose a detail a human would have remembered.",
    },
    {
      title: "Readable under stress",
      text: "High-contrast warm palette, large type, generous targets — legible on a busy factory floor on December 23rd.",
    },
    {
      title: "Bilingual on the roadmap",
      text: "Dearborn's Arab-American workforce means Arabic is a working language. Critical operational screens are slated to be bilingual (English + Arabic, RTL).",
    },
    {
      title: "WCAG roadmap",
      text: "Contrast, focus states, keyboard paths and semantic structure are the baseline; a full WCAG 2.2 AA pass is a committed next step, not a claim made today.",
    },
  ],
};

export const designSystem = {
  colors: [
    { name: "Canvas", hex: "#0C0A08", use: "Near-black, faintly warm. Never flat." },
    { name: "Primary text", hex: "#F4EFE6", use: "Warm off-white, easier than pure white." },
    { name: "Amber", hex: "#D4A853", use: "The one accent — active states, alerts, highlights." },
    { name: "Success", hex: "#5FB97A", use: "Confirmed, paid, stock healthy." },
    { name: "Alert", hex: "#E04040", use: "Critical issues, overdue, low stock." },
    { name: "AI", hex: "#8B5CF6", use: "The 'AI is acting' signal, everywhere." },
  ],
  type: [
    { font: "Fraunces", role: "Display & headlines", sample: "Order Management" },
    { font: "DM Sans", role: "Body & UI text", sample: "Every order is captured digitally and visible at every stage." },
    { font: "Oswald", role: "Labels & navigation", sample: "DASHBOARD · ORDERS · REPORTS" },
  ],
  tokens: [
    { k: "Radius", v: "10px base · sm/md/lg/xl scale" },
    { k: "Border", v: "1px hairline @ 10% ink" },
    { k: "Weights", v: "400 / 500 only" },
    { k: "Base size", v: "16px · line-height 1.5" },
    { k: "Components", v: "47 shadcn/ui + motion wrappers" },
    { k: "Motion", v: "IBM Carbon-style tokens, 0.08–0.42s" },
  ],
};

export const tech = {
  lead: "Built in Figma Make — a tool that generates a working React + Tailwind application directly from the design — so the client could experience a navigable product, not a static mockup.",
  stack: [
    { k: "Framework", v: "React 18 + TypeScript, Vite" },
    { k: "Styling", v: "Tailwind CSS v4 (@theme tokens) + shadcn/ui (Radix)" },
    { k: "Motion", v: "Framer Motion v12, shared motion-tokens.ts" },
    { k: "Data viz", v: "Recharts · MUI v7 where dense tables help" },
    { k: "Theming", v: "next-themes, light/dark via .dark class" },
    { k: "Navigation", v: "Single-page state machine (currentModule), not a router" },
  ],
  future: [
    "A real backend + database (orders persist beyond the prototype)",
    "Authentication wired to the 5-role permission system",
    "Server-enforced permissions, not just UI gating",
  ],
};

export const impact = {
  note: "This is an active project. The rows below are what the design solves by construction — before/after of the operation — not audited business results.",
  rows: [
    { before: "Management had no order visibility", after: "Dashboard shows all KPIs and order status in real time" },
    { before: "Orders lost during Christmas peak", after: "Every order tracked from entry to delivery — nothing falls through" },
    { before: "Custom specs lost in verbal handoffs", after: "Order details captured digitally, visible at every stage" },
    { before: "No way to check financial health at a glance", after: "AR/AP aging, payments due, vendor bills — all on one screen" },
    { before: "Everyone saw everything, or nothing", after: "5-role permission system controls access per team member" },
  ],
};

export const reflection = [
  {
    title: "Design for the urgency, not the ideal.",
    text: "The client came with a real deadline — Christmas. A useful tool delivered in time is worth more than a perfect tool delivered after the damage. Scope decisions made under real constraints are still design decisions; they need to be owned, not apologised for.",
  },
  {
    title: "Support existing behaviour before changing it.",
    text: "The tele-caller verification call has worked for 45 years. Designing the Order Summary Review to make that call better gets adoption. Trying to eliminate it gets resistance. The fastest path to trust is making the existing process undeniably better.",
  },
  {
    title: "Role-based design starts with permissions, not screens.",
    text: "Building the 5-role permission system into the foundation means the next phase — differentiated home screens — has real infrastructure to build on, rather than needing a retrofit.",
  },
  {
    title: "First-time digitalisation is not redesign.",
    text: "No prior system, no analytics, no existing mental model. The only reference is the people and how they work. Listening to what the client describes — not just what they ask for — is the entire research method.",
  },
];

export const roadmap = [
  { n: "01", title: "Role-based home screens", text: "Each of the 5 roles sees a home tailored to their daily tasks. Warehouse doesn't need AR aging; admin doesn't need only a pick list." },
  { n: "02", title: "Production queue for bakers", text: "The baking team has no screen yet. What to bake today, in what quantity, with what spec — needs its own dedicated interface." },
  { n: "03", title: "Automatic stage-handoff notifications", text: "When fulfilment marks an order complete, shipping is notified instantly — the digital version of the verbal handoff." },
  { n: "04", title: "Mobile & tablet view", text: "Factory-floor workers aren't at desks. Fulfilment and shipping need touch-friendly, readable-in-production interfaces." },
  { n: "05", title: "Bilingual UI — English + Arabic", text: "Dearborn's Arab-American workforce means Arabic is a working language. Critical operational screens should be bilingual, RTL-aware." },
  { n: "06", title: "Analytics & inventory intelligence", text: "Reorder automation, demand forecasting for peak season, and production planning built on real order history." },
];

export const takeaways = {
  closing:
    "Shatila didn't need software that looked impressive. It needed software the team would actually use on the hardest day of their year — and that would protect a 45-year reputation built on getting custom orders right.",
  bullets: [
    "Visibility, not features, was the product.",
    "Trust is earned by improving what already works.",
    "AI should remove typing, never remove judgement.",
    "Designing for the worst day is designing for every day.",
  ],
};
