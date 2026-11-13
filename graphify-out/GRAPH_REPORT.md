# Graph Report - DocTrack  (2026-11-13)

## Corpus Check
- 84 files · ~36,768 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 512 nodes · 912 edges · 27 communities (20 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `27d2c483`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- doctors/page.tsx
- sessionService.ts
- sendResponse
- devDependencies
- dependencies
- compilerOptions
- compilerOptions
- useAnalytics.ts
- playwright.md
- AppShell.tsx
- run_8_test_cases.ts
- extends
- postcss.config.mjs
- next.config.mjs
- tailwind.config.ts
- server/package.json
- 2. Agreed Technical Decisions
- DocTrack Design System
- Doctor Tracker (DocTrack) — Healthcare Administration & Clinical Caseload Portal
- Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code
- Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code
- client/README.md
- graphify
- workflows/graphify.md
- middleware.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 27 edges
2. `useUIStore` - 25 edges
3. `sendResponse()` - 22 edges
4. `AppError` - 19 edges
5. `compilerOptions` - 15 edges
6. `express` - 15 edges
7. `Button` - 14 edges
8. `compilerOptions` - 12 edges
9. `SelectDropdown()` - 10 edges
10. `useAuth()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/app/login/page.tsx → client/src/context/AuthContext.tsx
- `AppShell()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/layout/AppShell.tsx → client/src/lib/utils.ts
- `AppShell()` --calls--> `useUIStore`  [EXTRACTED]
  client/src/components/layout/AppShell.tsx → client/src/store/useUIStore.ts
- `Sidebar()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/layout/Sidebar.tsx → client/src/lib/utils.ts
- `Sidebar()` --calls--> `useUIStore`  [EXTRACTED]
  client/src/components/layout/Sidebar.tsx → client/src/store/useUIStore.ts

## Import Cycles
- None detected.

## Communities (27 total, 7 thin omitted)

### Community 0 - "doctors/page.tsx"
Cohesion: 0.08
Nodes (65): DoctorsPage(), SORT_OPTIONS, SPECIALIZATION_FILTERS, GENDER_OPTIONS, PatientsPage(), SORT_OPTIONS, CONDITION_OPTIONS, SessionsPage() (+57 more)

### Community 1 - "sessionService.ts"
Cohesion: 0.07
Nodes (46): doctrack, healthcare, mongoose, typescript, keywords, Doctor, DoctorSchema, IDoctor (+38 more)

### Community 2 - "sendResponse"
Cohesion: 0.07
Nodes (47): express, app, createApp(), connectDB(), supabase, supabaseAdmin, AnalyticsController, getAnalyticsSummary (+39 more)

### Community 3 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, eslint-config-next, postcss, tailwindcss, @types/node, @types/react, @types/react-dom (+17 more)

### Community 4 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, clsx, lucide-react, next, react, react-dom, recharts, @supabase/ssr (+15 more)

### Community 6 - "compilerOptions"
Cohesion: 0.08
Nodes (25): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+17 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): dist, ES2022, src/**/*, compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module (+10 more)

### Community 8 - "useAnalytics.ts"
Cohesion: 0.13
Nodes (14): DashboardPage(), PIE_COLORS, IAnalyticsKPIs, IAnalyticsSummary, ICaseloadDistribution, ISpecializationDistribution, IStatusBreakdown, ITemporalTrend (+6 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.16
Nodes (13): metadata, LoginPage(), AppShell(), NavItem, navItems, Sidebar(), TopBar(), QueryProvider() (+5 more)

### Community 11 - "run_8_test_cases.ts"
Cohesion: 0.50
Nodes (4): ITestResult, logResult(), results, runTests()

### Community 12 - "extends"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

### Community 17 - "server/package.json"
Cohesion: 0.05
Nodes (42): cookie-parser, cors, dotenv, express, jsonwebtoken, mongoose, author, dependencies (+34 more)

### Community 18 - "2. Agreed Technical Decisions"
Cohesion: 0.08
Nodes (24): 1. Project Overview, 2.1 System Architecture, 2.2 Authentication & Authorization, 2.3 Database & Data Modeling (Approach 4A), 2.4 Patient Addition & Session Workflow, 2.5 Client State Management & Data Fetching, 2.6 UI & Visual Analytics, 2.7 Documentation Deliverables (README Compliance) (+16 more)

### Community 19 - "DocTrack Design System"
Cohesion: 0.11
Nodes (17): 1. Design Direction, 2. Brand, 3. Color System, 4. Typography, 5. Spacing & Dimensions, 6. Radius & Shadows, 7. Layout & Navigation, Analytics colors (+9 more)

### Community 20 - "Doctor Tracker (DocTrack) — Healthcare Administration & Clinical Caseload Portal"
Cohesion: 0.08
Nodes (23): 1. Project Links & Credentials, 2. Description, 3.1 Prerequisites, 3.2 Environment Configuration Files (`.env.example`), 3.3 Backend Setup & Database Seeding (`server/`), 3.4 Frontend Setup & UI Launch (`client/`), 3.5 Automated Test Suite Execution, 3. Setup Guide (+15 more)

### Community 22 - "Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code"
Cohesion: 0.22
Nodes (8): 1. Mandatory DRY (Don't Repeat Yourself), 2. Clean & Human-Readable Code, 3. Simplicity Over Cleverness (KISS Principle), 4. Mandatory Knowledge Graph Protocol (graphify), 5. Playwright MCP Tool Restriction, Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code, DocTrack Coding & Architecture Rules, Rules for Every Model Call:

### Community 23 - "Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code"
Cohesion: 0.22
Nodes (8): 1. Mandatory DRY (Don't Repeat Yourself), 2. Clean & Human-Readable Code, 3. Simplicity Over Cleverness (KISS Principle), 4. Mandatory Knowledge Graph Protocol (graphify), 5. Playwright MCP Tool Restriction, Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code, DocTrack Coding & Architecture Rules, Rules for Every Model Call:

### Community 24 - "client/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **230 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `nextConfig`, `name`, `version` (+225 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `sessionService.ts` to `server/package.json`, `sendResponse`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `express` connect `sendResponse` to `sessionService.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `mongoose` connect `sessionService.ts` to `sendResponse`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `nextConfig` to the rest of the system?**
  _230 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `doctors/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0766541822721598 - nodes in this community are weakly interconnected._
- **Should `sessionService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06641604010025062 - nodes in this community are weakly interconnected._
- **Should `sendResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.0673903211216644 - nodes in this community are weakly interconnected._