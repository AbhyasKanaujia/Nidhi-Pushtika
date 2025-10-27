# PROJECT SPECIFICATION — Society Transaction System (Web App)

## SCOPE (FULL DELIVERY IN FIRST BUILD)

Build a secure, role-based web application to track society income/expense transactions with audit logs, PDF/Excel export, filters, user management, and fiscal-year edit lock.

App must be deployed on internet (Render + MongoDB Atlas). No partial/MVP deliveries.

---

## TECH STACK (MANDATORY)

* Backend: Node.js + Express (plain JS)
* Database: MongoDB Atlas (Mongoose)
* Auth: JWT in HttpOnly cookies
* Frontend: React + Ant Design
* Deployment: Single deployment; Express serves React build

---

## USER ROLES & PERMISSIONS

| Role   | Read Txn | Create/Edit/Delete Txn | View Audit | Manage Users |
| ------ | -------- | ---------------------- | ---------- | ------------ |
| Admin  | Yes      | Yes (no FY lock)       | Yes        | Yes          |
| Editor | Yes      | Yes (FY lock applies)  | No         | No           |
| Reader | Yes      | No                     | No         | No           |

No signup. Admin only creates users.

---

## BUSINESS RULES (NON-NEGOTIABLE)

1. Transaction types: only `income` or `expense`
2. Soft delete only; deleted entries excluded from totals
3. Past fiscal years are **read-only** for editors
4. Admin can override fiscal lock
5. Full audit log saved on create/update/delete/restore
6. Audit visible only inline under a row for Admin
7. Totals = exclude deleted always
8. Export Excel/PDF must respect filters and deleted-inclusion rules

---

## DATA MODEL

### users

```
name, email, passwordHash, role, isActive, createdAt, updatedAt
```

### transactions

```
type, amount, note, date, createdBy, updatedBy,
deleted, deletedBy, deletedAt, createdAt, updatedAt
```

### audit

```
transactionId, action, userId, timestamp, before, after
```

Audit must store full before/after snapshots.

---

## REQUIRED ENDPOINTS

```
/api/auth/login            [POST]
/api/auth/me               [GET]
/api/auth/logout           [POST]

/api/users                 [admin only, GET POST]
/api/users/:id             [admin only, PATCH soft-disable]

/api/transactions          [GET filtered + paginated + role filtering]
/api/transactions          [POST]
/api/transactions/:id      [PATCH]
/api/transactions/:id      [DELETE -> soft delete]
/api/transactions/:id/restore  [PATCH admin only]

/api/audit                 [admin only, GET with filters + pagination]

/api/reports/summary       [GET]

/api/export/excel          [GET]
/api/export/pdf            [GET]
```

Filter logic already fully defined in earlier messages and must be followed exactly.

---

## FRONTEND FUNCTIONAL REQUIREMENTS

* Login page → loads /auth/me → route guard

* Transactions page:

  * Filters: date range, type, search
  * Summary bar
  * Table with pagination
  * Inline row edit (for allowed roles)
  * Inline audit expand under row (admin only)
  * Soft delete, restore (role rules apply)

* Users page (admin only)

* Reports page:

  * date range filters
  * summary displayed
  * export excel/pdf
  * includeDeleted visible only to admin

---

## CODE QUALITY REQUIREMENTS

* Clean readable code; no dead code, no console logs
* Controllers separated from routes
* No business logic inside routes
* Role checks in backend, not frontend
* Error handling with proper responses
* Validation on all inputs

---

## ACCEPTANCE CRITERIA

Delivery is accepted only if ALL are true:

1. Full app runs on Render with Atlas DB
2. Roles and fiscal lock enforced in backend
3. Audit fully captured and visible inline
4. Export PDF and Excel working with filters
5. No clear-text passwords anywhere
6. No missing edge-cases from rules listed

If any rule above is violated, delivery is rejected.

