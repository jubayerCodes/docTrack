# Graph Report - DocTrack  (2026-11-13)

## Corpus Check
- 79 files · ~31,967 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 488 nodes · 818 edges · 27 communities (21 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `939d46c7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- doctors/page.tsx
- sessionService.ts
- sendResponse
- devDependencies
- dependencies
- server/package.json
- compilerOptions
- compilerOptions
- useAnalytics.ts
- AppShell.tsx
- run_8_test_cases.ts
- extends
- postcss.config.mjs
- next.config.mjs
- tailwind.config.ts
- 2. Agreed Technical Decisions
- DocTrack Design System
- DocTrack — Healthcare Administration & Clinical Caseload Management Platform
- devDependencies
- Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code
- Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code
- client/README.md
- graphify
- workflows/graphify.md
- middleware.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 25 edges
2. `sendResponse()` - 22 edges
3. `useUIStore` - 21 edges
4. `AppError` - 19 edges
5. `compilerOptions` - 15 edges
6. `express` - 15 edges
7. `compilerOptions` - 13 edges
8. `Button` - 11 edges
9. `DocTrack — Healthcare Administration & Clinical Caseload Management Platform` - 10 edges
10. `mongoose` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AppShell()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/layout/AppShell.tsx → client/src/lib/utils.ts
- `AppShell()` --calls--> `useUIStore`  [EXTRACTED]
  client/src/components/layout/AppShell.tsx → client/src/store/useUIStore.ts
- `Sidebar()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/layout/Sidebar.tsx → client/src/lib/utils.ts
- `Sidebar()` --calls--> `useUIStore`  [EXTRACTED]
  client/src/components/layout/Sidebar.tsx → client/src/store/useUIStore.ts
- `UIState` --references--> `IPatient`  [EXTRACTED]
  client/src/store/useUIStore.ts → client/src/types/index.ts

## Import Cycles
- None detected.

## Communities (27 total, 6 thin omitted)

### Community 0 - "doctors/page.tsx"
Cohesion: 0.07
Nodes (58): DoctorsPage(), SORT_OPTIONS, SPECIALIZATION_FILTERS, CONDITION_OPTIONS, PatientsPage(), STATUS_OPTIONS, TopBar(), ActionMenu() (+50 more)

### Community 1 - "sessionService.ts"
Cohesion: 0.06
Nodes (46): doctrack, healthcare, mongoose, typescript, keywords, Doctor, DoctorSchema, IDoctor (+38 more)

### Community 2 - "sendResponse"
Cohesion: 0.07
Nodes (46): express, app, createApp(), connectDB(), supabase, supabaseAdmin, AnalyticsController, getAnalyticsSummary (+38 more)

### Community 3 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, eslint-config-next, postcss, tailwindcss, @types/node, @types/react, @types/react-dom (+17 more)

### Community 4 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, clsx, lucide-react, next, react, react-dom, recharts, @supabase/ssr (+15 more)

### Community 5 - "server/package.json"
Cohesion: 0.07
Nodes (26): cookie-parser, cors, dotenv, express, jsonwebtoken, mongoose, author, dependencies (+18 more)

### Community 6 - "compilerOptions"
Cohesion: 0.08
Nodes (25): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+17 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (19): dist, ES2022, src/**/*, compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module (+11 more)

### Community 8 - "useAnalytics.ts"
Cohesion: 0.15
Nodes (13): DashboardPage(), PIE_COLORS, IAnalyticsKPIs, IAnalyticsSummary, ICaseloadDistribution, ISpecializationDistribution, IStatusBreakdown, ITemporalTrend (+5 more)

### Community 10 - "AppShell.tsx"
Cohesion: 0.18
Nodes (11): metadata, AppShell(), NavItem, navItems, Sidebar(), QueryProvider(), AuthContext, AuthContextType (+3 more)

### Community 11 - "run_8_test_cases.ts"
Cohesion: 0.50
Nodes (4): ITestResult, logResult(), results, runTests()

### Community 12 - "extends"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

### Community 18 - "2. Agreed Technical Decisions"
Cohesion: 0.08
Nodes (24): 1. Project Overview, 2.1 System Architecture, 2.2 Authentication & Authorization, 2.3 Database & Data Modeling (Approach 4A), 2.4 Patient Addition & Session Workflow, 2.5 Client State Management & Data Fetching, 2.6 UI & Visual Analytics, 2.7 Documentation Deliverables (README Compliance) (+16 more)

### Community 19 - "DocTrack Design System"
Cohesion: 0.11
Nodes (17): 1. Design Direction, 2. Brand, 3. Color System, 4. Typography, 5. Spacing & Dimensions, 6. Radius & Shadows, 7. Layout & Navigation, Analytics colors (+9 more)

### Community 20 - "DocTrack — Healthcare Administration & Clinical Caseload Management Platform"
Cohesion: 0.12
Nodes (16): 1. Project Overview & Elevator Pitch, 2. Key Features, 3. System Architecture & Data Flow, 4. Deep-Dive: Core Technical Decisions, 5. Security Architecture & Threat Mitigation, 6.1 Prerequisites, 6.2 Backend Setup (`server/`), 6.3 Frontend Setup (`client/`) (+8 more)

### Community 21 - "devDependencies"
Cohesion: 0.12
Nodes (17): rimraf, devDependencies, rimraf, ts-node-dev, @types/cookie-parser, @types/cors, @types/express, @types/jsonwebtoken (+9 more)

### Community 22 - "Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code"
Cohesion: 0.25
Nodes (7): 1. Mandatory DRY (Don't Repeat Yourself), 2. Clean & Human-Readable Code, 3. Simplicity Over Cleverness (KISS Principle), 4. Mandatory Knowledge Graph Protocol (graphify), Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code, DocTrack Coding & Architecture Rules, Rules for Every Model Call:

### Community 23 - "Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code"
Cohesion: 0.25
Nodes (7): 1. Mandatory DRY (Don't Repeat Yourself), 2. Clean & Human-Readable Code, 3. Simplicity Over Cleverness (KISS Principle), 4. Mandatory Knowledge Graph Protocol (graphify), Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code, DocTrack Coding & Architecture Rules, Rules for Every Model Call:

### Community 24 - "client/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **218 isolated node(s):** `Rules for Every Model Call:`, `Workflow: graphify`, `1. Mandatory DRY (Don't Repeat Yourself)`, `2. Clean & Human-Readable Code`, `3. Simplicity Over Cleverness (KISS Principle)` (+213 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `sessionService.ts` to `sendResponse`, `server/package.json`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `express` connect `sendResponse` to `sessionService.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `mongoose` connect `sessionService.ts` to `sendResponse`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `Rules for Every Model Call:`, `Workflow: graphify`, `1. Mandatory DRY (Don't Repeat Yourself)` to the rest of the system?**
  _218 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `doctors/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07467630231857875 - nodes in this community are weakly interconnected._
- **Should `sessionService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06271186440677966 - nodes in this community are weakly interconnected._
- **Should `sendResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.07192460317460317 - nodes in this community are weakly interconnected._