# OpsFlow API Documentation

This document explains the backend API routes used in OpsFlow in simple terms. Because OpsFlow is built with Next.js 15 Server Components, a lot of data is fetched directly from the database on the server. However, we use these API routes for actions that change data (like creating or updating things) from the client side.

## 🏢 Workspaces API

### `GET /api/workspaces`
- **What it does:** Fetches a list of all the workspaces that you are a member of.
- **Who can use it:** Any logged-in user.

### `POST /api/workspaces`
- **What it does:** Creates a brand new workspace. You provide a name and an icon, and it sets you up as the `ADMIN` of that new workspace.
- **Data you send:** `workspace_name` (Text) and `workspace_icon` (Text).

### `POST /api/workspaces/[id]/active`
- **What it does:** Tells the server which workspace you are currently looking at. It saves this preference so that when you refresh the page, you stay in the same workspace.

### `DELETE /api/workspaces/[id]`
- **What it does:** Permanently deletes a workspace and everything inside it. 
- **Who can use it:** Only users with the `ADMIN` role.

---

## ✅ Tasks API

### `GET /api/tasks`
- **What it does:** Gets a list of all the tasks inside the current workspace.

### `POST /api/tasks`
- **What it does:** Creates a new task.
- **Data you send:** `title`, `description`, `priority` (low, medium, high), and `assignee_id` (who the task belongs to).

### `PATCH /api/tasks/[id]`
- **What it does:** Updates a specific piece of a task. For example, changing the status from "Open" to "Done".
- **Who can use it:** 
  - `ADMIN` and `MANAGER` can update anything.
  - `USER` can only update the status of tasks that are specifically assigned to them.

### `DELETE /api/tasks/[id]`
- **What it does:** Permanently deletes a task.
- **Who can use it:** Only `ADMIN` and `MANAGER`.

---

## 👥 Team & Invitations API

### `POST /api/invites`
- **What it does:** Generates a secure invitation link that you can send to someone so they can join your workspace. You can choose whether they join as an Admin, Manager, or regular User.
- **Who can use it:** Only `ADMIN`.

### `POST /api/invites/[id]/accept`
- **What it does:** When someone clicks an invitation link, this API processes it and officially adds them to the workspace.

### `PATCH /api/members/[id]`
- **What it does:** Changes a team member's role (for example, promoting a `USER` to a `MANAGER`).
- **Who can use it:** Only `ADMIN`.
