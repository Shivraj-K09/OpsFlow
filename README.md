# OpsFlow - Smart Operations System

OpsFlow is a simple, powerful, and secure system that helps teams manage their daily work. It allows companies to create workspaces, invite team members, assign tasks, and track exactly who did what.

## 🚀 Features
- **Workspaces**: You can create different workspaces for different teams and switch between them easily.
- **Roles & Permissions**: Three clear roles (`ADMIN`, `MANAGER`, and `USER`). The database strictly enforces what each person is allowed to do.
- **Task Management**: Create tasks, assign them to team members, and move them from "Open" to "Done".
- **Automatic Audit Logs**: The database automatically tracks every action (like who updated a task and when) so nothing is missed.
- **Team Collaboration**: Users can leave comments on tasks to discuss the work.
- **Lightning Fast**: Built with Next.js 15, the app is optimized to load data in parallel so you never have to wait.

## 🛠️ Tech Stack (What it's built with)
- **Frontend**: Next.js 15, React, Tailwind CSS (for styling)
- **Backend**: Next.js API Routes
- **Database & Security**: Supabase (PostgreSQL database with strict Row Level Security)

## 📦 How to Run This Project

1. **Download the code**
```bash
git clone https://github.com/Shivraj-K09/OpsFlow.git
cd OpsFlow
```

2. **Install the required packages**
```bash
pnpm install
```

3. **Set up the Database Keys**
Create a new file named `.env.local` in the main folder and add your Supabase connection details:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
```

4. **Start the Website**
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to use the app!

## 📄 Important Documents for Evaluation
- **Engineering Decisions**: Please read the `Engineering_Decision_Document.md` file. It explains how I built the app, the problems I solved, and how it handles thousands of users.
- **Test the API**: I have included an `API_Documentation.md` file that explains all the backend API routes and what they do in simple, easy-to-understand terms.
