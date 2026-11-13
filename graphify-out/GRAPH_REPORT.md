# Graph Report - DocTrack  (2026-11-13)

## Corpus Check
- 86 files · ~37,698 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 517 nodes · 939 edges · 26 communities (19 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5beaf925`
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
- apiClient.ts
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
1. `cn()` - 30 edges
2. `useUIStore` - 25 edges
3. `sendResponse()` - 22 edges
4. `AppError` - 19 edges
5. `Button` - 15 edges
6. `express` - 15 edges
7. `compilerOptions` - 15 edges
8. `compilerOptions` - 12 edges
9. `DoctorsPage()` - 10 edges
10. `SelectDropdown()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Sidebar()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/layout/Sidebar.tsx → client/src/lib/utils.ts
- `Sidebar()` --calls--> `useUIStore`  [EXTRACTED]
  client/src/components/layout/Sidebar.tsx → client/src/store/useUIStore.ts
- `createApp()` --indirect_call--> `errorHandler()`  [INFERRED]
  server/src/app.ts → server/src/middleware/errorHandler.ts
- `getAllDoctorsFromDB()` --calls--> `escapeRegex()`  [EXTRACTED]
  server/src/services/doctorService.ts → server/src/utils/escapeRegex.ts
- `getDoctorByIdFromDB()` --calls--> `AppError`  [EXTRACTED]
  server/src/services/doctorService.ts → server/src/utils/AppError.ts

## Import Cycles
- None detected.

## Communities (26 total, 7 thin omitted)

### Community 0 - "doctors/page.tsx"
Cohesion: 0.07
Nodes (70): DoctorsPage(), SORT_OPTIONS, SPECIALIZATION_FILTERS, GENDER_OPTIONS, PatientsPage(), SORT_OPTIONS, CONDITION_OPTIONS, SessionsPage() (+62 more)

### Community 1 - "sessionService.ts"
Cohesion: 0.07
Nodes (44): doctrack, healthcare, mongoose, typescript, keywords, Doctor, DoctorSchema, IDoctor (+36 more)

### Community 2 - "sendResponse"
Cohesion: 0.07
Nodes (49): express, app, createApp(), connectDB(), supabase, supabaseAdmin, AnalyticsController, getAnalyticsSummary (+41 more)

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
Cohesion: 0.20
Nodes (10): DashboardPage(), PIE_COLORS, IAnalyticsKPIs, IAnalyticsSummary, ICaseloadDistribution, ISpecializationDistribution, IStatusBreakdown, ITemporalTrend (+2 more)

### Community 10 - "apiClient.ts"
Cohesion: 0.13
Nodes (17): metadata, AppShell(), NavItem, navItems, Sidebar(), TopBar(), QueryProvider(), AuthContext (+9 more)

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
Cohesion: 0.09
Nodes (22): 1. Project Links & Credentials, 2. Description, 3.1 Prerequisites, 3.2 Environment Configuration Files (`.env.example`), 3.3 Backend Setup & Database Seeding (`server/`), 3.4 Frontend Setup & UI Launch (`client/`), 3. Setup Guide, 4.1 Architectural Diagram (+14 more)

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
- **230 isolated node(s):** `1. Project Links & Credentials`, `2. Description`, `3.1 Prerequisites`, `Step 1: Clone Repository`, `Step 2: Configure Backend Environment Variables (`server/.env`)` (+225 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `sessionService.ts` to `server/package.json`, `sendResponse`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `express` connect `sendResponse` to `sessionService.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `mongoose` connect `sessionService.ts` to `sendResponse`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `1. Project Links & Credentials`, `2. Description`, `3.1 Prerequisites` to the rest of the system?**
  _230 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `doctors/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06811881188118812 - nodes in this community are weakly interconnected._
- **Should `sessionService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06954887218045112 - nodes in this community are weakly interconnected._
- **Should `sendResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.06648575305291723 - nodes in this community are weakly interconnected._