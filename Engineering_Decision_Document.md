# Engineering Decision Document: OpsFlow

## 1. System Architecture
### Overall Structure
OpsFlow is built as a modern, full-stack Next.js 15 application utilizing the App Router. The architecture strictly separates concerns into a layered model:
- **Presentation Layer:** React Server Components (RSC) and highly interactive Client Components (`use client`) using TailwindCSS and shadcn/ui.
- **Service Layer:** `lib/services/db.ts` acts as the primary data access layer, centralizing business logic, server-side data fetching, and query deduplication (`React.cache()`).
- **API Layer:** Clean RESTful endpoints located in `app/api/*` that proxy complex mutations, serving as an explicit bridge between client components and the database.
- **Database Layer:** Supabase (PostgreSQL) handling robust relational data, Row Level Security (RLS) for data isolation, and database-level triggers.

### Component Interaction
Client components use optimistic UI updates and TanStack React Query for seamless data synchronization. Server Components handle initial payload rendering to eliminate client-side waterfalls, making the application instantly interactive.

## 2. Database Design
The schema is highly relational, enforcing integrity at the database level:
- `workspaces`: The root boundary of isolation.
- `workspace_members`: Junction table mapping `users` to `workspaces` with an `app_role` ENUM (`admin`, `manager`, `member`).
- `tasks`: Core entity tied to a `workspace_id`. Contains assignment logic, priorities, and status workflows.
- `activity_logs`: An immutable ledger of actions. 
- `comments`: Enables task-specific collaboration.
- `workspace_invites`: Manages secure, token-based onboarding.

## 3. Key Decisions
1. **Supabase over Prisma/Custom Node Server:** We chose Supabase because it pushes access control down to the Postgres Row Level Security (RLS) layer. This eliminates the risk of missing authorization checks in the application code, making the system inherently secure by default.
2. **Mandatory Creativity Requirement - Automated Audit Trail:** I invented a fully automated **Activity Log System**. Rather than hardcoding logs into API routes (which is error-prone), I implemented Postgres Triggers (`log_activity`) that automatically listen for `INSERT`, `UPDATE`, and `DELETE` events on tasks and members. *Problem solved:* It ensures 100% accountability and system visibility without cluttering application code.
3. **Optimized Server-Side Fetching:** Rather than cascading client-side fetches, we utilize Next.js 15 `Promise.all` + `React.cache()` to parallelize database queries at the layout level, eliminating waterfalls and keeping TTFB (Time to First Byte) incredibly low.

## 4. Trade-offs
- **Over-fetching in specific scenarios:** To prioritize rapid development and maintain clean RSC boundaries, some API routes return full table rows rather than selecting explicit columns. We traded a negligible amount of network payload size for significantly faster development velocity.
- **No Real-time WebSockets:** I intentionally omitted Supabase Realtime subscriptions in favor of React Query cache invalidation. While WebSockets are cool, they introduce immense complexity in state management and backend connection limits. Polling/cache invalidation was chosen for system stability and simpler scaling.

## 5. Scaling Strategy
**If the system grows to 10,000+ users, what will break first?**
The first bottleneck will be the Dashboard Metrics query (`getDashboardMetrics`). Currently, it executes parallel `COUNT()` queries across the `tasks` and `workspace_members` tables. In Postgres, massive `COUNT(*)` queries are slow because it requires full table scans. 

**How would you improve it?**
1. Implement a **Materialized View** or rely on Redis for metric caching, updating it asynchronously via database triggers.
2. Introduce **Database Connection Pooling** (PgBouncer) since Vercel's Serverless Functions create massive TCP connection overhead at scale.
3. Paginate the `activity_logs` and `tasks` table responses via cursor-based pagination rather than fetching massive arrays.

## 6. Future Improvements
*If I had 2 more days, I would improve:*
1. **RBAC Extensibility:** Shift from hardcoded ENUM roles to a granular permissions table (e.g., `role_permissions`), allowing admins to create custom roles (e.g., "Guest", "Reviewer").
2. **Kanban Board:** Implement `dnd-kit` to allow visual drag-and-drop workflow management for tasks.
3. **Advanced Filtering & Search:** Integrate full-text Postgres search or an indexing engine like Algolia for global workspace searching.
