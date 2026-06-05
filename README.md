# OpsFlow - Smart Operations System

OpsFlow is a production-ready, full-stack internal operations system built for modern teams. It provides secure task management, strict role-based access control (RBAC), and automated activity auditing.

## 🚀 Features
- **Multi-Tenant Workspaces**: Users can create, switch, and manage isolated workspaces.
- **Role-Based Access Control**: `ADMIN`, `MANAGER`, and `USER` roles enforced at the database level via Postgres RLS.
- **Task Management**: Create, assign, and track tasks with status workflows.
- **Automated Audit Logs**: Database-level Postgres triggers automatically track who did what.
- **Team Collaboration**: Task commenting and secure token-based workspace invitations.
- **Performance Optimized**: Eliminates waterfalls using Next.js 15 Server Components, `React.cache()`, and parallel data fetching.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Triggers)
- **State Management**: TanStack React Query

## 📦 Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Shivraj-K09/OpsFlow.git
cd OpsFlow
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure Environment Variables**
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
```

4. **Run Database Migrations**
Run the SQL scripts located in your Supabase SQL editor to create the necessary tables, enums, triggers, and RLS policies.

5. **Start the Development Server**
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 Documentation
- **Engineering Decisions**: Read `Engineering_Decision_Document.md` for architecture details, trade-offs, and scaling strategies.
- **API Reference**: Import `OpsFlow_API_Collection.json` into Postman to test backend routes.
