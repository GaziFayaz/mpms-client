# Minimal Project Management System — Frontend Requirements

> **Stack:** Next.js (TypeScript) + Tailwind CSS

---

## 1. Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (providers, sidebar/nav)
│   │   ├── page.tsx                      # Redirect to /dashboard or /login
│   │   ├── login/
│   │   │   └── page.tsx                  # Login page
│   │   ├── dashboard/                    # Admin dashboard (role: admin, manager)
│   │   │   ├── page.tsx                  # Overview / stats cards
│   │   │   ├── layout.tsx                # Admin shell (sidebar nav)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx              # Project list (grid/table)
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx          # Create project form
│   │   │   │   └── [projectId]/
│   │   │   │       ├── page.tsx          # Project detail → sprints & tasks
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx      # Edit project form
│   │   │   ├── sprints/
│   │   │   │   └── [sprintId]/
│   │   │   │       └── page.tsx          # Sprint detail + task list
│   │   │   ├── tasks/
│   │   │   │   ├── page.tsx              # All tasks: table view + filters
│   │   │   │   ├── kanban/
│   │   │   │   │   └── page.tsx          # Kanban board (drag-drop)
│   │   │   │   └── [taskId]/
│   │   │   │       ├── page.tsx          # Task detail page
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx      # Edit task form
│   │   │   ├── team/
│   │   │   │   ├── page.tsx              # Team list
│   │   │   │   └── create/
│   │   │   │       └── page.tsx          # Add team member form
│   │   │   └── reports/
│   │   │       ├── page.tsx              # Reports dashboard
│   │   │       └── [projectId]/
│   │   │           └── page.tsx          # Project-specific report
│   │   └── user/                         # User panel (role: member)
│   │       ├── layout.tsx                # User shell (simpler nav)
│   │       ├── page.tsx                  # My tasks + progress overview
│   │       ├── projects/
│   │       │   ├── page.tsx              # Projects list
│   │       │   └── [projectId]/
│   │       │       ├── page.tsx          # Project summary + sprints
│   │       │       └── sprints/
│   │       │           └── [sprintId]/
│   │       │               └── page.tsx  # Sprint detail + my tasks
│   │       └── tasks/
│   │           └── [taskId]/
│   │               └── page.tsx          # Task detail + work on it
│   ├── components/
│   │   ├── ui/                           # Atomic UI components (shadcn-style)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── file-upload.tsx
│   │   ├── layout/
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── user-sidebar.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   └── header.tsx
│   │   ├── projects/
│   │   │   ├── project-card.tsx
│   │   │   ├── project-form.tsx
│   │   │   ├── project-list.tsx
│   │   │   ├── project-filters.tsx
│   │   │   └── project-progress.tsx
│   │   ├── sprints/
│   │   │   ├── sprint-card.tsx
│   │   │   ├── sprint-form.tsx
│   │   │   └── sprint-list.tsx
│   │   ├── tasks/
│   │   │   ├── task-table.tsx
│   │   │   ├── task-form.tsx
│   │   │   ├── task-detail.tsx
│   │   │   ├── task-filters.tsx
│   │   │   ├── task-kanban-board.tsx
│   │   │   ├── task-kanban-column.tsx
│   │   │   ├── task-kanban-card.tsx
│   │   │   ├── task-status-badge.tsx
│   │   │   ├── task-priority-badge.tsx
│   │   │   ├── subtask-list.tsx
│   │   │   └── task-status-select.tsx
│   │   ├── comments/
│   │   │   ├── comment-thread.tsx
│   │   │   ├── comment-item.tsx
│   │   │   └── comment-form.tsx
│   │   ├── attachments/
│   │   │   ├── attachment-list.tsx
│   │   │   ├── attachment-upload.tsx
│   │   │   └── attachment-preview.tsx
│   │   ├── team/
│   │   │   ├── member-list.tsx
│   │   │   ├── member-form.tsx
│   │   │   └── member-card.tsx
│   │   ├── reports/
│   │   │   ├── progress-chart.tsx
│   │   │   ├── project-report.tsx
│   │   │   ├── user-report.tsx
│   │   │   └── stats-card.tsx
│   │   └── shared/
│   │       ├── loading-spinner.tsx
│   │       ├── empty-state.tsx
│   │       ├── error-message.tsx
│   │       ├── confirm-dialog.tsx
│   │       ├── page-header.tsx
│   │       └── pagination.tsx
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-projects.ts
│   │   ├── use-sprints.ts
│   │   ├── use-tasks.ts
│   │   ├── use-comments.ts
│   │   ├── use-attachments.ts
│   │   ├── use-team.ts
│   │   ├── use-reports.ts
│   │   ├── use-timelogs.ts
│   │   └── use-media-query.ts
│   ├── lib/
│   │   ├── api.ts               # Axios/fetch wrapper with JWT interceptor
│   │   ├── auth.ts              # Token storage, isAuthenticated, getRole
│   │   ├── constants.ts         # Status, priority, role enums/labels
│   │   ├── utils.ts             # Date formatting, truncation, etc.
│   │   └── validators.ts        # Client-side validation (zod or custom)
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces matching API responses
│   └── styles/
│       └── globals.css          # Tailwind + custom tokens
├── public/
│   └── assets/                  # Static images, icons
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.example
```

---

## 2. Page-Level Requirements

### 2.1 Authentication
- **`/login`** — Email + Password form. On success, store JWT (localStorage), redirect based on role:
  - `admin`/`manager` → `/dashboard`
  - `member` → `/user`
- **Auth Guard** — Middleware or layout-level check:
  - Unauthenticated → redirect to `/login`
  - Role mismatch: member accessing `/dashboard/*` → redirect to `/user`

### 2.2 Admin Dashboard (`/dashboard/*`)

All routes require `role = admin OR manager`.

#### `/dashboard` (Overview)
- Stats cards: total projects, active sprints, tasks by status, team size
- Quick links to create project, manage team

#### `/dashboard/projects` (Project List)
- **View modes:** Grid (cards) and Table (rows), toggleable
- **Filters:** status dropdown, client text search
- **Each project card shows:** title, client, status badge, progress bar (% done), tasks completed/total, budget
- **Sort:** by date, status, title
- **Cards click through →** `/dashboard/projects/[projectId]`
- **"Create Project" button** → `/dashboard/projects/create`
- **Empty state:** illustration + "No projects yet" + create CTA
- **Loading:** skeleton cards
- **Error:** inline error with retry button

#### `/dashboard/projects/create` & `/dashboard/projects/[projectId]/edit`
- Form fields: Title, Client, Description (textarea), Start Date (date picker), End Date (date picker), Budget (number input), Status (select), Thumbnail (file upload with preview)
- Validation: all required fields, end date > start date, budget > 0
- On success: redirect to project detail
- On error: show field-level + toast error

#### `/dashboard/projects/[projectId]` (Project Detail = Sprints & Tasks page)
- **Header:** project title, status, edit/delete actions, breadcrumb
- **Tabs/sub-sections:**
  1. **Project Info** — description, dates, client, budget, thumbnail
  2. **Sprints** — ordered list of sprint cards
  3. **Tasks** — all tasks in this project, filterable
  4. **Progress** — progress bar + stats
- **Sprint list:**
  - Ordered cards showing sprint number, title, dates, task count
  - "Create Sprint" button opens inline form or modal
  - Drag-to-reorder sprints (optional)
  - Click sprint → expand inline task list, or link to `/dashboard/sprints/[sprintId]`

#### `/dashboard/sprints/[sprintId]`
- Sprint detail with tasks listed beneath
- Add task inline (quick create)
- Tasks grouped by status columns (mini-kanban or grouped list)

#### `/dashboard/tasks` (All Tasks Table)
- **Table columns:** Title, Project, Sprint, Assignee(s), Priority, Status, Due Date, Estimate
- **Filters row:** project select, sprint select, assignee select, status select, priority select
- **Search:** text search on title
- **Pagination:** server-side
- **"View Kanban" toggle** → `/dashboard/tasks/kanban`

#### `/dashboard/tasks/kanban` (Kanban Board)
- Four columns: To Do, In Progress, Review, Done
- Each column shows task cards (title, assignee avatars, priority badge, due date)
- **Drag and drop** between columns → PATCH status + order
- Optimistic UI update with rollback on error
- Horizontal scroll on mobile/tablet

#### `/dashboard/tasks/[taskId]` (Task Detail)
- **Left panel:** title, description, status, priority, estimate, due date, assignee chips, subtasks (checklist), attachments
- **Right panel:** threaded comments + activity log
- **Actions:** edit (opens inline or separate page), delete, change status button
- **Status change button** adapts to current status → shows next valid transition
- **Subtasks:** inline add, checkbox toggle, progress pie/bar
- **Attachments:** list with preview/download, upload button
- **Activity log:** chronological feed of status changes, assignments, comments

#### `/dashboard/team` (Team Management)
- **Grid/list of members:** avatar, name, email, role badge, department, skills tags
- **Search:** by name/email
- **Filter:** by role
- **"Add Member" button** → `/dashboard/team/create`
- **Each card:** edit (inline or modal), delete (confirm dialog), invite (optional)

#### `/dashboard/team/create` & edit
- Form fields: Name, Email, Role (select), Department (text), Skills (tag input / comma-separated), Password (create mode only)
- Validation: email unique, password min 6 chars

#### `/dashboard/reports` (Reports Dashboard)
- **Overview cards:** total projects, avg progress, total hours logged
- **Project selector** → shows project report
- **User selector** → shows user report
- **Project Report:** progress %, tasks breakdown (chart or bars), time logged, tasks remaining
- **User Report:** assigned tasks by status, hours by project, recent activity
- Use simple charts (CSS-drawn bars or lightweight chart library like recharts)

### 2.3 User Panel (`/user/*`)

All routes require `role = member OR manager`.

#### `/user` (My Dashboard)
- Welcome heading with user name
- **My Tasks:** list of assigned tasks with status, priority, due date
- **Quick stats:** tasks completed this week, hours logged this week, projects involved
- **Recent activity feed**

#### `/user/projects` (Projects List)
- Grid of projects the user is involved in
- Each card: title, client, progress bar, user's task count
- Click → `/user/projects/[projectId]`

#### `/user/projects/[projectId]` (Project View)
- Project summary (dates, description, budget, status)
- Sprints accordion: expand to see tasks within each sprint
- Progress bar at project level

#### `/user/projects/[projectId]/sprints/[sprintId]`
- Sprint detail with filtered view: only tasks assigned to current user (or all if manager)
- Expandable task items with quick status update

#### `/user/tasks/[taskId]` (Task Work Page)
- **Full task detail:** description, attachments, subtasks
- **Status update:** button or dropdown to move status forward
- **Comments:** threaded discussion with add comment form
- **Time log:** form to log hours worked + description
- **Attachments:** view, download, upload
- **Subtasks:** toggle checklist items
- **Mark complete flow:**
  - User clicks "Mark as Review" (moves to `review`)
  - If manager viewing, shows "Approve" button (moves to `done`)
  - Visual indicator: who needs to approve next
- **Progress indicator:** visual progress of subtasks, status progress bar

---

## 3. Engineering Requirements

### 3.1 UI/UX & Design Language
- **Design system:** Use Tailwind CSS with a clean, modern design language
- **Color palette:** Professional blues/greys with status-color accents:
  - To Do → grey/slate, In Progress → blue, Review → amber/yellow, Done → green
  - Priority: Low → grey, Medium → blue, High → orange, Critical → red
- **Typography:** Clean sans-serif (Inter or system font stack)
- **Spacing:** Consistent 4px grid
- **Shadows & borders:** Subtle cards with soft shadows, rounded corners (8-12px)
- **Animations:** Smooth transitions on hover (200ms ease), loading skeletons, toast animations
- **Icons:** Lucide React or Heroicons (consistent, clean icon set)

### 3.2 Responsive Design (Mobile / Tablet / Desktop)
- **Breakpoints:** Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)
- **Sidebar:** Collapses to hamburger menu on mobile, slide-out drawer
- **Layouts:** Single column on mobile, 2-column on tablet+ where applicable
- **Tables:** Horizontal scroll wrapper on mobile, or card-based layout fallback
- **Kanban:** Horizontal scroll on mobile, fits 2 columns on tablet, all 4 on desktop
- **Forms:** Stack vertically on mobile, 2-column grid on tablet+
- **Cards/Grid:** 1 column mobile, 2 columns tablet, 3-4 columns desktop
- **Touch targets:** Minimum 44px × 44px for interactive elements
- **Font sizes:** Scale appropriately (16px base on mobile, 14px on desktop)

### 3.3 State Management & Data Fetching
- **Server state:** React Query (@tanstack/react-query) for all API data
  - Automatic caching, background refetch, optimistic updates
  - Mutations with `invalidateQueries` for list refreshes
- **Auth state:** React Context or Zustand store
  - `user`, `token`, `isAuthenticated`, `login()`, `logout()`
- **Form state:** React Hook Form + Zod for validation
- **Loading states:** Every async operation shows loading (skeleton, spinner, or button loading)
- **Empty states:** Every list has a meaningful empty state with illustration/message + action CTA
- **Error states:** Inline error boundaries, toast for mutations, retry buttons

### 3.4 API Integration (`/client/src/lib/api.ts`)
- Create Axios instance with:
  - `baseURL` from env (`NEXT_PUBLIC_API_URL`)
  - Request interceptor: attach `Authorization: Bearer <token>` header
  - Response interceptor: on 401, clear token + redirect to `/login`
  - Response interceptor: on 403, show "Access denied" toast
  - Response interceptor: on 5xx, show generic error toast

### 3.5 Authentication Flow
- **Login Page:** POST `/api/auth/login` → receive `{ token, user }`
- Store token in localStorage
- Store user in auth context
- Redirect: `member` → `/user`, `admin`/`manager` → `/dashboard`
- **Protected routes:** Layout-level auth check with redirect
- **Token refresh:** On API 401, attempt refresh; if fails, logout
- **Logout:** Clear token, clear user, redirect to `/login`
- **Role-based UI:** Hide admin links (sidebar items, action buttons) from members

### 3.6 Dynamic Content
All frontend lists, details, filters, and stats MUST come from the API. No hardcoded project/task/sprint data. The admin dashboard content changes based on what the admin creates. The user panel shows only content relevant to the logged-in user (assigned tasks, involved projects).

### 3.7 Error Handling
- **Network errors:** Show toast "Network error. Please check your connection."
- **API validation errors:** Show field-level errors beneath form inputs (red text)
- **404s:** Custom 404 page with link back home
- **500s:** Toast "Something went wrong. Please try again."
- **Form errors:** Highlight invalid fields, show error message below, disable submit until valid
- **Retry:** Error states include "Try again" button

### 3.8 Performance
- **Next.js Image** for optimized thumbnails
- **Dynamic imports:** `next/dynamic` for heavy components (kanban board, charts)
- **Debounced search:** 300ms debounce on text filters
- **Pagination:** Server-side always, 20 items per page default
- **Skeleton loaders:** Instead of spinners, use skeleton placeholders matching layout
- **Route prefetching:** Next.js `<Link>` prefetch for faster navigation

---

## 4. Development & Testing

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.x
- **HTTP Client:** Axios
- **Server State:** @tanstack/react-query
- **Forms:** react-hook-form + @hookform/resolvers (zod)
- **Drag & Drop:** @dnd-kit/core (for kanban)
- **Icons:** Lucide React
- **Charts:** Recharts (for reports)
- **Date handling:** date-fns
- **Toast:** sonner or react-hot-toast
- **Testing:** Vitest + React Testing Library + Playwright (E2E optional)

### Setup Commands
```bash
cd client
npm install
npm run dev          # next dev
```

---

## 5. Environment Variables (`client/.env`)

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
