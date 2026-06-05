# OpsFlow - Smart Operations System

OpsFlow is a modern, highly scalable internal operations system built to handle multi-tenant task management, role-based access control, and immutable audit logging.

## Core Features
1. **Multi-Tenant Workspaces**: Users can create isolated workspaces for different teams or projects.
2. **Role-Based Access Control (RBAC)**: Enforced via PostgreSQL Row Level Security (RLS) and Next.js Server logic.
   - **Admins:** Full control over workspace, tasks, and users.
   - **Managers:** Can manage tasks and invite users.
   - **Members:** Can only view tasks and update the status of tasks specifically assigned to them.
3. **Task Management**: Create, assign, track, and update priorities/statuses of operational tasks.
4. **Immutable Activity Logs**: Powered by native PostgreSQL Triggers. Every action (task created, status changed, user joined) is permanently audited.
5. **Secure Invitations**: Generate secure invite links to safely onboard new members to specific workspaces.

## Tech Stack
- **Framework:** Next.js 16.2 (App Router, React Query, standard REST Route Handlers)
- **Database/Auth:** Supabase (PostgreSQL, GoTrue)
- **Styling:** Tailwind CSS, Shadcn UI
- **Icons:** Tabler Icons

---

## Setup Instructions

### 1. Clone the repository and install dependencies
```bash
npm install
# or
pnpm install
```

### 2. Environment Variables
Create a `.env` file in the root of the project and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key
```
*(Note: The `SUPABASE_SERVICE_ROLE` is required for fetching secure auth data, such as user emails in the Users directory).*

### 3. Database Setup (Supabase)
The system relies on specific tables, RLS policies, and triggers. You must execute the SQL schema to initialize the database.

*Please refer to the `implementation_plan.md` or contact the developer for the exact SQL schema used to generate the `workspaces`, `workspace_members`, `tasks`, and `activity_logs` tables alongside their corresponding Postgres Triggers.*

### 4. Run the Development Server
```bash
npm run dev
# or
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure Highlights
- `app/(dashboard)`: Contains all secure, authenticated routes (Tasks, Users, Activity, Settings).
- `app/(auth)`: Contains login and registration flows.
- `app/invite/[id]`: The dynamic route for handling secure workspace invitations.
- `lib/supabase`: Contains the Supabase clients (Browser, Server, and Admin implementations).
- `components/ui`: Highly reusable Shadcn UI components.

## API Documentation Note
The web application is fully powered by **Clean and structured REST APIs** (`app/api/*`) and standard HTTP verbs, providing a decoupled backend architecture that can be consumed by external clients.

**We intentionally DO NOT provide a Postman/Swagger JSON collection file**, because the API footprint is deliberately small, highly explicit, and documented right here.

### Available REST Endpoints:

#### `GET /api/workspaces`
Fetches all workspaces the currently authenticated user belongs to.
- **Auth:** Requires standard Supabase Auth cookies.

#### `GET /api/tasks?workspaceId={id}`
Fetches all tasks for a given workspace.
- **Query Params:** `workspaceId` (Required)
- **Auth:** Requires standard Supabase Auth cookies and enforces that the user is a member of the requested workspace.

#### `POST /api/tasks`
Creates a new task.
- **Body:** `{ "title": "string", "workspaceId": "string", "description": "string?", "priority": "low|medium|high|urgent?", "assigneeId": "string?" }`
- **Auth:** Validates authentication and ensures the user has access to the workspace.
