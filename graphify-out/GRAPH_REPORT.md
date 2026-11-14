# Graph Report - DocTrack  (2026-11-14)

## Corpus Check
- 87 files · ~40,716 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 533 nodes · 991 edges · 28 communities (21 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f927ae4e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sessions/page.tsx
- sessionService.ts
- sendResponse
- devDependencies
- dependencies
- compilerOptions
- compilerOptions
- apiClient.ts
- playwright.md
- app.ts
- run_8_test_cases.ts
- extends
- postcss.config.mjs
- next.config.mjs
- tailwind.config.ts
- server/package.json
- 2. Agreed Technical Decisions
- DocTrack Design System
- Doctor Tracker (DocTrack) — Healthcare Administration & Clinical Caseload Portal
- Skeleton.tsx
- Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code
- Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code
- client/README.md
- graphify
- workflows/graphify.md
- middleware.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 37 edges
2. `useUIStore` - 25 edges
3. `sendResponse()` - 22 edges
4. `AppError` - 19 edges
5. `Button` - 15 edges
6. `compilerOptions` - 15 edges
7. `express` - 15 edges
8. `compilerOptions` - 12 edges
9. `DoctorsPage()` - 10 edges
10. `PatientsPage()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `LoginPage()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/app/login/page.tsx → client/src/context/AuthContext.tsx
- `Skeleton()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/ui/Skeleton.tsx → client/src/lib/utils.ts
- `ChartSkeleton()` --calls--> `cn()`  [EXTRACTED]
  client/src/components/ui/Skeleton.tsx → client/src/lib/utils.ts
- `UIState` --references--> `IPatient`  [EXTRACTED]
  client/src/store/useUIStore.ts → client/src/types/index.ts
- `createApp()` --indirect_call--> `errorHandler()`  [INFERRED]
  server/src/app.ts → server/src/middleware/errorHandler.ts

## Import Cycles
- None detected.

## Communities (28 total, 7 thin omitted)

### Community 0 - "sessions/page.tsx"
Cohesion: 0.06
Nodes (80): DoctorsPage(), SORT_OPTIONS, SPECIALIZATION_FILTERS, LoginPage(), GENDER_OPTIONS, PatientsPage(), SORT_OPTIONS, CONDITION_OPTIONS (+72 more)

### Community 1 - "sessionService.ts"
Cohesion: 0.08
Nodes (40): mongoose, Doctor, DoctorSchema, IDoctor, IPatient, Patient, PatientSchema, IPatientSession (+32 more)

### Community 2 - "sendResponse"
Cohesion: 0.08
Nodes (46): express, supabase, supabaseAdmin, AnalyticsController, getAnalyticsSummary, createDoctor, deleteDoctor, DoctorController (+38 more)

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

### Community 8 - "apiClient.ts"
Cohesion: 0.16
Nodes (13): metadata, viewport, QueryProvider(), AuthContext, AuthContextType, AuthProvider(), ApiClientError, getAccessToken() (+5 more)

### Community 10 - "app.ts"
Cohesion: 0.33
Nodes (6): app, createApp(), connectDB(), errorHandler(), router, startServer()

### Community 11 - "run_8_test_cases.ts"
Cohesion: 0.50
Nodes (4): ITestResult, logResult(), results, runTests()

### Community 12 - "extends"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

### Community 17 - "server/package.json"
Cohesion: 0.04
Nodes (46): cookie-parser, cors, dotenv, express, jsonwebtoken, mongoose, doctrack, healthcare (+38 more)

### Community 18 - "2. Agreed Technical Decisions"
Cohesion: 0.08
Nodes (24): 1. Project Overview, 2.1 System Architecture, 2.2 Authentication & Authorization, 2.3 Database & Data Modeling (Approach 4A), 2.4 Patient Addition & Session Workflow, 2.5 Client State Management & Data Fetching, 2.6 UI & Visual Analytics, 2.7 Documentation Deliverables (README Compliance) (+16 more)

### Community 19 - "DocTrack Design System"
Cohesion: 0.11
Nodes (17): 1. Design Direction, 2. Brand, 3. Color System, 4. Typography, 5. Spacing & Dimensions, 6. Radius & Shadows, 7. Layout & Navigation, Analytics colors (+9 more)

### Community 20 - "Doctor Tracker (DocTrack) — Healthcare Administration & Clinical Caseload Portal"
Cohesion: 0.09
Nodes (22): 1. Project Links & Credentials, 2. Description, 3.1 Prerequisites, 3.2 Environment Configuration Files (`.env.example`), 3.3 Backend Setup & Database Seeding (`server/`), 3.4 Frontend Setup & UI Launch (`client/`), 3. Setup Guide, 4.1 Architectural Diagram (+14 more)

### Community 21 - "Skeleton.tsx"
Cohesion: 0.14
Nodes (15): DashboardPage(), PIE_COLORS, CardListSkeletonProps, ChartSkeleton(), DonutSkeleton(), Skeleton(), SkeletonProps, TableSkeletonProps (+7 more)

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
- **236 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `nextConfig`, `name`, `version` (+231 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `server/package.json` to `sessionService.ts`, `sendResponse`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `express` connect `sendResponse` to `server/package.json`, `app.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `mongoose` connect `sessionService.ts` to `server/package.json`, `app.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `nextConfig` to the rest of the system?**
  _236 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sessions/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06256792423536718 - nodes in this community are weakly interconnected._
- **Should `sessionService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07764876632801161 - nodes in this community are weakly interconnected._
- **Should `sendResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.07514124293785311 - nodes in this community are weakly interconnected._