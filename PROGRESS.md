# Project Progress

## Phase 1: Setup
- [x] Init Next.js + Bun
- [x] Install Tailwind + Shadcn UI
- [x] Init Git repository and PROGRESS.md

## Phase 2: Auth & Core
- [x] Setup React Query + Axios interceptors
- [x] Setup Zustand auth store
- [x] Build `/login` UI + Hook Form + Zod
- [x] Implement client auth guards (root redirect)

## Phase 3: Admin Shell
- [x] Build layout UI (Sidebar, Header, Mobile Nav via Sheet)
- [x] Build `/dashboard` overview cards

## Phase 4: Projects Module
- [x] Build Projects grid/table view with Tabs toggle
- [x] Build Project create form (Hook Form + Zod + Select)
- [x] Used base-ui patterns: `render` (not `asChild`), `items` prop for Select
- [x] Fixed Zod 4 `coerce`/`preprocess` typing issues

## Phase 5: Tasks & Kanban
- [x] Build TaskStatusBadge + TaskPriorityBadge components
- [x] Build Tasks table page with sort/search
- [x] Build Kanban board with `@dnd-kit` drag-drop
- [x] Build Task detail page (subtasks, comments, attachments)
- [x] Build Task edit form page

## Phase 6: Sprints, User Portal & Remaining
- [x] Build Sprint detail page with task list and progress
- [x] Build User portal layout + sidebar + auth guard
- [x] Build User dashboard (My Tasks, Activity)
- [x] Build User projects list + project detail + sprint detail
- [x] Build User task detail (subtasks, comments, time log)
- [x] Build Team list + Create member form
- [x] Build Reports dashboard (stats cards, charts, progress bars)
- [x] Build shared components (EmptyState, LoadingSpinner)
- [x] Add constants (statuses, priorities, roles)
- [x] Add `.env.example`
