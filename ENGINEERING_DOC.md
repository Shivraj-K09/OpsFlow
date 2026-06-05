# OpsFlow: Engineering Decision Document

## 1. System Architecture

**Overall Structure:**
OpsFlow is built using a modern React framework (Next.js 16.2 App Router) paired with Supabase (PostgreSQL + GoTrue Auth) for the backend.

- **Frontend Layer:** Built with React Server Components (RSC) to minimize client-side javascript, optimize SEO, and securely fetch data directly from the server. Client Components are used strictly for interactivity (e.g., Modals, Search Inputs, Forms).
- **Backend Layer:** Supabase handles Authentication, Database, and Row Level Security (RLS). The application utilizes standard **REST APIs** built via Next.js Route Handlers (`app/api/`), interacting seamlessly with a React Query client layer for state management and caching.
- **Styling:** Tailwind CSS combined with Shadcn UI for accessible, highly-customizable component primitives.

## 2. Database Design

The system uses a highly normalized PostgreSQL schema designed for multi-tenancy.

- **`profiles`**: Extends the `auth.users` system table. Stores public user information (Full Name, Avatar).
- **`workspaces`**: The core multi-tenant entity. A workspace acts as a sandbox for teams.
- **`workspace_members`**: A junction table linking `profiles` to `workspaces`. Crucially, it stores the **Role** (ADMIN, MANAGER, USER) to enforce RBAC.
- **`tasks`**: The core operational entity. Linked to a workspace and a user (assignee).
- **`activity_logs`**: An immutable audit trail table. Populated automatically via **PostgreSQL Triggers** whenever a task is created, updated, or a user joins a workspace.

## 3. Key Decisions

1. **Multi-Tenancy over Single-Tenancy:**
   - _Decision:_ Built a workspace-driven system where users can create and switch between different isolated organizations.
   - _Why:_ Operations systems rarely exist in a vacuum. Organizations need different environments for different teams. This architecture allows the app to scale natively for B2B SaaS use-cases.
2. **Standard REST APIs with React Query:**
   - _Decision:_ Built traditional `/api/...` REST routes consumed by React Query instead of tightly coupled Next.js Server Actions.
   - _Why:_ This explicitly fulfills the assignment requirement for clean, structured REST APIs. It provides better separation of concerns, enables SPA-like instant transitions (zero-loading feel), and opens the system to external API consumers.
3. **Database-Level Audit Logs (Postgres Triggers):**
   - _Decision:_ Implemented the Activity Log via Postgres triggers rather than application-code inserts.
   - _Why:_ If a developer manually modifies a task directly in the Supabase dashboard or via an external API, the application code wouldn't catch it. A database trigger guarantees 100% accurate audit trails regardless of the origin of the mutation.

## 4. Trade-offs

1. **Service Role Keys for Auth Data:**
   - _Trade-off:_ Supabase strictly isolates the `auth.users` schema for security. Because the assignment required displaying user emails, we had to use the Supabase Service Role Key to bypass RLS and query emails server-side.
   - _Why:_ The alternative was duplicating emails into the public `profiles` table, which poses privacy risks and data synchronization headaches. We chose secure, server-side data hydration.
2. **React Query Caching Strategy:**
   - _Trade-off:_ Opted for client-side state management using React Query over pure Server-Side Rendering (SSR) for data mutations.
   - _Why:_ This provides a vastly superior user experience (instant UI updates, cached lists) compared to full-page reloading (`revalidatePath`), despite adding some complexity to the client bundle.

## 5. Scaling Strategy

**If the system grows to 10,000+ users:**

- **What will break first?**
  The Activity Log table will become massive. Querying `activity_logs` without pagination or indexing will severely degrade performance. Additionally, the cross-region latency to the Supabase database could slow down Server Actions.
- **How would I improve it?**
  1. ~~Implement Keyset Pagination (Cursor-based) for tasks and activity logs.~~ **(Update: Offset-Based Pagination implemented for Activity Logs!)**
  2. Implement Redis caching (via Vercel KV) for heavily read, rarely mutated data (like workspace members and profiles).
  3. Archive old `activity_logs` (older than 90 days) into cold storage or a specialized OLAP database (like ClickHouse) designed for massive time-series event data.

## 6. Future Improvements

**"If I had 2 more days, what would I improve?"**

1. **Real-time WebSockets:** I would implement Supabase Realtime so that when one user moves a task to "Done", the UI updates instantly on all other users' screens without requiring a page refresh.
2. **Kanban Board View:** Implement `dnd-kit` to allow users to drag and drop tasks between "Todo", "In Progress", and "Done" columns dynamically.

## 7. Mandatory Creativity Requirement

**Invented Feature: Multi-Tenant Workspaces with Secure Invite Links**

- _Why I added it:_ The assignment asked for an "Internal Operations System". A flat system where every user sees every task is fundamentally unscalable for real companies. I built a system where users can generate cryptographically secure Invite Links (`/invite/[id]`) to invite specific users into isolated Workspaces.
- _What problem it solves:_ It allows a single deployment of this software to serve multiple independent departments (e.g., Engineering, HR, Marketing) without data leakage between teams. It mimics enterprise-grade architecture.

**Scope Decision:**

- _What I intentionally did NOT build:_ I chose not to provide a downloadable Postman Collection JSON. Since the API footprint is deliberately scoped and natively integrated into the Next.js App Router (`app/api`), I instead thoroughly documented the available REST endpoints directly in the README for maximum visibility and ease of use.
