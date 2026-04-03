# Nexus Finance OS

A professional-grade personal finance dashboard built with React. Designed and developed with a focus on production quality, clean architecture, and exceptional user experience.

![Nexus Finance OS](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Recharts](https://img.shields.io/badge/Charts-Recharts-22B5BF) ![License](https://img.shields.io/badge/License-MIT-green)

---

## Live Preview

> Open `FinanceDashboard.jsx` in any React 18 project and run immediately — zero configuration needed beyond installing dependencies.

---

## Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn

### Quick Start

```bash
# 1. Scaffold a new React app
npx create-react-app nexus-finance
cd nexus-finance

# 2. Install dependencies
npm install recharts lucide-react

# 3. Replace src/App.js with the component
cp /path/to/FinanceDashboard.jsx src/App.js

# 4. Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) — the app runs immediately with pre-loaded mock data.

### Optional: Build for Production
```bash
npm run build
```

---

## Architecture Overview

The app is a single-file React component (~1000 lines) structured for clarity and maintainability:

```
App (Root)
├── AppContext         — Role, toasts (global state via Context API)
├── Sidebar            — Navigation with collapsible labels
├── Header             — Role switcher, dark mode, notifications
├── MobileNav          — Bottom tab bar for mobile viewports
│
├── Pages/
│   ├── OverviewPage       — Dashboard home with KPI cards + charts
│   ├── TransactionsPage   — Full CRUD table with advanced filters
│   ├── AnalyticsPage      — Multi-chart analytical views
│   ├── BudgetsPage        — Monthly budget tracker with progress bars
│   └── InsightsPage       — Spending analysis + recommendations
│
└── Shared Components/
    ├── StatCard           — Animated KPI card
    ├── AnimatedNumber     — RAF-based number counter
    ├── ChartTooltip       — Themed Recharts tooltip
    ├── TransactionModal   — Add/Edit form with validation
    ├── BudgetBar          — Animated progress bar
    ├── Badge              — Status/category pill
    ├── Skeleton           — Shimmer loading placeholder
    ├── SectionHeader      — Consistent section titling
    └── ToastContainer     — Notification system
```

---

## Feature Breakdown

### Dashboard Overview
- **4 KPI Cards** — Net Balance, Total Income, Total Expenses, Pending Amount
  - Animated counter on load (RAF-based smooth interpolation)
  - Month-over-month percentage change with directional arrow
  - Per-card gradient accent line
- **Balance Trend** — 7-month area chart with gradient fill
- **Spending Donut** — Category breakdown with interactive legend
- **Recent Transactions** — Last 6 entries with skeleton loading state

### Transactions
- **Paginated table** — 15 records per page with full navigation
- **Search** — Real-time search across description, category, and notes
- **Quick filters** — All / Income / Expense toggle
- **Advanced filter panel** (collapsible):
  - Multi-select category filter (toggle pills)
  - Status filter (Cleared / Pending)
  - Amount range (min / max)
  - Date range (from / to)
  - Active filter count badge
- **Sortable columns** — Click any column header to sort ascending/descending
- **Export** — CSV and JSON export of the currently filtered view
- **Role-gated actions** — Edit and Delete buttons only visible to Admin

### Analytics
- **Monthly comparison chart** — Switchable Area / Bar / Line views
- **Category horizontal bar chart** — Color-coded per category
- **Income sources pie chart** — Breakdown with percentages
- All charts use a shared custom tooltip with consistent theming

### Budget Tracker
- **Monthly budget vs actual** — Animated progress bars per category
- **Over-budget alert** — Warning banner when categories exceed limit
- **Inline editing** — Admin can click any category to update its budget
  - Keyboard support: Enter to save, Escape to cancel
  - Budget changes persist to localStorage
- **3 summary cards** — Total Budget, Total Spent, Remaining

### Insights
- **4 insight cards** — Savings Rate, Top Expense, Avg Transaction, Net Surplus
- **Spending intensity table** — Proportional bars for each category
- **Personalized recommendations** — 4 data-driven financial suggestions

### Role-Based UI
| Feature | Viewer | Admin |
|---|---|---|
| View all data | ✅ | ✅ |
| Filter & search | ✅ | ✅ |
| Export CSV/JSON | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |
| Edit budgets | ❌ | ✅ |

Switch via the toggle in the top header. Role is persisted in localStorage.

---

## Optional Enhancements Implemented

| Enhancement | Implementation |
|---|---|
| ✅ Dark mode | System-aware default, toggle in header, persisted |
| ✅ Light mode | Full light theme with matching palette |
| ✅ Data persistence | localStorage for transactions, role, budgets, theme |
| ✅ Mock API simulation | 1.2s loading delay with skeleton screens |
| ✅ Animations & transitions | Page fade-up, staggered cards, animated counters, progress bar fills, modal scale-in, toast slide-up |
| ✅ CSV export | Exports filtered view with all fields |
| ✅ JSON export | Full structured JSON export |
| ✅ Advanced filtering | Date range, amount range, multi-category, status |
| ✅ Keyboard shortcuts | 1–5 for pages, D for dark mode |

---

## State Management

The app uses React's built-in primitives — no external state library needed at this scale.

| State | Location | Persistence |
|---|---|---|
| `transactions` | `App` (root) | localStorage |
| `role` | `AppContext` | localStorage |
| `dark` | `App` (root) | localStorage |
| `budgets` | `BudgetsPage` | localStorage |
| `filters` | `TransactionsPage` | Session only |
| `toasts` | `AppContext` | In-memory |
| `loading` | `App` (root) | In-memory |
| `modal` | `TransactionsPage` | In-memory |

**Why no Redux/Zustand?**  
The state tree is shallow and co-located with its consumers. `AppContext` handles the two truly global concerns (role, toasts). Adding a state library would introduce accidental complexity without benefit at this scope — a deliberate engineering choice, not an omission.

---

## Design Decisions

### Visual Identity
**Name:** Nexus Finance OS — positioned as an operating system for personal finance, not just a dashboard.

**Aesthetic:** Dark-first, premium fintech — deep navy backgrounds (`#080B12`), electric cyan accent (`#38BDF8`), semantic success/danger colors, with ambient radial gradients on the background.

**Typography:**
- **Syne** (display/headings) — geometric, bold, architectural
- **Manrope** (body/UI) — clean, readable, slightly technical
- **IBM Plex Mono** (numbers/data) — prevents layout shift on animated counters, improves data scannability

### UX Principles Applied
1. **Progressive disclosure** — Advanced filters are hidden by default; surface complexity on demand
2. **Contextual feedback** — Every action (add, edit, delete, export, role switch) triggers a toast
3. **Empty states** — The transaction table has a designed empty state with a CTA to clear filters
4. **Loading states** — Skeleton screens on first load simulate async data fetching
5. **Form validation** — Required fields are validated with inline error messages before submission
6. **Keyboard accessibility** — All buttons have `focus-visible` outlines; shortcuts documented

### Responsiveness Strategy
- Sidebar collapses to icon-only at 1024px, hides at 768px
- Mobile bottom navigation appears below 768px
- Stats grids reflow from 4-col → 2-col → 1-col
- Table columns progressively hide on smaller screens
- Chart grids stack vertically on mobile

---

## Data Model

```typescript
interface Transaction {
  id: number;
  date: string;          // ISO date "YYYY-MM-DD"
  description: string;
  category: string;
  amount: number;        // positive = income, negative = expense
  type: "income" | "expense";
  status: "cleared" | "pending";
  note?: string;
}
```

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Safari | ✅ Full |
| Mobile Chrome | ✅ Full |

---

## Assumptions Made

- Currency is Indian Rupee (₹) — formatted using `Intl.NumberFormat` with `en-IN` locale
- "Current month" for budget tracking is April 2025 (matching the latest mock data)
- Mock data covers January–April 2025 with realistic income/expense patterns
- Role switching is frontend-only; a production app would derive role from a JWT or session
- No authentication layer — out of scope for this evaluation
- The `localStorage` keys are namespaced (`fd_txns`, `fd_role`, `fd_dark`, `fd_budgets`) to avoid collisions

---

## Potential Production Extensions

- **Backend integration** — Replace `ALL_TRANSACTIONS` with `useQuery` (React Query / SWR) calls to a REST or GraphQL API
- **Authentication** — JWT-based auth with role claims from backend
- **Real-time** — WebSocket subscriptions for live transaction updates
- **Multi-currency** — Extend `fmtINR` to accept a currency code parameter
- **Recurring transactions** — Add `recurrence` field and a scheduler view
- **Bank sync** — Plaid/Finbox API integration for automatic import
- **PDF reports** — Monthly statement generation using a PDF library

---

## Author

Built as a frontend engineering evaluation submission. Designed with attention to both technical quality and visual craft.
