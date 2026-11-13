# DocTrack Coding & Architecture Rules

## Core Rule: DRY (Don't Repeat Yourself), Clean, & Human-Readable Code

Every line of code written in this repository must strictly adhere to the following principles:

### 1. Mandatory DRY (Don't Repeat Yourself)
- **Reusable UI Components**: Never duplicate UI patterns. Extract repeated elements into composable, modular components (e.g., Modals, Popovers, Dropdowns, Date/Time Selectors, Status Badges, Form Inputs, Metric Cards, Pagination Bars).
- **Reusable Hooks & Utilities**: Consolidate repeated logic into custom hooks (e.g., `useDebounce`, `useDoctorFilters`, `useModal`), utility functions (e.g., date/time formatters, validation, query builders), and centralized API client methods.
- **Shared Contracts**: Reuse TypeScript interfaces, DTOs, enum values, route constants, and query keys across frontend and backend without duplicating type definitions.

### 2. Clean & Human-Readable Code
- **Self-Documenting & Legible**: Code is written for human engineers to read, review, and maintain effortlessly.
- **Clear, Meaningful Naming**: Use explicit, intention-revealing names for variables, functions, components, and files. Avoid obscure abbreviations.
- **Single Responsibility (SRP)**: Keep functions and components focused on a single task. Keep file sizes comfortable and well-organized.

### 3. Simplicity Over Cleverness (KISS Principle)
- **Keep It Simple & Direct**: Always favor the simplest solution that completely solves the requirement. Avoid premature optimization, speculative abstractions, and overly nested architectures.
- **Predictable Data Flow**: Maintain clear, straightforward state management and data flows. Avoid hidden side effects.

---

## 4. Mandatory Knowledge Graph Protocol (graphify)

This project has an active graphify knowledge graph located at `graphify-out/`.

### Rules for Every Model Call:
- **Mandatory First Step for Codebase Queries**: Before reading raw files, running grep/find, answering questions about architecture, symbols, data flow, dependencies, or file relationships, the model **MUST** query the graph first:
  - **MCP Tools**: Use `query_graph`, `get_node`, `get_neighbors`, `shortest_path`, or `god_nodes` (passing `project_path: "d:/Work Related/Projects/DocTrack"` or current workspace path).
  - **CLI Alternative**: Run `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"`.
- **Targeted Code Navigation**: Use the graph query output to pinpoint exact file paths, line ranges, and connected symbols before inspecting files. Do not perform wide, unguided file globbing or bulk raw reads.
- **Architecture & Overview**: Refer to `graphify-out/GRAPH_REPORT.md` for high-level module architecture, god nodes, and community boundaries.
- **Continuous Graph Maintenance**: After creating, modifying, or refactoring code files, run `graphify update .` to keep `graphify-out/graph.json` synchronized (local AST extraction, 0 API cost).
- **Git Commit Sync**: Git `post-commit` and `post-checkout` hooks are installed to automatically update the knowledge graph on git commits.

---

## 5. Playwright MCP Tool Restriction

- **Explicit User Command Required**: Do NOT use the Playwright MCP server or any of its tools (`browser_*`) without a direct, explicit instruction from the user.
- **Testing Only**: When explicitly commanded, the Playwright MCP is reserved strictly for testing and verification workflows.
- **No Autonomous Invocations**: Never proactively launch, navigate, or test via Playwright tools unless specifically instructed by the user.


