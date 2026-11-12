# Doctor Tracker — Project Blueprint & Operational Plan

**Document Version:** 1.0.0  
**Project Scope:** Doctor & Patient Management Administrative Portal  
**Sprint Window:** 36 Hours (Estimated Active Work: 16–22 Hours)

---

## 1. Project Overview
Doctor Tracker is a secure, high-performance administrative web application enabling authenticated administrators to manage doctors, patients, and their clinical sessions. The project places strong emphasis on database query optimization (indexing, aggregation), clean UX, and rich analytics visualization.

---

## 2. Agreed Technical Decisions

### 2.1 System Architecture
- **Decoupled Architecture (Option A)**:
  - `client/`: Next.js frontend application (App Router, React Server & Client Components).
  - `server/`: Standalone Node.js + Express REST API server.
- **Language**: **TypeScript** end-to-end across both frontend and backend for strict type safety, predictable DTO contracts, and shared interfaces.

### 2.2 Authentication & Authorization
- **Provider**: **Supabase Auth**.
- **Session Transport (Option A)**:
  - Next.js uses `@supabase/ssr` to store session tokens in secure browser cookies.
  - Client REST API requests to Express include cookies automatically via `credentials: 'include'` / `withCredentials: true`.
  - Express uses `cookie-parser` and validates the Supabase JWT using the Supabase JWT secret / Supabase client.
  - Express CORS configuration: `origin: CLIENT_URL`, `credentials: true`.
- **Route Guards**:
  - Next.js middleware protects client routes (`/dashboard`, `/doctors`, `/patients`) from unauthenticated access.
  - Express middleware (`authMiddleware`) enforces authentication and `admin` authorization on all protected REST endpoints.

### 2.3 Database & Data Modeling (Approach 4A)
- **Database**: MongoDB with **Mongoose ODM**.
- **Philosophy**: Patients are treated as clinical sessions/encounters, acknowledging that a single patient can consult different doctors for different conditions over time.
- **Collections & Schemas**:
  1. **`Doctor`**:
     - Fields: `name`, `specialization`, `hospital`, `phone`, `email`, `createdAt`, `updatedAt`.
     - Indexes: Compound text index on `name`, `specialization`, `hospital` for high-speed search; index on `createdAt` for date filtering.
  2. **`Patient`**:
     - Fields: `name`, `phone`, `email`, `age`/`dob`, `gender`, `createdAt`, `updatedAt`.
     - Indexes: Unique/sparse index on `email`/`phone`; text index on `name`.
  3. **`PatientSession`**:
     - Fields:
       - `patientId`: `mongoose.Schema.Types.ObjectId`, ref: `'Patient'`, indexed.
       - `doctorId`: `mongoose.Schema.Types.ObjectId`, ref: `'Doctor'`, indexed.
       - `condition`: String (e.g., "Cardiovascular Checkup", "Type-2 Diabetes"), indexed.
       - `sessionDate`: Date, indexed.
       - `appointmentAt`: String (time format, e.g., `"10:30 AM"`).
       - `status`: String enum: `['scheduled', 'active', 'completed', 'cancelled']`, indexed.
       - `notes`: String (optional clinical notes).
       - Timestamps: `createdAt`, `updatedAt`.
     - Indexes: Compound index on `{ doctorId: 1, sessionDate: -1 }`, `{ status: 1 }`, and `{ condition: 1 }`.

### 2.4 Patient Addition & Session Workflow
- **Decoupled Creation**: Doctors and Patients are created completely separately in their own master collections via their respective endpoints (`POST /api/doctors` and `POST /api/patients`).
- **Connecting Doctors & Patients (`POST /api/sessions`)**:
  - Doctor and patient records are connected by creating a record in the `PatientSession` model.
  - **Body Parameters**: Both `doctorId` and `patientId` must be passed inside the request body (e.g., `{ doctorId, patientId, condition, sessionDate, appointmentAt, status, notes }`) to `POST /api/sessions`, rather than as path parameters.
- **Session Disassociation**: Deleting or cancelling a session removes or cancels that specific `PatientSession` without destroying the independent master records of either the patient or doctor.

### 2.5 Client State Management & Data Fetching
- **Server State / Caching / Pagination**: **TanStack Query (React Query)**:
  - Automatic query caching, background re-validation, optimistic UI updates, and query invalidation.
  - Server-side pagination and debounce search query keys.
- **Global UI State**: **Zustand**:
  - Lightweight store for modals, active filters, sidebar navigation states, and transient UI selections.

### 2.6 UI & Visual Analytics
- **Styling & Components**: **Tailwind CSS**, **CSS Modules**, and **Shadcn UI** (Radix UI primitives).
- **Design Delivery**: The user delivers the design system, components, and UI layout.
- **Visual Analytics**: **Recharts** for rendering responsive KPI charts:
  - Doctor patient load distribution (Bar chart).
  - Time-series patient visits/registrations trends (Area/Line chart).
  - Patient status breakdown (Donut/Pie chart).

### 2.7 Documentation Deliverables (README Compliance)
- A standardized `README.md` containing:
  - One-paragraph **Elevator Pitch**.
  - **Setup Guide** with step-by-step local setup and `.env.example` guidance for both frontend and backend.
  - **System Architecture** diagram detailing data flow between Next.js, Express, Supabase, and MongoDB.
  - **Technical Decisions**: Deep dive into 2 specific engineering choices.
  - **Visual Evidence**: High-resolution screenshots of Desktop and Mobile UI.

---

## 3. Operational Protocol: How I Will Operate as Your Coding Agent

To ensure complete alignment, predictability, and quality throughout the project lifecycle, I will strictly adhere to the following operational rules:

### Rule 1: Always Ask for Technical & Engineering Decisions First
- I will **never** make unilateral assumptions or architectural pivots on my own.
- Before introducing new dependencies, changing schema structures, selecting algorithms, or modifying API contracts, I will clearly present the options, trade-offs, and recommendations, and wait for your explicit decision.

### Rule 2: Strictly Adhere to the Stated Tech Stack
- The project will strictly use **Next.js**, **Node.js + Express**, **TypeScript**, **MongoDB (Mongoose)**, **Supabase Auth**, **TanStack Query**, **Zustand**, **Tailwind CSS / Shadcn UI**, and **Recharts**.
- No unauthorized external frameworks or substitute tools will be introduced.

### Rule 3: Wait for UI & Design System Assets
- All UI structure, styling conventions, component hierarchy, and layout details will be derived directly from the design system and UI specifications you deliver.
- Placeholder styling will only be used if explicitly requested by you.

### Rule 4: No Unsolicited Code Execution ("Code on Command")
- No production code will be scaffolded, written, or modified until you explicitly review the current state and issue the instruction to start coding.

### Rule 5: Step-by-Step Iteration & Verification
- Work will proceed sequentially through the established milestones.
- At the end of each sub-module, I will run compilation checks, type checks, and verify endpoint responses before requesting your review and moving to the next phase.

### Rule 6: Mandatory DRY, Clean, & Human-Readable Code
- **DRY (Don't Repeat Yourself)**:
  - Extract and reuse components, custom hooks, utilities, and helper functions across the codebase.
  - No duplicate UI logic, repetitive styling patterns, or redundant API calls.
  - Consolidate TypeScript contracts, DTO types, and constants in shared definition modules.
- **Human-Readable & Clean**:
  - Code must be clear, well-structured, and easy for any engineer to read and comprehend immediately.
  - Intuitive, self-explanatory naming conventions for variables, methods, and components.
- **Simplicity Over Cleverness (KISS)**:
  - Avoid over-engineering, premature generalizations, and convoluted design patterns.
  - Keep logic straightforward, simple, and maintainable.

---

## 4. Execution Plan & Milestone Schedule

```
Hours 00 - 03: Milestone 1 — Project Scaffolding & Environment Setup
Hours 03 - 08: Milestone 2 — Mongoose Schemas, Seeder & Express REST APIs
Hours 08 - 15: Milestone 3 — Next.js Layout, Supabase Cookie Auth & Core Management UI
Hours 15 - 18: Milestone 4 — Admin Dashboard & Recharts Analytics
Hours 18 - 21: Milestone 5 — Query Optimization, Index Tuning & Responsive Polish
Hours 21 - 24: Milestone 6 — README Documentation, Verification & UI Screenshots
Hours 24 - 36: Buffer Window — Reviews, Revisions & Submission Preparation
```

### Milestone 1: Scaffolding & Setup (Estimated: 2–3 Hours)
1. Initialize decoupled repository layout (`client/` and `server/`).
2. Configure TypeScript, ESLint, and environment configurations (`.env.example`).
3. Set up Express server with `cors`, `cookie-parser`, JSON parsing, and MongoDB connection.
4. Initialize Next.js project with Tailwind CSS, Shadcn UI base, and `@supabase/ssr`.

### Milestone 2: Backend REST APIs & Mongoose Models (Estimated: 4–5 Hours)
1. Implement Mongoose schemas: `Doctor`, `Patient`, `PatientSession` with compound indexes.
2. Build database seed script (`npm run seed`) with comprehensive clinical sample data.
3. Build Supabase JWT verification middleware.
4. Implement REST controllers:
   - Doctor endpoints (CRUD, search, date/specialization filter, pagination).
   - Session endpoints (`POST /api/sessions` with `doctorId` & `patientId` in body, `GET /api/sessions`, `DELETE /api/sessions/:id`).
   - Patient endpoints (CRUD, search, condition/date filter, pagination).
   - Analytics endpoint using MongoDB aggregation pipelines (`$group`, `$lookup`, `$facet`).

### Milestone 3: Frontend Layout, Auth & Management Modules (Estimated: 6–7 Hours)
1. Configure TanStack Query client, Zustand UI store, and Supabase client helpers.
2. Build Auth flow: Login page, route guard middleware.
3. Build responsive App Shell: Sidebar, header, active route navigation.
4. Build Doctor Management module:
   - Paginated data table/cards with debounced search and filters.
   - Doctor creation modal with validation.
   - Session creation modal (selects doctor & patient, connects them via `POST /api/sessions`).
   - Doctor's patient session list with cancellation/deletion action.
5. Build Patient Management module:
   - Dedicated patient directory table with search, condition filter, and pagination.
   - Patient edit and delete modals.

### Milestone 4: Admin Dashboard & Data Visualization (Estimated: 2–3 Hours)
1. Build summary KPI metric cards (Total Doctors, Total Patients, Average Load, Active Sessions).
2. Integrate Recharts visualizations:
   - Bar chart: Doctor patient volume distribution.
   - Area chart: Date-based patient registration/session trend.
3. Hook dashboard data to optimized backend aggregation endpoint.

### Milestone 5: Optimization & Quality Assurance (Estimated: 2–3 Hours)
1. Validate database query execution plans (`explain()`) ensuring index utilization.
2. Confirm debouncing on all search inputs to prevent server query flooding.
3. Check responsive design across mobile, tablet, and desktop viewports.
4. Verify error handling and empty states across all UI views.

### Milestone 6: Documentation & Final Delivery (Estimated: 2–3 Hours)
1. Author comprehensive `README.md` following the standardized requirements.
2. Capture high-quality desktop and mobile screenshots for the Visual Evidence section.
3. Final review and preparation for submission.
