# Speaker Backend

This is a Node.js backend project using Express and TypeScript.

## Scripts

- `npm run build` — Compile TypeScript to JavaScript
- `npm run dev` — Run in development mode with auto-reload
- `npm start` — Start the compiled app
- `npm run lint` — Run ESLint
- `npm run format` — Run Prettier

## Features

- Express server
- TypeScript support
- JWT authentication (jsonwebtoken)
- Password hashing (bcrypt)
- AWS SDK integration
- ESLint and Prettier for code quality

## Getting Started

1. Install dependencies: `npm install`
2. Run in dev mode: `npm run dev`
3. Build: `npm run build`
4. Start: `npm start`  

---

## Architecture

- Currently structured as a monolithic prototype for simplicity and ease of demonstration.
- Each domain module (auth, events, profile, etc.) is self-contained and can be extracted into independent microservices.
- This design makes transitioning to a microservices architecture straightforward as the system scales.

---

Generated by GitHub Copilot
