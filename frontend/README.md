# Speaker Portal Frontend

This is the frontend for the Speaker Portal, a modern event and speaker management platform. Built with Vite, React, TypeScript, Material UI, and Redux Toolkit, it provides a professional, scalable, and beautiful user experience for event organizers, speakers, and attendees.

## Tech Stack

- **Vite** (React + TypeScript)
- **Material UI (MUI)** for all UI components and theming
- **Redux Toolkit** for state management
- **RTK Query** for API integration
- **React Hook Form** for form management
- **MUI DataGrid** for advanced tables
- **Axios** for custom API calls

## Project Structure

```
src/
  api/         # RTK Query API slices (auth, events, speakers, profile, etc.)
  assets/      # Static assets (images, logos)
  components/  # Shared/presentational components (atomic UI, DataGrid cells, etc.)
    ui/        # Atomic UI components (Button, Card, Input, etc.)
  constants/   # App-wide constants (API base URL, enums)
  features/    # Feature-based slices/components (auth, events, etc.)
  hooks/       # Custom React hooks
  layouts/     # Layout wrappers (sidebar, main layout)
  pages/       # Route-level components (Dashboard, Events, Speakers, Profile, Auth)
  services/    # Business logic/services
  store/       # Redux store setup
  theme/       # Theming and design system
  types/       # TypeScript types/interfaces
  utils/       # Utility functions
```

## Key Features

- **Authentication**: Modern login/signup UI with right-aligned forms and background image
- **Role-based Access**: Supports speakers and attendees, with protected routes and role-based UI
- **Profile Management**: Edit profile, upload avatar, update bio/contact info
- **Event Management**: Create, edit, and list events; assign speakers (not attendees) to events
- **Speaker Management**: List and manage speakers; only speakers can be selected for events
- **RSVP System**: RSVP status for each speaker per event, displayed in event listings
- **Modern UI/UX**: Full Material UI theming, beautiful sidebar, elegant backgrounds, responsive layouts
- **API Integration**: Modularized API calls, integrated with backend at `http://localhost:3000/`
- **State Management**: Redux Toolkit and RTK Query for robust, scalable state and data fetching

## Setup & Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Environment:**
   - The frontend expects the backend API to be running at `http://localhost:3000/`.
   - API endpoints are managed in `src/api` and `src/constants/api.ts`.

## Customization & Theming

- All theming is managed in `src/theme/`. You can adjust the color palette, typography, and component overrides there.
- The sidebar and background use gradients and transparency for a modern look.

## Contributing

1. Follow the established folder structure and naming conventions.
2. Use Material UI components and theming for all UI work.
3. Place shared UI in `src/components/ui/` and feature-specific logic in `src/features/`.
4. Use RTK Query for all API calls; add new endpoints in `src/api/`.
5. Keep code clean, efficient, and highly componentized.
