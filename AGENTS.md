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
