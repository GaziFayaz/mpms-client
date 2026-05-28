# MPMS — Multi-role Project Management System

A full-stack project management tool that lets teams organize projects, sprints, and tasks through an intuitive Kanban-style interface. It serves two distinct portals — an Admin/Manager dashboard for oversight and administration, and a Member workspace for day-to-day task execution — all secured by role-based access control.

---

## Live Demo & Test Credentials

> **Live URL:** _coming soon_

Use these accounts to explore different permission levels:

| Role     | Email               | Password      | What You Can Access                                        |
| -------- | ------------------- | ------------- | ---------------------------------------------------------- |
| Admin    | `admin@mpms.com`    | `password123` | Full admin/manager dashboard, all projects, team management, reports |
| Manager  | `manager@mpms.com`  | `password123` | Same as admin — full management portal access              |
| Member   | `member@mpms.com`   | `password123` | Personal workspace only: assigned tasks, projects, sprints |

---

## Technology Stack

**Frontend**

| Category             | Technology                                                                 |
| -------------------- | -------------------------------------------------------------------------- |
| Framework            | [Next.js 16](https://nextjs.org/) (App Router)                             |
| Language             | [TypeScript](https://www.typescriptlang.org/) (strict mode)                |
| UI Library           | [React 19](https://react.dev/)                                             |
| Styling              | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Server State         | [TanStack React Query](https://tanstack.com/query)                         |
| Client State         | [Zustand](https://zustand.docs.pmnd.rs/)                                   |
| Forms & Validation   | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)  |
| Drag & Drop          | [@dnd-kit](https://dndkit.com/)                                            |
| HTTP Client          | [Axios](https://axios-http.com/) with JWT interceptor                      |
| Notifications        | [Sonner](https://sonner.emilkowal.ski/)                                    |
| Icons                | [Lucide React](https://lucide.dev/)                                        |
| Date Handling        | [date-fns](https://date-fns.org/)                                          |

**Backend** (separate repository)

| Category             | Technology                                                     |
| -------------------- | -------------------------------------------------------------- |
| Runtime              | [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) |
| Language             | [TypeScript](https://www.typescriptlang.org/)                  |
| Database             | [PostgreSQL](https://www.postgresql.org/)                      |
| ORM                  | [Prisma](https://www.prisma.io/)                               |
| API Spec             | OpenAPI 3.1 (auto-generated, served at `/api/openapi.json`)    |
| Auth                 | JWT with access + refresh token flow                           |

- **Backend repository:** [github.com/GaziFayaz/mpms-api](https://github.com/GaziFayaz/mpms-api)

---

## Key Features

### Admin & Manager Portal (`/dashboard/`)

- **Dashboard Overview** — Stats cards showing total projects, active projects, task counts, average progress, and team size. Quick-action buttons for creating projects and managing team members.
- **Project Management** — Full CRUD with grid and table views. Each project displays client, status, progress bar, task breakdown, and budget. Drill into a project to see its sprints, tasks, and an overall progress tab.
- **Sprint Management** — Create, edit, and delete sprints within a project. Drag-and-drop to reorder sprints. Each sprint shows its own progress and task count.
- **Task Management** — Table view with server-side pagination and 6 filters (project, sprint, assignee, status, priority, keyword search). Create and edit tasks with assignee selection, descriptions, estimates, and due dates.
- **Kanban Board** — Four-column board (To Do → In Progress → Review → Done). Drag tasks between columns to update their status instantly — changes persist via API calls behind the scenes.
- **Task Detail** — Everything about a task in one place: description, subtask checklist with progress bar, file attachments (upload images/PDFs, preview in-browser, delete), threaded comments, activity log, time log entries, and status transition buttons.
- **Team Management** — View all members as cards with avatars, role badges, and departments. Search by name. Add new members with role assignment.
- **Reports** — High-level project overview with individual progress bars, task completion stats, and team-level metrics.

### Member Portal (`/user/`)

- **My Dashboard** — Welcome screen with assigned task counts, in-progress counts, and a list of your current tasks.
- **My Projects** — Grid of projects you're involved in, each with a status badge and progress bar.
- **Project & Sprint View** — Explore project details and sprint breakdowns with task lists.
- **My Tasks** — Table of everything assigned to you. Click through to a task work page where you can read descriptions, check off subtasks, add comments, and move the task through its status workflow.

---

## How It Works

### Two Portals, One Codebase

MPMS uses Next.js route groups to create two separate experiences from a single codebase:

- **`/dashboard/*`** — The admin/manager portal. Only users with the `admin` or `manager` role can access these routes. Managers see everything admins see.
- **`/user/*`** — The team member portal. Only users with the `member` or `manager` role can access these routes. Members see only their own tasks and the projects they belong to.

The root page (`/`) automatically redirects you to the right portal based on your role after login.

### Authentication Flow

1. You log in with email and password via the login form.
2. The backend returns a JWT access token and a refresh token pair.
3. The frontend stores these in the browser (via Zustand with localStorage persistence) and attaches the access token to every API request automatically.
4. When the access token expires, the frontend silently refreshes it using the refresh token — no need to re-login.
5. If the refresh also fails, you are redirected to the login page.

### Data Flow

- **Server state** (projects, tasks, team, reports) is managed by **TanStack React Query**. It caches API responses, re-fetches when data becomes stale, and automatically updates the UI after mutations (create, update, delete).
- **Client state** (auth user, tokens) lives in a **Zustand** store.
- **Forms** use **React Hook Form** with **Zod** schemas for validation — this means you get instant field-level error messages and type-safe form data.
- **Notifications** appear as toast popups (via Sonner) whenever an action succeeds or fails.

---

## Setup & Running

### Prerequisites

- **Node.js 18+** (or [Bun](https://bun.sh/))
- The backend server must be running (see [Backend Repository](https://github.com/GaziFayaz/mpms-api) for setup instructions)

### Environment Variables

Create a `.env.local` file in the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

This tells the frontend where to find the backend API. Change it to match your backend's address and port.

### Install & Run

```bash
# Install dependencies
npm install
# or: bun install

# Start the development server
npm run dev
# or: bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Use one of the test credentials above to log in.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages & layouts
│   │   ├── login/              # Login page
│   │   ├── dashboard/          # Admin/Manager portal routes
│   │   │   ├── projects/       # Project CRUD pages
│   │   │   ├── sprints/        # Sprint detail pages
│   │   │   ├── tasks/          # Task table, kanban, detail, edit
│   │   │   ├── team/           # Team member management
│   │   │   └── reports/        # Reports dashboard
│   │   └── user/               # Member portal routes
│   │       ├── projects/       # Project & sprint viewing
│   │       └── tasks/          # Assigned task work pages
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   │   ├── layout/             # AdminSidebar, Header (shared across portals)
│   │   ├── tasks/              # TaskForm, TaskFilters, status/priority badges
│   │   ├── projects/           # Project status badge
│   │   ├── sprints/            # SprintForm (modal dialog)
│   │   └── shared/             # LoadingSpinner, EmptyState
│   │
│   ├── hooks/                  # Custom React hooks (data fetching + mutations)
│   │   ├── use-auth.ts         # Zustand auth store (login, logout, token management)
│   │   ├── use-projects.ts     # Project CRUD hooks
│   │   ├── use-tasks.ts        # Task, subtask, comment, attachment, time log hooks
│   │   ├── use-sprints.ts      # Sprint CRUD + reorder hooks
│   │   ├── use-team.ts         # Team/user management hooks
│   │   └── use-reports.ts      # Report query hooks
│   │
│   ├── lib/
│   │   ├── api.ts              # Axios instance + JWT interceptors + token refresh
│   │   ├── constants.ts        # Enums and display labels for statuses, priorities, roles
│   │   └── utils.ts            # Class merging (cn) and date formatting utilities
│   │
│   └── types/
│       └── index.ts            # All TypeScript interfaces (User, Project, Task, etc.)
│
├── .env.example                # Environment variable template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
└── components.json             # shadcn/ui configuration
```

---

## Available Scripts

| Command        | Description                                        |
| -------------- | -------------------------------------------------- |
| `npm run dev`  | Start the development server on `http://localhost:3000` |
| `npm run build`| Create an optimized production build               |
| `npm start`    | Start the production server (run after `build`)    |
| `npm run lint` | Run ESLint to check for code quality issues        |

---

## Backend

The API powering this frontend lives in a separate repository:

- **[github.com/GaziFayaz/mpms-api](https://github.com/GaziFayaz/mpms-api)**

It's an Express.js + TypeScript + PostgreSQL backend with 9 modules (auth, users, projects, sprints, tasks, comments, attachments, time logs, reports). It exposes an auto-generated OpenAPI 3.1 spec at `/api/openapi.json` that serves as the single source of truth for all frontend API calls.

---

## License

This project is for demonstration and learning purposes.
