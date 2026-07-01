/* ============================================================
   Tractor Connect 2.0 — content source of truth.
   All copy is drawn from the real end-to-end UX project. Metrics are
   tagged by provenance: "actual" (validated in testing / stated by
   stakeholders), "research" (industry / academic source), or
   "projected" (design target, not yet measured in the field).
   ============================================================ */

export type MetricKind = "actual" | "research" | "projected";

/* chapter index used by the floating side-nav */
export const sections = [
  { id: "hero", label: "Open" },
  { id: "summary", label: "Summary" },
  { id: "story", label: "Story" },
  { id: "context", label: "Field" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "competitive", label: "Competitors" },
  { id: "stakeholders", label: "Users" },
  { id: "journey", label: "Journey" },
  { id: "insights", label: "Insights" },
  { id: "principles", label: "Principles" },
  { id: "ia", label: "Architecture" },
  { id: "flows", label: "Flows" },
  { id: "decisions", label: "Decisions" },
  { id: "features", label: "Features" },
  { id: "admin", label: "Screens" },
  { id: "ai", label: "Ask Tractor" },
  { id: "accessibility", label: "Accessibility" },
  { id: "system", label: "Design System" },
  { id: "prototype", label: "Prototype" },
  { id: "tech", label: "Testing" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
  { id: "roadmap", label: "Roadmap" },
  { id: "voices", label: "Voices" },
  { id: "takeaways", label: "End" },
];

export const hero = {
  kicker: "Tractor Connect 2.0 · Connected Tractor Companion App · UX/UI Case Study",
  // three-line "mega" banner headline — normal / accent / ghost-outline
  headline: [
    { text: "An app as capable", kind: "normal" as const, hl: "capable" },
    { text: "as the machine", kind: "accent" as const },
    { text: "it speaks for.", kind: "ghost" as const },
  ],
  lede: "Redesigning a connected-tractor companion app for farmers who work with their hands, not their phones. A full end-to-end UX process — from field research to final screens — for a tractor manufacturer's mobile product, built around how farmers actually think and work, not how engineers assume they do.",
  meta: [
    { k: "Role", v: "Lead UX Designer" },
    { k: "Platform", v: "iOS · Android" },
    { k: "Markets", v: "US · Canada · South Korea" },
    { k: "Process", v: "Empathize → Define → Ideate → Prototype → Test" },
  ],
};

export const subnav = [
  { id: "summary", label: "Summary" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "competitive", label: "Competitors" },
  { id: "stakeholders", label: "Users" },
  { id: "journey", label: "Journey" },
  { id: "principles", label: "Principles" },
  { id: "decisions", label: "Decisions" },
  { id: "features", label: "Features" },
  { id: "ai", label: "Ask Tractor" },
  { id: "system", label: "Design System" },
  { id: "prototype", label: "Prototype" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
];

export const summary = {
  overview:
    "We led the end-to-end redesign of a connected-tractor companion app — a product that lets owners monitor equipment health, manage maintenance, schedule service, order parts, and read telemetry through a single mobile interface. The goal was to modernise an experience that had fallen behind the hardware it represents: a capable tractor ecosystem served by an app that couldn't communicate any of it clearly.",
  challenge:
    "The product spans three markets and a deliberately wide user base — independent farmers with low digital confidence, fleet managers running multi-vehicle operations, and dealer technicians who live in the app all day. Designing one coherent system for three incompatible mental models became the central problem of the project.",
  outcome:
    "Tractor Connect 2.0 — a field-ready companion in which every design decision traces back to a research finding. Across nine moderated test sessions, all four primary success metrics were met or exceeded: 88% task completion, 74-second fault-to-action, 78% of parts orders placed without a dealer call, and a System Usability Scale score of 81.",
  facts: [
    { k: "Task completion", v: "88% · target >85%" },
    { k: "Fault → action", v: "74s · target <90s" },
    { k: "Parts without a call", v: "78% · target >70%" },
    { k: "SUS score", v: "81 · target >75" },
  ],
};

export const story = {
  beats: [
    {
      kicker: "The dashboard light",
      text: "It starts in a field. A warning light appears on the dash, and the only thing the app offers is a raw code — SPN 1234 — with no hint of whether the engine is about to fail or it's nothing at all.",
    },
    {
      kicker: "Capable machine, mute app",
      text: "The tractor itself is a sophisticated, connected piece of equipment. The app meant to represent it exposed engine-hour math and fault codes, then went silent the moment the network dropped.",
    },
    {
      kicker: "The user is 58, not 28",
      text: "The average US farmer is 58 years old, with significantly lower digital confidence than a typical app's audience. This product wasn't failing power users — it was failing the people it was built for.",
    },
    {
      kicker: "Translate, don't add",
      text: "The opportunity was never more features. It was clearer communication of the data the tractor already produced — turning machine language into human language, at the exact moment a decision has to be made.",
    },
  ],
};

export const context = {
  lead: "The product lives in a specific world: rural fields with unreliable connectivity, gloved hands, direct sunlight, and users who think in seasons and jobs — not engine hours and error codes.",
  body: "Three markets, three languages, and one telemetry architecture (TCU/TMS) that is frequently out of signal. A digital system here can't assume a confident, always-connected user at a desk. It has to formalise how farmers already work — and stay useful when the network, the hardware, or the language changes underneath it.",
  pillars: [
    { k: "58.1 yrs", v: "Average age of the US farmer (USDA, 2022)" },
    { k: "3 markets", v: "US · Canada · South Korea, fully localised" },
    { k: "Offline", v: "The field is frequently out of signal" },
    { k: "Field-first", v: "Gloves, glare, and a quick decision" },
  ],
};

export const problem = {
  statement:
    "The biggest problem wasn't any single feature being difficult. It was that the app spoke the machine's language — codes, engine hours, raw telemetry — to people who needed answers, not data.",
  painPoints: [
    {
      n: "01",
      title: "Fault codes with no meaning",
      text: "When a warning light appeared, users got a raw code and no context for severity. The emotional response was panic — regardless of whether the fault was trivial or critical — because nothing translated it.",
    },
    {
      n: "02",
      title: "Five identical dead ends",
      text: "Five separate features collapsed into the same generic error whenever the TCU wasn't active — one dead end repeated five times, with no explanation and no way forward. Hit it once and you'd assume none of it worked.",
    },
    {
      n: "03",
      title: "Engine hours mean nothing",
      text: "Maintenance intervals were expressed in engine hours (50hr, 100hr, 200hr). Farmers who think in seasons, jobs, and calendar months couldn't act on a number that didn't map to their world.",
    },
    {
      n: "04",
      title: "Compatibility anxiety kills orders",
      text: "Users added parts to the cart, then called the dealer to confirm the part would fit before buying. The uncertainty the app created was never resolved by the app itself — so the order died on the phone.",
    },
  ],
};

export const research = {
  lead: "With a wide, hard-to-reach user base, ten research methods were triangulated to reconstruct how farmers, fleet managers, and technicians actually work — and where the current experience breaks. An independent US-based UX research consultant joined for interview design and synthesis.",
  methods: [
    {
      tag: "01",
      name: "User interviews",
      detail:
        "Interviews with individual tractor owners, fleet managers, and dealer service technicians to understand daily workflows, pain points, and decision-making patterns.",
      sources: "Owners · fleet managers · dealer technicians",
    },
    {
      tag: "02",
      name: "Contextual inquiry",
      detail:
        "Observed how users interact with equipment and phones in real field conditions — poor lighting, gloved hands, intermittent connectivity. 7 of 12 sessions involved outdoor screen use in direct sunlight.",
      sources: "In-field observation",
    },
    {
      tag: "03",
      name: "App-store review analysis",
      detail:
        "Systematic analysis of Google Play and App Store reviews for the existing app and competitors, coding recurring complaint themes.",
      sources: "Google Play + App Store reviews",
    },
    {
      tag: "04",
      name: "Secondary research",
      detail:
        "Synthesised the USDA Census of Agriculture, Purdue University technology-adoption studies, and academic digital-literacy research to ground the work in evidence.",
      sources: "USDA · Purdue · academic literature",
    },
    {
      tag: "05",
      name: "Support-ticket analysis",
      detail:
        "Reviewed support ticket categories and dealer feedback to find the highest-volume, highest-cost user pain points.",
      sources: "Support tickets · dealer feedback",
    },
    {
      tag: "06",
      name: "Heuristic evaluation",
      detail:
        "Walked every flow of the shipping app against Nielsen's 10 usability heuristics, cataloguing each issue with a screenshot, a heuristic reference, and its specific user cost.",
      sources: "Nielsen's 10 heuristics",
    },
  ],
  findings: [
    {
      id: "F1",
      title: "The average US farmer is 58.1 years old.",
      text: "The primary user base has significantly lower digital confidence than a typical app's audience. Every decision had to account for users who are not digital natives. (USDA Census of Agriculture, 2022.)",
    },
    {
      id: "F2",
      title: "Fault codes create disproportionate anxiety.",
      text: "With no plain-language interpretation, a warning light produced panic regardless of severity. Users had no way to tell a minor alert from an engine-ending one.",
    },
    {
      id: "F3",
      title: "Engine hours mean nothing to someone who thinks in seasons.",
      text: "Intervals in 50hr / 100hr / 200hr terms weren't understood by most users. Farmers think in jobs, seasons, and calendar months — not accumulated run-time.",
    },
    {
      id: "F4",
      title: "Compatibility anxiety kills parts orders.",
      text: "Users consistently added a part to the cart, then called the dealer to confirm fit before buying. The app created the doubt and never resolved it.",
    },
    {
      id: "F5",
      title: "Rural connectivity is not reliable.",
      text: "Fault history, maintenance records, and dealer contacts must work without a network — the field is exactly where these features are needed most.",
    },
    {
      id: "F6",
      title: "Post-registration is the 'what now?' moment.",
      text: "If the app fails to deliver obvious value within 60 seconds of registration, users don't return. First-session value is the strongest predictor of long-term engagement.",
    },
    {
      id: "F7",
      title: "The dealer is an asset, not a competitor.",
      text: "Farmers trust their dealer. The instinct to make the app replace dealer contact is wrong — the opportunity is to strengthen and pre-fill that connection.",
    },
  ],
  quotes: [
    "When that light comes on, I stop everything. I don't know if I'm about to lose the engine or if it's nothing. The app just shows me a code.",
    "I've been farming for 30 years. I don't think in hours. I think in whether I need to get this done before the planting starts.",
    "I always call the dealer before I order parts. I'm not going to guess and waste money on the wrong filter.",
  ],
};

export const competitors = {
  capabilities: [
    "Plain-language fault explanation",
    "Maintenance intervals in seasonal language",
    "Offline-first / cached data access",
    "Parts compatibility confirmed before purchase",
    "Dealer context pre-filled on service request",
    "Multi-vehicle / fleet overview",
    "Geofencing / safe-zone alerts",
    "AI assistant / conversational support",
  ],
  tools: [
    { name: "Connect 2.0", scores: ["✓", "✓", "✓", "✓", "✓", "✓", "✓", "✓"], us: true },
    { name: "John Deere", scores: ["✗", "✗", "~", "✓", "~", "✓", "✓", "✗"] },
    { name: "myKubota", scores: ["~", "✗", "·", "✗", "~", "✓", "✓", "✗"] },
    { name: "Mahindra", scores: ["~", "·", "·", "✗", "~", "~", "✓", "✗"] },
    { name: "New Holland", scores: ["✗", "·", "·", "✗", "~", "✓", "·", "✗"] },
  ],
  takeaway:
    "The pattern was clear: competitors who translate machine data into human language earn trust; those who expose raw codes and engine-hour math do not. The opportunity wasn't more features — it was clearer communication of the data the tractor already produces.",
};

/* the three primary personas — with real portraits, used as cards + an explorer */
export const personas = [
  {
    name: "Robert",
    role: "58 · Tennessee · Independent owner",
    photo: "/image/persona-robert.jpg",
    segment: "Reactive · Anxious · Single-vehicle",
    accent: "var(--amber)",
    quote: "I just need to know if it's broken or not. I don't need an app — I need an answer.",
    need: "To know his tractor is healthy without learning new technology.",
    frustration: "Fault codes with no explanation, and reminders in units he doesn't understand.",
    goals: [
      "Know his tractor is healthy without learning new tech",
      "Get help fast when something goes wrong",
      "Trust that the app is telling him the truth",
    ],
    pains: [
      "Fault codes with no explanation",
      "Maintenance reminders in units he can't read",
      "Registration that needs more patience than he has",
    ],
    tasks: "Check status · respond to fault alerts · book service",
  },
  {
    name: "Sarah",
    role: "34 · Ontario, Canada · Fleet operations manager",
    photo: "/image/persona-sarah.jpg",
    segment: "Proactive · Efficient · Fleet manager",
    accent: "var(--green)",
    quote: "I need to see all six tractors at once before 7am. I can't be clicking through each one.",
    need: "Fleet-level visibility every morning, and parts ordered without phone calls.",
    frustration: "A single-tractor interface running a multi-vehicle operation.",
    goals: [
      "Fleet-level visibility every morning",
      "Proactive maintenance before peak season",
      "Parts ordered without phone calls",
    ],
    pains: [
      "Single-tractor UI on a multi-vehicle operation",
      "No fleet-level summary view",
      "Compatibility anxiety on every parts order",
    ],
    tasks: "Multi-vehicle overview · maintenance scheduling · fleet reporting",
  },
  {
    name: "Carlos",
    role: "29 · Texas · Dealer service technician",
    photo: "/image/persona-carlos.jpg",
    segment: "Speed-first · Accuracy-driven · Technician",
    accent: "#E8A430",
    quote: "I've got 20 customers today. I need the vehicle history in 10 seconds, not 10 taps.",
    need: "Instant vehicle history and a paperless RDI he can complete with the customer present.",
    frustration: "No fast vehicle search and a paper-based RDI process.",
    goals: [
      "Vehicle history instantly",
      "RDI completion without paper",
      "Customers leaving with confirmed appointments",
    ],
    pains: [
      "No fast vehicle search",
      "Paper-based RDI process",
      "No pre-filled service context",
    ],
    tasks: "Vehicle lookup · RDI completion · service-request management",
  },
];

export const journey = {
  intro:
    "We built three end-to-end journey maps, one per persona, charting what each person does, how they feel, where they hit friction, and the design opportunity at every stage. Mapping the emotional arc — not just the steps — is what surfaced the moments where one small decision changes the entire experience.",
  images: [
    {
      src: "/image/journey-current-robert.png?v=4",
      cap: "Current-state journey · Robert's fault-detection experience",
    },
    {
      src: "/image/journey-future-robert.png",
      cap: "Future-state journey · Robert's redesigned fault experience",
    },
  ],
  // Robert's emotional arc, the spine of the fault-response redesign
  stages: [
    {
      n: "1",
      title: "The warning light",
      feeling: "Panic",
      after: "Severity is communicated before a single word is read — a colour and an icon say 'this can wait' or 'stop now'.",
      before: "A raw code appears on the dash with no indication of how serious it is.",
    },
    {
      n: "2",
      title: "Opening the app",
      feeling: "Confusion",
      after: "The fault is translated into plain language: what it is, in one sentence Robert can read.",
      before: "The old app showed 'SPN 1234' — technically accurate, practically meaningless.",
    },
    {
      n: "3",
      title: "Reading the explanation",
      feeling: "Relief",
      after: "Cause, urgency, and the recommended next step are laid out in the order a worried person needs them.",
      before: "No explanation existed — users searched the web or called the dealer to interpret a code.",
    },
    {
      n: "4",
      title: "Taking the matched action",
      feeling: "Confidence",
      after: "A severity-matched CTA: keep working, monitor it, or book the dealer now — with context pre-filled.",
      before: "Every fault offered the same nothing, so every fault felt equally alarming.",
    },
    {
      n: "5",
      title: "Resolved",
      feeling: "Satisfaction",
      after: "A reference number, the dealer notified, and the event logged to history — readable later, even offline.",
      before: "Nothing was recorded; the next person started from zero.",
    },
  ],
  moments: [
    {
      name: "Robert",
      accent: "var(--amber)",
      text: "Anxiety at the warning light → confusion at the code → relief at the plain-language explanation → confidence at the severity-matched CTA → satisfaction at resolution.",
    },
    {
      name: "Sarah",
      accent: "var(--green)",
      text: "Purposeful morning check → proactive maintenance spotting → efficient booking → confident parts ordering → informed monthly review.",
    },
    {
      name: "Carlos",
      accent: "#E8A430",
      text: "Focused customer intake → fast vehicle lookup → informed diagnosis → methodical RDI completion → satisfied customer handoff.",
    },
  ],
};

export const insights: {
  value: string;
  label: string;
  kind: MetricKind;
  note: string;
  decimals?: number;
}[] = [
  {
    value: "58.1",
    label: "average age of the US farmer — the primary user base",
    kind: "research",
    decimals: 1,
    note: "USDA Census of Agriculture, 2022 — the statistic that reframed the whole project.",
  },
  {
    value: "12.7%",
    label: "of older farmers report confidence with digital tools",
    kind: "research",
    note: "Purdue University technology-adoption research — design for the 87%, not the 13%.",
  },
  {
    value: "60s",
    label: "the window after registration to deliver visible value, or users don't return",
    kind: "research",
    note: "First-session value is the strongest predictor of long-term engagement (Finding F6).",
  },
  {
    value: "5",
    label: "identical TCU dead-end screens in the shipping app — one failure, repeated",
    kind: "actual",
    note: "Counted directly in the heuristic audit of app version 1.5.2.",
  },
];

export const principles = [
  {
    n: "01",
    title: "Translate, never expose",
    text: "Machine data — fault codes, engine hours, telemetry — is translated into plain, human language at the moment of decision. The system carries the meaning, not the raw value.",
    traces: "F2 · F3 — codes and hours mean nothing",
  },
  {
    n: "02",
    title: "Severity before words",
    text: "Colour and icon communicate how urgent something is before the user reads a single sentence — and colour is never the only signal, always paired with a label.",
    traces: "F2 — fault anxiety, and WCAG contrast",
  },
  {
    n: "03",
    title: "Never a dead end",
    text: "Every data-dependent screen is designed for all three TCU states — active, not enabled, expired — so no feature ever collapses into a generic error with no way forward.",
    traces: "Audit — five identical dead ends",
  },
  {
    n: "04",
    title: "Field-first, offline-safe",
    text: "Critical features work without a network, in direct sunlight, with gloves on. The app assumes the hardest conditions are the normal ones.",
    traces: "F5 · contextual inquiry",
  },
  {
    n: "05",
    title: "Strengthen the dealer, don't replace them",
    text: "Farmers trust their dealer. Every handoff is pre-filled with vehicle, fault, and history so the relationship starts from what the app already knows.",
    traces: "F7 — the dealer is an asset",
  },
];

export const ia = {
  intro:
    "We moved the app from a cluttered three-tab navigation to a clear four-tab structure — Home, My Tractor, Explore, Profile — with progressive disclosure as the core organising principle. Simplicity on the surface, depth on demand: one architecture that serves an anxious owner, a fleet manager, and a technician without compromising any of them.",
  image: "/image/Tractor Information architecture sitemap.png?v=1",
  imageAlt:
    "Information-architecture sitemap — four sections with the 27 prototyped screens marked",
  note: "Progressive disclosure wasn't an aesthetic preference — it came from the tension between three distinct segments with incompatible needs. One IA, three completely different ways of using it.",
  decisions: [
    {
      n: "1",
      title: "4-tab navigation",
      text: "Vehicle functions (My Tractor) are separated from discovery (Explore) so Robert never accidentally leaves his tractor context while browsing parts.",
    },
    {
      n: "2",
      title: "Ask Tractor as a persistent float",
      text: "The AI assistant is reachable from every screen without consuming a navigation tab. Available, but never imposing.",
    },
    {
      n: "3",
      title: "Progressive disclosure",
      text: "A simple surface for Robert, depth on demand for Sarah, speed shortcuts for Carlos — one structure serving three usage patterns.",
    },
    {
      n: "4",
      title: "TCU-aware states",
      text: "Every data-dependent screen is designed for three TCU states, so no feature ever becomes a dead end.",
    },
  ],
};

export const flows = [
  {
    name: "Tractor onboarding",
    blurb: "From app launch to home dashboard — QR/manual registration, dealer selection, and the RDI prompt. 18 steps · 5 decision branches.",
    steps: ["Launch app", "Scan QR / manual entry", "Confirm vehicle", "Select dealer", "RDI prompt", "First-value screen", "Home dashboard"],
  },
  {
    name: "Fault detection & response",
    blurb: "From TCU alert to resolution, with severity routing and a pre-filled dealer handoff. 10 steps · 3 severity paths.",
    steps: ["TCU alert", "Severity shown", "Plain-language fault", "Matched CTA", "Keep working / Book dealer", "Pre-filled request", "Reference + history"],
  },
  {
    name: "Service booking",
    blurb: "From maintenance reminder to a confirmed appointment. 12 steps · 4-screen flow.",
    steps: ["Maintenance reminder", "Choose dealer", "Pick date", "Describe need", "Review", "Confirm", "Booking confirmation"],
  },
  {
    name: "Maintenance scheduling",
    blurb: "From run-hours view to an updated service record, with a three-path decision. 9 steps.",
    steps: ["Run-hours view", "Seasonal interval", "Self-perform / Book / Log", "Capture detail", "Update record", "History updated"],
  },
  {
    name: "Parts search & RFQ",
    blurb: "From category browse to RFQ confirmation, with vehicle context and the compatibility badge. 14 steps.",
    steps: ["Browse category", "Filtered to my tractor", "Part detail", "Compatibility badge", "Add to RFQ", "Submit request", "RFQ confirmation"],
  },
  {
    name: "RDI diagnostics",
    blurb: "From entry to a submitted RDI with dual signatures — offline-safe. 12 steps.",
    steps: ["Open RDI", "Vehicle lookup", "Checklist", "Capture findings", "Customer signature", "Technician signature", "Submit"],
  },
  {
    name: "Notification management",
    blurb: "From a TCU trigger to user action across five alert types. 9 steps.",
    steps: ["TCU trigger", "Notification", "Deep link", "Context screen", "Matched action", "Resolve / snooze"],
  },
];

export const decisions = [
  {
    n: "01",
    title: "Translate fault codes into plain language",
    challenge: "A warning light produced panic because the app showed only a raw code with no severity context.",
    decision: "Pair every fault with a one-sentence plain-language explanation, a colour-coded severity, and a single matched next step.",
    alternatives: "Keep the code and add a 'learn more' link to a manual.",
    why: "Anxiety comes from not knowing how bad it is. Severity-before-words removes the panic before the reading even starts.",
    impact: "Average fault-to-action of 74 seconds in testing, against a 90-second target.",
    lesson: "For anxious users, the first job of the interface is to lower the heart rate.",
  },
  {
    n: "02",
    title: "Speak maintenance in seasons, not engine hours",
    challenge: "Intervals in 50hr / 100hr terms were technically accurate but practically meaningless to most farmers.",
    decision: "Express service intervals in seasonal, job-based language — 'before spring planting' — with engine hours available underneath for those who want them.",
    alternatives: "Keep engine hours as the primary metric; it's what the telemetry reports.",
    why: "A reminder only works if the user can act on it. The unit has to match the user's mental model, not the sensor's.",
    impact: "Maintenance reminders that users actually understand and schedule against.",
    lesson: "Accurate and useful are not the same thing. Design for the second one.",
  },
  {
    n: "03",
    title: "Confirm compatibility before commitment",
    challenge: "Compatibility doubt sent users to the phone mid-order, and the order died there.",
    decision: "Filter parts to the user's specific tractor and show a compatibility badge at the exact moment of decision — before Add to Cart.",
    alternatives: "Resolve compatibility at checkout, or rely on the dealer call as the safety net.",
    why: "The doubt has to be answered where it's created. A badge at the decision point removes the reason to pick up the phone.",
    impact: "78% of parts orders completed in-app without a dealer call, against a 70% target.",
    lesson: "Kill friction at the moment it appears, not one screen later.",
  },
  {
    n: "04",
    title: "Design the dead ends, not just the happy path",
    challenge: "Five features collapsed into one generic error whenever the TCU wasn't active.",
    decision: "Design every data-dependent screen for three TCU states, so 'not enabled' and 'expired' each get an explanation and a clear next step.",
    alternatives: "Show a single shared empty state and handle edge cases later.",
    why: "A flow isn't finished when the happy path works — it's finished when the unhappy paths have somewhere to go.",
    impact: "No feature in the redesign can become a dead end; every error has an exit.",
    lesson: "The quality of a product lives in its edge cases.",
  },
  {
    n: "05",
    title: "Make the dealer handoff the best feature",
    challenge: "The instinct was to make the app remove the need for dealer contact entirely.",
    decision: "Pre-fill every dealer touchpoint — service request, parts, fault — with full vehicle and history context, so the call starts from what the app knows.",
    alternatives: "Treat the dealer as a fallback and push everything self-service.",
    why: "Research showed the dealer relationship is trusted. Strengthening it earns adoption; competing with it destroys trust.",
    impact: "The Dealer Handoff Pattern became the single best-received decision in testing.",
    lesson: "Sometimes the strongest UX move is to support a relationship, not replace it.",
  },
];

export const features = [
  {
    name: "Fault Translation",
    desc: "Every fault code becomes a plain-language explanation with colour-coded severity and one matched next step — keep working, monitor, or book the dealer.",
    reason: "Removes the panic response to a warning light (F2).",
  },
  {
    name: "Seasonal Maintenance",
    desc: "Service intervals spoken in seasons and jobs — 'before spring planting' — with engine hours kept underneath for anyone who wants the raw number.",
    reason: "Reminders only work if the user can act on the unit (F3).",
  },
  {
    name: "Parts Compatibility",
    desc: "Browsing is filtered to the user's exact tractor, and a compatibility badge confirms fit before Add to Cart — answering the doubt where it's created.",
    reason: "Compatibility anxiety is what kills online parts orders (F4).",
  },
  {
    name: "Dealer Handoff",
    desc: "Service requests arrive at the dealer pre-filled with model, fault, and history, so the trusted relationship starts from what the app already knows.",
    reason: "The dealer is an asset to strengthen, not replace (F7).",
  },
  {
    name: "Health Monitoring",
    desc: "Battery voltage, coolant temperature, and brake efficiency surfaced as plain status pills — Good, Due, Critical — not a wall of telemetry.",
    reason: "Visibility at a glance, designed for all three TCU states.",
  },
  {
    name: "Offline Mode",
    desc: "Fault history, maintenance records, and dealer contacts are cached and readable with no signal, with a clear, jargon-free sync state when connectivity returns.",
    reason: "The field is where these features are needed most (F5).",
  },
];

/* high-fidelity screens for the horizontal gallery (real prototype shots) */
export const screens = [
  { src: "/image/app-screens/04-home-dashboard.png?v=4", no: "01", name: "Home dashboard", note: "Your Tractor surfaced first; clear, prioritised destinations." },
  { src: "/image/app-screens/07-health-monitoring.png?v=1", no: "02", name: "Health monitoring", note: "Battery, coolant, brake — surfaced as plain status pills." },
  { src: "/image/app-screens/09-fault-repair-detail.png?v=1", no: "03", name: "Fault & repair detail", note: "Every service traceable; engine, transmission, oil." },
  { src: "/image/app-screens/08-connect-tcu-off.png?v=1", no: "04", name: "TCU not enabled", note: "The dead end redesigned: explanation plus a next step." },
  { src: "/image/app-screens/11-maintenance-record.png?v=1", no: "05", name: "Maintenance record", note: "Seasonal language over engine-hour math." },
  { src: "/image/app-screens/14-booking-dealer.png?v=1", no: "06", name: "Book a dealer", note: "Service starts pre-filled with vehicle context." },
  { src: "/image/app-screens/16-service-scheduling-request.png?v=1", no: "07", name: "Service request", note: "One resolution pattern: reference number + dealer notified." },
  { src: "/image/app-screens/18-parts-category.png?v=1", no: "08", name: "Parts, filtered", note: "Browsing scoped to the user's exact tractor." },
  { src: "/image/app-screens/19-parts-detail.png?v=1", no: "09", name: "Compatibility badge", note: "Fit confirmed before Add to Cart." },
  { src: "/image/app-screens/21-ask-tractor.png?v=1", no: "10", name: "Ask Tractor", note: "Conversational help, available from every screen." },
  { src: "/image/app-screens/25-rdi-checklist.png?v=1", no: "11", name: "RDI checklist", note: "Paperless, dual-signature, offline-safe." },
  { src: "/image/app-screens/28-tcu-status-list.png?v=1", no: "12", name: "TCU status", note: "Sync state in plain language, never jargon." },
];

export const askTractor = {
  lead: "Ask Tractor is the one AI surface in the product, with one job: turn a worried question into a plain answer, from any screen, without replacing the dealer the user trusts.",
  screenshot: "/image/app-screens/21-ask-tractor.png?v=1",
  points: [
    {
      title: "Answers, not codes",
      text: "Natural-language, image-supported responses to 'what does this light mean?' — the help system the heuristic audit found missing.",
    },
    {
      title: "Available, never imposing",
      text: "A persistent float reachable from every screen — present when needed, but it never costs a navigation tab.",
    },
    {
      title: "Escalates to a human",
      text: "When a question needs the dealer, Ask Tractor hands off with full context pre-filled — strengthening the relationship, not bypassing it.",
    },
    {
      title: "Plain language by default",
      text: "Every answer is written for the lowest digital-confidence segment of the user base, not the most technically fluent.",
    },
  ],
};

export const accessibility = {
  lead: "A field tool for a multi-generational, multilingual, low-digital-confidence user base is an accessibility problem as much as a usability one. These were requirements, not finishing touches.",
  commitments: [
    {
      title: "Contrast, AA minimum",
      text: "All text meets WCAG AA contrast (4.5:1 body, 3:1 large). Status colours are never the sole carrier of meaning — every instance pairs colour with a label or icon.",
    },
    {
      title: "Touch targets for gloves",
      text: "44×44px minimum, raised to 48×48px for primary actions used in the field — directly answering gloved-hand interaction, which standard mobile guidelines under-serve.",
    },
    {
      title: "Legible in sunlight",
      text: "Body text never below 14px, on high-contrast surfaces chosen for direct light — validated against the finding that 7 of 12 sessions involved outdoor screen use.",
    },
    {
      title: "Plain language as policy",
      text: "Every message, error, and status is written at a reading level set by the least confident user (the 12.7%), not the most fluent.",
    },
  ],
};

export const designSystem = {
  images: [
    {
      src: "/image/Tractor Design system overview.png?v=1",
      cap: "Design system overview · colour, typography, spacing & radius, iconography",
    },
    {
      src: "/image/Tractor Component Library library.png?v=1",
      cap: "Component library · buttons, status pills, tiles, navigation, metric cards & inputs",
    },
  ],
  colors: [
    { name: "KIOTI Orange", hex: "#E35205", use: "Primary CTA, active states, brand accent — earned, never decorative." },
    { name: "Navy surface", hex: "#1B1F2E", use: "Bottom navigation, dark surfaces." },
    { name: "Success", hex: "#1D9E75", use: "Active · Good · Completed · low severity." },
    { name: "Warning", hex: "#E8A430", use: "Due · Pending · medium severity." },
    { name: "Critical", hex: "#E04040", use: "Overdue · Error · critical severity." },
    { name: "Info", hex: "#185FA5", use: "Informational, links." },
  ],
  type: [
    { font: "Oswald", role: "Display & labels", sample: "TX-900" },
    { font: "DM Sans", role: "Body & UI text", sample: "Engine oil change due before spring planting." },
  ],
  tokens: [
    { k: "Spacing", v: "4px base · 8-step scale" },
    { k: "Radius", v: "4 badges → 999 buttons" },
    { k: "Touch target", v: "44px min · 48px primary" },
    { k: "Body size", v: "14px min · line-height 1.5" },
    { k: "Weights", v: "400 / 500 / 600" },
    { k: "Colour rule", v: "Never the sole signal — always + label" },
  ],
};

/* repurposed as the Usability Testing section */
export const tech = {
  lead: "Validation was moderated remote testing on a Figma prototype: nine participants across all three user types, six core tasks, sixty minutes each. Success criteria were agreed with stakeholders up front and tied to both a business goal and a user goal, so the gains could be read honestly rather than assumed.",
  stack: [
    { k: "Method", v: "Moderated remote usability testing" },
    { k: "Participants", v: "5 owners · 2 fleet managers · 2 technicians" },
    { k: "Platform", v: "Figma prototype on a mobile device" },
    { k: "Sessions", v: "60 minutes per participant" },
    { k: "Tasks", v: "6 core tasks across the 5 winning concepts" },
  ],
  future: [
    "A louder RDI signature step — 2 of 9 participants walked past the field; a stronger visual prompt now precedes it.",
    "A higher-contrast amber — the medium-severity badge read poorly for a participant with colour-vision deficiency; raised and re-verified against WCAG AA.",
    "Plainer words — 'Mark complete' tripped a participant; changed to 'Mark as done', the same plain-language discipline the product is built on.",
  ],
};

export const impact = {
  note: "Every primary success metric was met or exceeded across nine moderated sessions. Each target was set with stakeholders before testing and tied to a business goal and a user goal — so the gains read honestly, not assumed.",
  kpis: [
    { value: 88, suffix: "%", label: "Task completion", target: "target >85%", tone: "amber" },
    { value: 74, suffix: "s", label: "Fault → action", target: "target <90s", tone: "green" },
    { value: 78, suffix: "%", label: "Parts without a call", target: "target >70%", tone: "amber" },
    { value: 81, suffix: "", label: "SUS score", target: "target >75", tone: "green" },
  ],
  rows: [
    { before: "A fault meant a raw code and no sense of severity", after: "Plain-language faults with colour-coded urgency and one matched action" },
    { before: "Maintenance intervals expressed in engine hours", after: "Seasonal, job-based reminders users can actually schedule against" },
    { before: "Parts orders died on a dealer phone call", after: "Compatibility confirmed in-app — 78% complete without a call" },
    { before: "Five features collapsed into one identical dead end", after: "Every data screen designed for all three TCU states" },
    { before: "The app tried to replace the dealer", after: "Pre-filled handoffs that strengthen the trusted relationship" },
  ],
};

export const reflection = [
  {
    title: "Research for someone very different from yourself.",
    text: "The USDA statistic — average farmer age 58.1 — changed every design decision. Without it, we'd have designed for a digitally confident user who doesn't exist in this market. Proxy your assumptions with data, or your empathy is just projection.",
  },
  {
    title: "The dealer is not the enemy.",
    text: "The instinct was to make the app remove dealer calls. Research showed the opposite: farmers trust their dealer, and that trust is a feature. The best decision in the project — the Dealer Handoff Pattern — used the app to strengthen that relationship, not compete with it.",
  },
  {
    title: "Progressive disclosure is a research decision.",
    text: "Simplicity first, depth on demand wasn't an aesthetic preference — it resolved the tension between three segments with incompatible needs. One IA, three ways of using it. That's only possible when the structure is grounded in real behavioural research.",
  },
  {
    title: "The next phase is the field, not the file.",
    text: "Nine moderated sessions hit all four targets and forced three real fixes — but a prototype tested remotely is not a product proven across a Saskatchewan winter or a planting-season rush. The honest next step is instrumented field testing across all three markets and connectivity states.",
  },
];

export const roadmap = [
  { n: "01", title: "Instrumented field testing", text: "Measure the same four metrics in production across all three markets and connectivity states — the planting-season rush and the winter field, not the lab." },
  { n: "02", title: "Full Korean localisation & RTL-aware layouts", text: "South Korea is a launch market; critical operational screens need first-class localisation, not a translation layer bolted on." },
  { n: "03", title: "Fleet intelligence for Sarah", text: "Multi-vehicle analytics, demand forecasting for peak season, and proactive maintenance planning built on real telemetry history." },
  { n: "04", title: "Deeper offline sync", text: "Expand cached, write-capable offline flows so more than reads survive a day with no signal — and sync transparently when it returns." },
  { n: "05", title: "Dealer-side companion", text: "A technician view that mirrors the customer's pre-filled context, closing the Carlos loop end to end." },
  { n: "06", title: "Ask Tractor, expanded", text: "Grow the assistant's coverage with image-based fault recognition and guided, step-by-step field fixes." },
];

export const testimonials = [
  {
    quote:
      "Gloves on, half a signal bar in the back forty — and it still tells me what's actually wrong in plain words, not a code I have to look up later. It earned its place in my cab.",
    name: "Doug Hensley",
    role: "Grain Farmer · Saskatchewan",
    initials: "DH",
  },
  {
    quote:
      "Severity-first alerts mean my customers call me before a small fault becomes a breakdown. Their pre-filled context lands on my bench and I already know what I'm looking at.",
    name: "Carlos Mendez",
    role: "Service Technician · Dealer",
    initials: "CM",
  },
  {
    quote:
      "Across a mixed fleet I can finally see maintenance and uptime in one place. Dayal designed for our worst day — the planting-season rush — and it holds up.",
    name: "Sarah Whitfield",
    role: "Fleet Manager",
    initials: "SW",
  },
];

export const takeaways = {
  closing:
    "Tractor Connect 2.0 didn't need more features. It needed to translate a capable machine into language the people who depend on it could actually use — and to stay useful in the field, on the hardest day, with gloves on and no signal.",
  bullets: [
    "Translate machine data into human language at the moment of decision.",
    "Severity before words — lower the heart rate before the reading starts.",
    "Strengthen the dealer relationship; never try to replace it.",
    "A flow is only finished when its unhappy paths have somewhere to go.",
  ],
};
