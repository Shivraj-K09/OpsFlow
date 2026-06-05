# Engineering Decision Document: OpsFlow

## 1. System Architecture
### Overall Structure
I built OpsFlow using Next.js 15. The project is split into clear, easy-to-manage parts:
- **Frontend (What the user sees):** I used React and TailwindCSS to build a fast, modern interface. 
- **Backend API (The messenger):** The `app/api/` folder contains simple routes that handle creating tasks, inviting users, and updating data.
- **Database Helper (The engine):** I put all the complex database code inside `lib/services/db.ts` so that the rest of the app stays clean and easy to read.
- **Database (The vault):** I used Supabase (PostgreSQL) to store data securely. 

### How things talk to each other
When a user clicks something, the app instantly updates the screen so it feels incredibly fast. In the background, it talks to the API, which securely updates the database. When you open a new page, the server fetches all the required data at once so you don't have to wait for loading spinners.

## 2. Database Design
I designed the database to keep everything organized and secure:
- `workspaces`: The main groups. Everything belongs to a workspace.
- `workspace_members`: Connects a user to a workspace and gives them a role (`admin`, `manager`, or `member`).
- `tasks`: The actual jobs to be done. They have statuses like "open" or "done".
- `activity_logs`: A simple list that automatically tracks who did what.
- `comments`: Lets users talk about specific tasks.
- `workspace_invites`: Handles secure links so new people can join a workspace.

## 3. Key Decisions
1. **Using Supabase for Security:** I chose Supabase because it lets me lock down the data right inside the database using "Row Level Security". This means even if I make a mistake in my website's code, users still can't hack in or see data they aren't supposed to see.
2. **My Invented Feature - Automatic Activity Logs:** For the "Creative Freedom" requirement, I built an Activity Log that works on autopilot. Instead of writing code in my app to say "log this action," I set up Database Triggers. Every time a task is created or updated, the database automatically writes it down in the log. This ensures we never miss an action.
3. **Making the App Fast:** I noticed that fetching data step-by-step was making the website slow. So, I changed the code to use `Promise.all`. This tells the server to fetch the workspaces, the user data, and the tasks all at the exact same time, which made the app lightning fast.

## 4. Trade-offs (What I compromised on)
- **Fetching a little extra data:** Sometimes my API routes ask the database for an entire row of data even if the screen only needs the task's title. I did this because it made writing the code much faster and easier to maintain, and the tiny amount of extra data doesn't slow down the app at all.
- **No Live/Real-time Updates:** I decided not to add real-time WebSockets (where the screen updates instantly if another user changes a task). While real-time is cool, it makes the code extremely complicated. Instead, the app refreshes the data cleanly in the background. This keeps the system stable and simple.

## 5. Scaling Strategy
**If the system grows to 10,000+ users, what will break first?**
The first thing that will slow down is the Dashboard. Right now, to show the total number of active tasks or members, the database has to literally count every single row in the table. If there are millions of tasks, this counting process will take too long.

**How would I fix it?**
1. I would stop counting rows every time. Instead, I would store the "total count" as a simple number, and just update that number by +1 or -1 whenever a task is created or deleted.
2. I would add pagination so the app only loads 20 tasks or logs at a time, rather than trying to load all of them at once.

## 6. Future Improvements
*If I had 2 more days to work on this, I would add:*
1. **Custom Roles:** Right now, the roles are strictly `Admin`, `Manager`, or `User`. I would build a settings page where admins can create custom roles (like "Guest" or "Reviewer") and choose exactly what buttons they are allowed to click.
2. **A Visual Board (Kanban):** I would add drag-and-drop features so users can click a task and drag it from "Open" into "In Progress," just like Trello.
3. **Global Search:** I would add a big search bar at the top so users can quickly find a specific task just by typing a few letters.
