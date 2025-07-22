# Speaker Platform – Full Stack Prototype

## Overview

This project is a modern, full-stack event and speaker management platform, featuring:

- **Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), JWT Auth, AWS SES, Socket.IO, robust modular structure, and automated tests.
- **Frontend:** React (with Vite), Material UI (MUI), Redux Toolkit, React Router, componentized and scalable folder structure, and a sharp, professional UI.

---

## Architecture

### Backend (`/backend`)

- **Framework:** Express.js with TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT, bcrypt
- **Email:** AWS SES (v3)
- **Real-time:** Socket.IO for in-app messaging
- **Scheduled Jobs:** node-cron for reminders
- **Testing:** Jest, Supertest
- **Code Quality:** ESLint, Prettier
- **Structure:** Modular (routes, models, services, middleware, jobs, tests)

#### Key Folders:

- `src/models/` – Mongoose models (Speaker, Event, RSVP, etc.)
- `src/routes/` – Express route handlers (auth, events, profile, etc.)
- `src/services/` – Business logic (email, etc.)
- `src/jobs/` – Scheduled background jobs
- `src/middleware/` – Auth and other middleware
- `tests/` – Automated tests

### Frontend (`/frontend`)

- **Framework:** React (Vite)
- **UI:** Material UI (MUI), styled-components
- **State:** Redux Toolkit, RTK Query
- **Routing:** React Router v6+
- **Forms:** React Hook Form
- **API:** Axios, RTK Query
- **Code Quality:** ESLint, Prettier
- **Structure:** Highly componentized (features, pages, components, api, store, theme)

#### Key Folders:

- `src/components/` – Reusable UI components
- `src/features/` – Redux slices and feature logic
- `src/pages/` – Top-level pages (Dashboard, Events, Profile, etc.)
- `src/api/` – API slices for backend integration
- `src/layouts/` – App layout and navigation
- `src/theme/` – Centralized theme and ThemeProvider

---

## Setup & Running the Prototype

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB Atlas account (or local MongoDB)
- AWS account for SES (for email features)

---

### 1. Backend Setup

```bash
cd backend
cp .env.example .env   # Fill in your MongoDB URI, JWT secret, AWS keys, etc.
npm install
npm run dev            # For development (auto-reloads)
# or
npm run build
npm start              # For production
```

- The backend runs on `http://localhost:3000/` by default.
- All API endpoints are under `/api` (e.g., `/api/events`, `/api/speakers`).
- Auth endpoints: `/auth/login`, `/auth/signup`
- Real-time messaging: Socket.IO on the same port.

#### Testing

```bash
npm run test
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- The frontend runs on `http://localhost:5173/` by default (Vite).
- The app is fully componentized and uses MUI for a sharp, modern look.
- Update API base URLs in `src/constants/api.ts` if needed.

---

## Integration

- The frontend is preconfigured to communicate with the backend at `http://localhost:3000/`.
- CORS is enabled on the backend for local development.
- All authentication, event, RSVP, and messaging features are integrated end-to-end.

---

## Customization & Extensibility

- Add new features by creating new slices in `src/features/` and new pages in `src/pages/`.
- The theme is centralized in `src/theme/` for easy UI customization.
- Backend jobs (e.g., reminders) are managed in `src/jobs/`.

---

## Environment Variables

See `.env.example` in `/backend` for all required environment variables (MongoDB URI, JWT secret, AWS SES keys, etc.).

---

## Code Quality

- Both backend and frontend use ESLint and Prettier for consistent, clean code.
- TypeScript is enforced throughout for type safety.

---

## Contact

For any questions or contributions, please open an issue or pull request.
