# Frontend - Nidhi Pushtika

This directory contains the React frontend application for the Nidhi Pushtika Society Transaction System.

## Overview

The frontend is built with React and uses Ant Design (AntD) for UI components. It communicates with the backend API to provide a secure, role-based interface for managing society transactions, users, and reports.

## Features

- User authentication with JWT stored in HttpOnly cookies
- Role-based UI rendering for Admin, Editor, and Reader roles
- Pages:
  - Login
  - Transactions (main working screen)
  - Users (admin only)
  - Reports (summary, export)
- Shared components for consistent UI (HeaderBar, Pagination, DateRangeFilter, SummaryStrip)
- React Router for client-side routing
- Context API for managing authentication state

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. The app will be available at `http://localhost:3000` (or the port Vite assigns).

## Project Structure

```
src/
  components/      # Reusable UI components
  context/         # React Context for authentication
  pages/           # Page components for routing
  App.jsx          # Root component with routing
  main.jsx         # Entry point for ReactDOM rendering
```

## Notes

- All API requests are proxied to `/api` and include credentials for cookie-based auth.
- Role-based access control is enforced both in the frontend UI and backend API.
- For backend setup and API details, refer to the root README.md and docs/Schema and API design.md.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production assets
- `npm run preview` - Preview production build locally
