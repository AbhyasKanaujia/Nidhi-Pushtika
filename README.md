# Nidhi Pushtika - Society Transaction System

This project is a secure, role-based web application designed to track society income and expense transactions. It features audit logs, PDF/Excel export, filters, user management, and fiscal-year edit lock.

## Key Features

- Role-based access control with Admin, Editor, and Reader roles
- Transaction management with create, read, update, soft-delete, and restore functionality
- Audit logs visible inline for Admin users
- Reporting and export capabilities (Excel and PDF)
- User management for Admins
- Secure authentication using JWT in HttpOnly cookies
- React frontend with Ant Design components
- Express backend with MongoDB Atlas database
- Single deployment serving both API and frontend

## Frontend

- React with React Router for routing
- Ant Design for UI components
- Context API for authentication and user state management
- Pages: Login, Transactions, Users, Reports

## Backend

- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication with HttpOnly cookies
- Role and fiscal-year lock enforcement
- Audit logging for transaction changes

## Getting Started

1. Install dependencies in both `frontend` and `backend` directories.
2. Run the backend server.
3. Run the frontend development server.
4. Access the app via the frontend URL.

## Project Structure

```
project-root/
  backend/
  frontend/
    src/
      components/
      context/
      pages/
      App.jsx
      main.jsx
```

This README provides a high-level overview of the project. For detailed API and schema design, refer to `docs/Schema and API design.md`.
