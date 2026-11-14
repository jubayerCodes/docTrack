# Doctor Tracker (DocTrack) — Healthcare Administration & Clinical Caseload Portal

> DocTrack is an enterprise-grade healthcare administrative portal engineered for medical supervisors and clinical directors. Built with a decoupled architecture (**Next.js 14 App Router** frontend and standalone **Node.js/Express REST API** backed by **MongoDB Atlas**), DocTrack empowers healthcare networks to manage practitioner directories, balance patient caseloads, schedule clinical encounters via specialized calendar pickers, and visualize operational intelligence through real-time Recharts analytics.

---

## 1. Project Links & Credentials

- **GitHub Repository**: [https://github.com/jubayerCodes/docTrack.git](https://github.com/jubayerCodes/docTrack.git)
- **Frontend Web Portal**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api/v1`
- **API Health Endpoint**: `http://localhost:5000/api/health`
- **Default Administrator Credentials**:
  - **Email**: `admin@doctrack.com`
  - **Password**: `Password123!`
  - *(Click "Autofill" on the `/login` portal page to load demo administrator credentials)*
- **New User Registration**:
  - Visit `http://localhost:3000/register` to create a new staff account with Name, Email, and Password. New accounts default to the **Standard User** role with access to `/dashboard`.
  - *Note: `DEV_MODE=true` is enabled by default in local configurations, providing safe automated mock administrative authentication for local development and integration testing.*

---

## 2. Description

**Doctor Tracker (DocTrack)** is a secure, high-performance administrative web application engineered for healthcare institutions to efficiently manage medical practitioners, track clinical patient caseloads, and schedule healthcare encounters through intuitive, atomic workflows. Built on a decoupled monorepo architecture featuring Next.js 14 App Router and a standalone Node.js/Express REST API on MongoDB Atlas, the platform resolves critical operational bottlenecks such as practitioner burnout and fragmented scheduling by unifying real-time doctor directories, master patient registries, and interactive analytics dashboards—empowering clinical administrators to monitor hospital capacity, optimize query performance through indexed data aggregation, and deliver seamless healthcare coordination across multi-specialty medical networks.

---

## 3. Setup Guide

This guide provides step-by-step instructions to clone, configure, seed, and run DocTrack locally across both the standalone backend server and the Next.js client application.

### 3.1 Prerequisites

Before installing, ensure your environment meets the following specifications:
- **Node.js**: `v18.0.0` or `v20.0.0+` (LTS recommended)
- **Package Manager**: `npm` (v9.0+) or `yarn` / `pnpm`
- **Database**: Local MongoDB instance (`mongodb://127.0.0.1:27017/doctrack`) or a cloud-hosted [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.
- **Operating System**: Windows, macOS, or Linux.

---

### 3.2 Environment Configuration Files (`.env.example`)

DocTrack includes a root `.env.example` template as well as scoped `.env.example` templates in both `server/` and `client/` directories.

#### Step 1: Clone Repository
```bash
git clone https://github.com/jubayerCodes/docTrack.git
cd docTrack
```

#### Step 2: Configure Backend Environment Variables (`server/.env`)
Create a `.env` file inside the `server/` directory matching `server/.env.example`:
```bash
# In server/.env
PORT=5000
NODE_ENV=development

# Allowed client origin for CORS credentials transmission
CLIENT_URL=http://localhost:3000

# MongoDB Database Connection
MONGODB_URI=mongodb://127.0.0.1:27017/doctrack
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/doctrack?retryWrites=true&w=majority

# Supabase Authentication Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
SUPABASE_SECRET_KEY=sb_secret_your_key_here

# Safe Local Mock Admin Authentication (Set true to test without external Supabase credentials)
DEV_MODE=true
```

#### Step 3: Configure Frontend Environment Variables (`client/.env.local`)
Create a `.env.local` file inside the `client/` directory matching `client/.env.example`:
```bash
# In client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Supabase Auth Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

### 3.3 Backend Setup & Database Seeding (`server/`)

Open your terminal and navigate to the backend directory:

```bash
cd server

# 1. Install dependencies
npm install

# 2. Build TypeScript artifacts
npm run build

# 3. Seed database with realistic clinical sample data (Doctors, Patients, Encounters)
npm run seed

# 4. Start the Express development server
npm run dev
# Or start the production build:
# npm start
```

*Verification*: Open your browser or curl `http://localhost:5000/api/health`. You will receive:
```json
{
  "status": "healthy",
  "database": {
    "status": "connected",
    "connected": true,
    "name": "doctrack"
  },
  "timestamp": "2026-11-13T21:00:00.000Z"
}
```

---

### 3.4 Frontend Setup & UI Launch (`client/`)

Open a separate terminal window and navigate to the frontend directory:

```bash
cd client

# 1. Install dependencies
npm install

# 2. Run the Next.js development server
npm run dev
# Or build and launch production:
# npm run build
# npm start
```

*Access Portal*: Open [http://localhost:3000](http://localhost:3000) in your web browser.

---


## 4. System Architecture

DocTrack follows a decoupled client-server architecture with strict separation between presentation, state orchestration, business logic, and indexed persistence.

### 4.1 Architectural Diagram

```mermaid
flowchart TD
    subgraph BrowserClient ["Frontend Client Layer (Next.js 14 App Router)"]
        direction TB
        UI["React Server & Client Components\n(AppShell, Modals, Pickers, Recharts, ActionMenu)"]
        ZST["Zustand UI Store\n(Modals, Filters, Drawer Toggles)"]
        TKQ["TanStack Query Cache Layer\n(useDoctors, usePatients, useSessions, useUsers, useAnalytics)"]
        API_CLIENT["REST API Client (Fetch)\n(credentials: include, Bearer Authorization)"]
        
        UI <--> ZST
        UI <--> TKQ
        TKQ --> API_CLIENT
    end

    subgraph Security ["Authentication & Security Layer"]
        AUTH_MW["Next.js Edge Route Guard Middleware\n(/login, /register, /dashboard, /users)"]
        COOKIE["Session Cookie / Bearer Token"]
        SB["Supabase Auth & Admin SDK\n(User Management, JWT Verification, Role RBAC)"]
    end

    subgraph ExpressServer ["Backend REST API Server (Node.js & Express)"]
        direction TB
        EX_APP["Express Routing Core (/api/v1)"]
        SEC_MW["Security & RBAC Middleware\n(authenticate, authorizeRole('admin'), CORS, CookieParser)"]
        CTRL["REST Controllers\n(auth, user, doctor, patient, session, analytics)"]
        SERV["Domain Service Layer\n(doctorService, patientService, sessionService, analyticsService)"]
        SAN["Input Validation & Sanitization\n(escapeRegex, DTO Projections)"]

        EX_APP --> SEC_MW --> CTRL --> SAN --> SERV
    end

    subgraph Persistence ["Persistence Layer (MongoDB Atlas)"]
        M_DOC["Doctor Collection\n(Compound Index: name, spec, hosp)"]
        M_PAT["Patient Collection\n(Unique Index: email, phone)"]
        M_SES["PatientSession Collection (Join Entity)\n(Compound Index: doctorId, sessionDate, status)"]
        
        SERV --> M_DOC
        SERV --> M_PAT
        SERV --> M_SES
    end

    BrowserClient -- "HTTPS REST API (JSON)" --> EX_APP
    BrowserClient -. "Edge Route Inspection" .-> AUTH_MW
    AUTH_MW -. "Token Introspection & RBAC" .-> SB
    SEC_MW -. "Validate Token & Role" .-> SB
```

---

### 4.2 Data Flow & Service Interactions

1. **Authentication, Registration & RBAC Authorization Flow**:
   - **Self-Service Registration**: New clinical staff register via `/register` with full name, email, and password. The backend `POST /api/v1/auth/register` provisions the account via the privileged Supabase Admin SDK with `email_confirm: true` and defaults the role to `'user'`. The client automatically completes session sign-in and routes to `/dashboard`.
   - **Role-Based Navigation & Page Visibility**:
     - **System Administrators (`admin`)**: Granted full access to **Overview** (`/dashboard`), **Doctors** (`/doctors`), **Patients** (`/patients`), **Sessions** (`/sessions`), and **User Management** (`/users`).
     - **Standard Users (`user`)**: Navigation sidebar and quick actions restrict visibility strictly to the **Executive Analytics Dashboard** (`/dashboard`). Direct attempts to access `/doctors`, `/patients`, `/sessions`, or `/users` are intercepted by Next.js Edge Middleware and client guards, immediately redirecting back to `/dashboard`.
   - **API-Level Role Authorization**: Sensitive routes (`/doctors`, `/patients`, `/sessions`, `/users`) enforce `authenticate` and `authorizeRole('admin')`. Non-admin requests receive a `403 Forbidden` response.
   - **User Management & Privilege Elevation**: Administrators can view all registered staff on `/users`, promote standard users to `'admin'`, or demote administrators to `'user'` (`PATCH /api/v1/users/:id/role`). Accounts can be permanently deleted (`DELETE /api/v1/users/:id`). Built-in safeguards strictly prevent administrators from demoting or deleting their own active session account.
   - **Token Invalidation**: Server-side in-memory token cache (`tokenCache`) provides immediate cache invalidation (`invalidateTokenCache`) upon role changes or account removals.

2. **Read & Directory Query Flow (Debounced & Indexed)**:
   - When a user searches or filters doctors or patients, `useDebounce` holds requests for 300ms to eliminate redundant network traffic.
   - TanStack Query dispatches requests to `/api/v1/doctors?page=1&limit=10&search=cardio&sortBy=caseload`.
   - The Express service utilizes MongoDB `$text` and compound indexes (`{ name: 1, specialization: 1 }`), preventing full-collection scans.
   - The backend runs a single-roundtrip aggregation pipeline with `$facet` to compute total matching record counts, paginated documents, and active caseload ratios simultaneously.

3. **Encounter Scheduling & Association Flow (Workflow 4.1)**:
   - **Linking Existing Patient**: The administrator selects an existing patient from a searchable dropdown, selects a date via the custom month `DatePicker`, selects a 30-minute slot via `TimePicker`, and submits. A new `PatientSession` document is created with `{ doctorId, patientId, sessionDate, status: 'scheduled' }`.
   - **Inline Registration**: In a single atomic operation, the backend creates a new `Patient` document in the master collection and immediately links the patient to the attending doctor in `PatientSession`.
   - Neither flow embeds records inside parent collections, ensuring strict referential integrity.

4. **Real-time Synchronization & Cache Invalidation Flow**:
   - Successful encounter creations, edits, or disassociations trigger TanStack Query cache invalidations:
     ```typescript
     queryClient.invalidateQueries({ queryKey: ['doctors'] });
     queryClient.invalidateQueries({ queryKey: ['patients'] });
     queryClient.invalidateQueries({ queryKey: ['analytics'] });
     ```
   - Doctor caseload badges (`N Patients →`), patient appointment status pills, and dashboard analytics update instantly across the entire interface without full-page reloads.

5. **Operational Intelligence & Analytics Pipeline**:
   - `/dashboard` queries `/api/v1/analytics`, which runs high-performance aggregation pipelines:
     - Total doctor and active patient counts using indexed `$count`.
     - Caseload distribution grouped by doctor using `$lookup` and `$group`.
     - Department/specialty distribution donut chart.
     - 14-day temporal activity trend computing daily completed vs. scheduled consultations.

---

## 5. Technical Decisions

### Decision 1: TanStack Query + Zustand over Redux / Context API for State Management & Server Synchronization

- **Context**:  
  Healthcare administrative applications handle two fundamentally distinct categories of application state:
  1. **Server State**: Asynchronous, remotely owned data (practitioner directories, patient rosters, clinical encounters, analytics aggregates) requiring caching, background deduplication, optimistic updates, and automatic invalidation.
  2. **Client State**: Ephemeral UI flags (modal open/close states, active drawer selections, temporary filter criteria) that are synchronous and strictly local to the client browser.

- **Why Not Context API?**  
  - **Unnecessary Component Tree Re-renders**: Any state modification in a React Context causes all consumer components to re-render, leading to noticeable performance degradation on dense data tables with 50+ rows and real-time inputs.
  - **Lack of Built-in Server Synchronization**: Context API provides zero native primitives for caching, request deduplication, stale-while-revalidate cycles, automatic retries, or window-refocus revalidation. Implementing these manually creates fragile, redundant boilerplate.

- **Why Not Redux (Redux Toolkit)?**  
  - **Over-Architected for REST Caching**: Redux treats remote server data as local synchronous state. Storing REST entity data inside a Redux store requires extensive boilerplate (actions, reducers, thunks, normalized entities) and forces developers to manually track loading flags, pagination cursors, and cache expiration timestamps.
  - **Memory & Complexity Overhead**: For an administrative dashboard requiring fast iterations and human-readable code (in accordance with repository DRY standards), Redux adds significant boilerplate without addressing data freshness guarantees.

- **The Solution: Decoupled TanStack Query (React Query) + Zustand**:  
  - **TanStack Query** acts as a dedicated remote server cache. Queries (`['doctors', filters]`, `['patients', filters]`) are cached, deduplicated across components, and automatically refreshed in the background. Optimistic mutations instantly reflect session additions or disassociations.
  - **Zustand** manages client UI state through an atomic store (`useUIStore`) with less than 1KB footprint, zero boilerplate, and selector-based subscriptions that ensure only the modified modal or dropdown re-renders.

---

### Decision 2: 3-Entity Relational Encounter Model (`Doctor` ↔ `PatientSession` ↔ `Patient`) vs. Embedded Subdocuments in MongoDB

- **Context**:  
  In a multi-specialty healthcare facility, relationships between doctors and patients are non-static and multi-dimensional. A single patient visits a Cardiologist today, an Endocrinologist next month, and may have past completed appointments alongside future scheduled checkups. Simultaneously, doctors manage dozens of rotating patients across varying medical conditions.

- **Why Not Embedded Subdocuments?**  
  - **The 16MB BSON Document Limit**: Embedding an array of patient records or session logs directly within a `Doctor` document creates an unbounded array. In a high-volume hospital department, active practitioner documents will grow indefinitely, risking write failures when exceeding MongoDB’s 16MB BSON ceiling.
  - **Severe Data Duplication & Sync Anomalies**: If patient demographic information (phone, email, age) is embedded inside doctor documents, updating a patient's contact number requires an expensive multi-document update across every doctor they have ever consulted. Failure during any update creates data inconsistency.
  - **Write Lock Contention**: Two administrators scheduling appointments for different doctors with the same patient at the same time would encounter write contention and version conflicts if patient records were embedded.
  - **Inability to Run Independent Temporal Analytics**: Generating a 14-day chronological chart of encounters across the entire clinic would require unwinding embedded subdocuments across all doctors, causing severe performance degradation.

- **The Solution: Independent `PatientSession` Join Entity**:  
  - **Model Structure**: The schema is normalized into three clean collections: `Doctor`, `Patient`, and `PatientSession` (join entity holding `doctorId`, `patientId`, `sessionDate`, `appointmentAt`, `condition`, and `status`).
  - **Compound Index Optimization**: Independent indexes on `PatientSession`:
    - `{ doctorId: 1, sessionDate: -1 }`: Provides instant caseload retrieval for practitioner tables.
    - `{ patientId: 1, status: 1 }`: Enables fast patient medical history lookups.
    - `{ sessionDate: -1, status: 1 }`: Feeds the 14-day analytics aggregation pipeline in milliseconds.
  - **Atomic Operations & Safe Disassociation**: Deleting or cancelling an encounter only updates or removes the `PatientSession` record, leaving master patient demographics and doctor professional profiles intact.

---

### Decision 3: Tiered Role-Based Access Control (RBAC) with Edge Middleware & API Guard Dual-Layer Enforcement

- **Context**:  
  Healthcare administration systems require strict principle-of-least-privilege access controls. While clinical supervisors and medical directors need full authority to manage doctor rosters, patient records, sessions, and staff accounts, standard medical staff members should only view aggregate executive capacity metrics without exposure to sensitive patient data or directory manipulation.

- **Why Dual-Layer (Edge Middleware + API Guard) Enforcement?**  
  - **Client-Side Hiding Alone is Insecure**: Merely hiding navigation links in the UI leaves applications vulnerable to direct URL manipulation (e.g., typing `/doctors` into the browser) or direct HTTP client access (e.g., curl/Postman).
  - **Next.js Edge Middleware Protection**: Sits before any page rendering occurs. When an unauthenticated user or a standard user requests an admin route (`/doctors`, `/patients`, `/sessions`, `/users`), Edge Middleware evaluates the Supabase session token and redirects unauthorized requests to `/dashboard` before React components hydrate.
  - **API-Level Express RBAC (`authorizeRole('admin')`)**: Even if a request bypasses the frontend, the backend Express REST API validates the JWT payload against `user.app_metadata.role` or `user.user_metadata.role`, rejecting unauthorized attempts with a standardized `403 Forbidden` response.

- **Self-Lockout Safeguards**:  
  - To prevent accidental administrative lockout, the backend `PATCH /api/v1/users/:id/role` and `DELETE /api/v1/users/:id` endpoints enforce strict identity checks (`req.user.id !== req.params.id`), rejecting self-demotion or self-deletion attempts with `400 Bad Request`.
  - The frontend ActionMenu automatically disables demote/remove actions on the administrator's own row with clear visual indicators (`(You)` badge).

---

## 6. Visual Evidence

Below is a visual overview of DocTrack’s responsive user interface across Desktop, Tablet, and Mobile viewports:

| Interface View | Viewport | Key Capabilities & Features Demonstrated |
| :--- | :--- | :--- |
| **Executive Analytics Dashboard** | Desktop (1440px) | 4 real-time KPI metric cards, Recharts practitioner caseload bar chart, specialty breakdown donut chart, and 14-day encounter area trend. Accessible to both Admins and Standard Users. |
| **User Registration Portal** | Desktop & Mobile | Public `/register` view allowing clinical staff to register with Name, Email, and Password, featuring client-side matching validation and Edge-compliant eye toggles. |
| **User Management & Identity Administration** | Desktop (1440px) | Admin-only `/users` dashboard with role distribution metrics, debounced search, role filter pills, and a 3-dot `ActionMenu` dropdown for promotion, demotion, and deletion. |
| **Doctor Directory & Caseloads** | Desktop (1440px) | Paginated doctor roster, 300ms debounced search, specialty filters, initials avatar badges, active patient badges (`N Patients →`), and action menus (Admin only). |
| **Caseload Inspection Modal** | Desktop Modal | Slide-over inspection modal displaying all active patient encounters under a selected doctor with individual disassociate controls (Admin only). |
| **Workflow 4.1 Encounter Scheduler** | Desktop Modal | Dual-tab modal: Tab 1 links existing patients with custom `DatePicker` & 30-min slot `TimePicker`; Tab 2 registers new patients inline atomically (Admin only). |
| **Master Patient Directory** | Desktop (1440px) | Complete patient registry with medical condition tags, attending physician badges, appointment timestamps, and edit/delete triggers (Admin only). |
| **Responsive Tablet Layout** | Tablet (1024px) | Responsive multi-column grid adapting KPI cards and Recharts analytics with collapsible navigation. |
| **Responsive Mobile Layout** | Mobile (390px) | Compact mobile layout featuring an off-canvas slide-out sidebar, full-width touch targets, stacked metric cards, and horizontal scroll tables. |

> *Interactive UI Prototype Demo*: In addition to the Next.js application, an interactive standalone preview of all interface layouts and color tokens is available at [ui_prototype_demo.html](file:///d:/Work%20Related/Projects/DocTrack/ui_prototype_demo.html).

---

## 7. Performance, Indexing & Security Strategy

### 7.1 Database Indexing Table

| Collection | Indexed Fields | Index Type | Purpose / Query Optimization |
| :--- | :--- | :--- | :--- |
| `doctors` | `name`, `specialization`, `hospital` | Compound Text | Ultra-fast regex-free search across practitioner directories. |
| `doctors` | `createdAt` | B-tree Descending | Efficient date-wise ordering and pagination. |
| `patients` | `email`, `phone` | Unique Sparse | Prevents duplicate patient registrations; fast single-record lookup. |
| `patients` | `name` | Text | Debounced patient name search in directories and dropdowns. |
| `patient_sessions` | `doctorId`, `sessionDate` | Compound B-tree | Instant caseload calculation and doctor consultation schedule sorting. |
| `patient_sessions` | `patientId`, `status` | Compound B-tree | Fast lookup of patient consultation history and active appointments. |
| `patient_sessions` | `sessionDate`, `status` | Compound B-tree | High-throughput 14-day temporal analytics aggregation pipeline. |

### 7.2 Security Threat Mitigations

- **Dual-Layer RBAC & Authorization**: All sensitive resource endpoints (`/doctors`, `/patients`, `/sessions`, `/users`) strictly require `authenticate` and `authorizeRole('admin')`. Standard users receive `403 Forbidden`.
- **Self-Lockout Safeguards**: Built-in backend safeguards (`req.user.id !== targetId`) prevent administrators from accidentally demoting or deleting their own accounts.
- **Browser-Native Pseudo-Element Suppression**: Global styles suppress `::-ms-reveal` and `::-ms-clear` to prevent Microsoft Edge / Chromium duplicate password reveal icons from conflicting with custom accessible controls.
- **Injection Prevention**: All user search queries pass through `escapeRegex()` before reaching MongoDB queries, neutralizing NoSQL injection and ReDoS vulnerabilities.
- **XSS Sanitization**: React’s virtual DOM ensures all patient names, emails, and diagnosis notes are treated as encoded text nodes rather than executable markup.
- **Strict DTO Projections**: Mongoose transformation rules strip `__v` and internal schema metadata before JSON serialization.
- **Referential Integrity Protection**: Cascading deletion handlers in `patientService` ensure deleting a patient cleans up associated sessions, preventing orphaned records.

---

## 8. Technology Stack Summary

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, TanStack React Query v5, Zustand v5, Recharts, Lucide React.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose ODM v8, Cookie-Parser, CORS.
- **Database**: MongoDB Atlas / MongoDB 7.0+ (Full Compound & Text Indexing).
- **Authentication & RBAC**: Supabase Auth (JWT cookie and Bearer token transport) with Supabase Admin SDK for user provisioning, role promotion, and RBAC enforcement.
- **Architecture**: Decoupled Monorepo with independent Client and Server workspaces.
- **Testing**: Node Test Runner, TypeScript compilation checks, automated Auth/RBAC test suite (15 test assertions), and Playwright verification workflows.
