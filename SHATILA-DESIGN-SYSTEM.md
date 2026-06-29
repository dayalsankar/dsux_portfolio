# Shatila Dashboards — Design System & Screen Export

Extracted from two Figma code bundles:

| Project | Files | Screens | Figma source |
|---|---|---|---|
| **Shatila AI-Driven Admin Dashboard** | 143 | ~28 | figma.com/design/r8p3EOrLHtE81tEZZkmUDw |
| **Shatila Staff Dashboard V3.0** | 190 | ~52 | figma.com/design/3b0BkfncbrBj4WEFQ3zCTU |

Both apps share **one identical design system** (tokens, motion, UI kit). They differ only in their screen sets. This doc captures the shared system once, then lists screens per app.

---

## 1. Tech & Stack

- **Framework:** React 18 + TypeScript, Vite
- **Styling:** Tailwind CSS v4 (`@theme inline` tokens) + shadcn/ui (Radix primitives)
- **Component library:** 47 shadcn/ui components (full set)
- **Motion:** `motion` (Framer Motion) v12 driven by a shared `motion-tokens.ts`
- **Also bundled:** MUI v7 + Emotion, Recharts, react-hook-form, lucide-react icons, sonner (toasts), embla carousel, react-dnd, canvas-confetti
- **Theming:** `next-themes` with light/dark via `.dark` class
- **Navigation:** single-page state machine (`currentModule` switch), not a router — each "screen" is a module key

---

## 2. Color Tokens

CSS custom properties on `:root` (light) and `.dark`. Colors mix HEX + OKLCH.

### Light theme (core)
| Token | Value | Use |
|---|---|---|
| `--background` | `#F7EEE6` (app shell uses `#F8F9FA`) | Page background (cream/sand) |
| `--foreground` | `oklch(0.145 0 0)` ≈ `#252525` | Primary text |
| `--card` | `#ffffff` | Card surface |
| `--primary` | `#030213` (near-black navy) | Primary buttons, key actions |
| `--primary-foreground` | `#ffffff` | Text on primary |
| `--secondary` | `oklch(0.95 0.0058 264.53)` ≈ `#EBEBF0` | Secondary buttons |
| `--muted` | `#ececf0` | Muted surfaces |
| `--muted-foreground` | `#717182` | Secondary/label text |
| `--accent` | `#e9ebef` | Hover surfaces |
| `--destructive` | `#d4183d` | Delete/error |
| `--border` | `rgba(0,0,0,0.1)` | Hairline borders |
| `--input-background` | `#f3f3f5` | Input fill |
| `--switch-background` | `#cbced4` | Switch track |
| `--ring` | `oklch(0.708 0 0)` | Focus ring |

> Note: The shipped `default_theme.css` uses a **white** `--background: #ffffff`; the active `globals.css` overrides it to **cream `#F7EEE6`**. The app shell wrapper hardcodes `#F8F9FA`.

### Chart palette (light)
`chart-1` `oklch(0.646 0.222 41.116)` (orange) · `chart-2` `oklch(0.6 0.118 184.7)` (teal) · `chart-3` `oklch(0.398 0.07 227.4)` (deep blue) · `chart-4` `oklch(0.828 0.189 84.4)` (yellow) · `chart-5` `oklch(0.769 0.188 70.08)` (gold)

### Sidebar tokens
Dedicated set: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary (#030213)`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`.

### Dark theme
Full dark mapping defined on `.dark` (background `oklch(0.145 0 0)`, foreground near-white, primary inverts to white, charts shift to vivid purples/greens/pinks).

### Functional checkbox color variants
Gradient-filled checkboxes with semantic colors: **blue** (default), **purple** (inventory/products), **green** (success/approval), **orange** (fulfillment/shipping), **red** (critical/delete).

---

## 3. Typography

- **Base size:** `--font-size: 16px` on `html`
- **Weights:** `--font-weight-normal: 400`, `--font-weight-medium: 500` (only two weights used)
- **Line-height:** `1.5` across all base elements
- **Scale** (Tailwind text tokens, all weight-500 except p/input):
  - `h1` → `text-2xl` · `h2` → `text-xl` · `h3` → `text-lg` · `h4` / `p` / `label` / `button` / `input` → `text-base`
- Base typography only applies when no explicit `text-*` class is present (auto-fallback styling).

---

## 4. Radius, Spacing, Borders

- **Radius base:** `--radius: 0.625rem` (10px)
  - `sm` = radius − 4px · `md` = radius − 2px · `lg` = radius · `xl` = radius + 4px
- **Borders:** default 1px hairline at 10% black; global `* { border-border outline-ring/50 }`
- **Buttons (cva sizes):** `default h-9 px-4` · `sm h-8 px-3` · `lg h-10 px-6` · `icon size-9`

### Button variants
`default` (bg-primary) · `destructive` · `outline` · `secondary` · `ghost` · `link`

---

## 5. Motion System (`motion-tokens.ts`)

Unified animation tokens based on Material/IBM Carbon motion principles.

- **Durations (s):** xxs `0.08` · xs `0.14` · sm `0.2` · md `0.26` · lg `0.34` · xl `0.42`
- **Easing:** out `[0.16,1,0.3,1]` · in `[0.12,0,0.39,0]` · inOut `[0.4,0,0.2,1]` · bounce `[0.18,0.89,0.32,1.28]`
- **Springs:** soft / medium / stiff (damping 18–28, stiffness 200–400)
- **Stagger:** xs `0.06` → lg `0.12`
- **Variants:** `screenEntry`, `card`, `row`, `modal`, `badge`, `icon`, `aiGlow`, `aiPulse`, `statusHighlight`
- **Hover:** lift (−2y) · scale (1.015) · glow · iconZoom · **Tap:** compress (0.97) / shrink (0.95)
- **AI animations:** `valueUpdate`, `recommendation` (purple glow `rgba(139,92,246)`), `confidence`, `autoFill` — purple = the "AI is acting" signal color throughout.

---

## 6. Component Library (shadcn/ui — 47 components)

accordion · alert · alert-dialog · aspect-ratio · avatar · badge · breadcrumb · button · calendar · card · carousel · chart · checkbox · collapsible · command · context-menu · dialog · drawer · dropdown-menu · form · hover-card · input · input-otp · label · menubar · navigation-menu · pagination · popover · progress · radio-group · resizable · scroll-area · select · separator · sheet · sidebar · skeleton · slider · sonner · switch · table · tabs · textarea · toggle · toggle-group · tooltip

Plus custom **motion wrappers**: `AIGlowWrapper`, `AnimatedBadge`, `AnimatedCard`, `AnimatedContainer`, `AnimatedIcon`, `AnimatedModal`, `AnimatedNumber`, `AnimatedProgressBar` — and feature cards `AnimatedKPICard`, `AnimatedPipelineCard`, `AnimatedInventoryAlertCard`, `AnimatedActivityItem`.

---

## 7. Screen Inventory — Staff Dashboard V3.0 (~52 screens)

**Layout:** fixed Sidebar (collapsible 64↔256px) + Header + scrollable content. Some screens hide the Header (full-width flows).

- **Dashboard:** Dashboard (KPIs, pipeline, activity)
- **Orders (9):** All Orders · Order Details · Order Entry · Customer Selection · Order Summary Review · Customer Edit · Fulfillment · Shipping Labels · Imported Orders Demo
- **Products & Inventory (5):** Product List · Edit Product · Inventory Levels · Inventory Item Detail · Low-Stock Alerts
- **Customers (2):** Customer List · Customer Details
- **Wholesale (2):** Wholesale Dashboard · Wholesale Order Details
- **Reports (14):** Reports Hub · Sales Summary · Top-Selling Items · Sales by Category · Customer Payment Status · Customer Credit Balances · Credit Memo Report · AR Aging Report · Customer List Report · Inactive Customers · Customer Statements · Shipping Summary · Best Sellers · Production Summary
- **Automation (4):** Address Validation · Label Generator · Reorder Automation · Notifications Automation
- **System Settings (10):** Team Users · Roles & Permissions · Integrations · Settings · My Profile · Change Password · Notifications · My Activity · Appearance · Help Center
- **Admin / System Admin (5):** Admin Dashboard · Company Info · General Settings · Period Closing · Data Maintenance

---

## 8. Screen Inventory — Admin Dashboard (~28 screens)

A focused subset of the same module system (AI-driven admin view).

- **Dashboard:** Admin Dashboard
- **Orders (5):** All Orders · Order Details · Order Entry · Fulfillment · Shipping Labels
- **Products & Inventory (5):** Product List · Edit Product · Inventory Levels · Inventory Item Detail · Low-Stock Alerts
- **Customers (2):** Customer List · Customer Details — includes **AI Auto-Fill Modal** (AI-assisted customer creation)
- **Wholesale (2):** Wholesale Dashboard · Wholesale Order Details
- **Reports (4):** Sales Summary · Shipping Summary · Best Sellers · Production Summary
- **Automation (4):** Address Validation · Label Generator · Reorder Automation · Notifications Automation
- **Settings (5):** Team Users · Roles & Permissions · Role Editor · Integrations

**AI signature features:** AI Auto-Fill modal, AI glow/pulse/recommendation motion states, confidence indicators, auto-fill field highlighting — all keyed to the purple `rgba(139,92,246)` accent.

---

## 9. Quick reference — copy-paste palette

```
Background (cream)   #F7EEE6
App shell            #F8F9FA
Card                 #FFFFFF
Primary (near-black) #030213
Text                 #252525  (oklch 0.145)
Muted text           #717182
Muted surface        #ECECF0
Accent/hover         #E9EBEF
Border               rgba(0,0,0,0.10)
Input fill           #F3F3F5
Destructive          #D4183D
AI accent (purple)   #8B5CF6  (rgba 139,92,246)
Radius               10px
Fonts                weights 400 / 500 only, 16px base, line-height 1.5
```
