# Schema and AP Design

## MongoDB Collections

### 1) users

```
{
  _id: ObjectId,
  name: String,
  email: String,         // unique
  passwordHash: String,
  role: "admin" | "editor" | "reader",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### 2) transactions

```
{
  _id: ObjectId,
  type: "income" | "expense",
  amount: Number,
  note: String,
  date: ISODate,                  // respected FY logic
  createdBy: ObjectId (ref users),
  updatedBy: ObjectId (ref users),
  deleted: Boolean,               // soft delete
  deletedBy: ObjectId | null,
  deletedAt: ISODate | null,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### 3) audit

```
{
  _id: ObjectId,
  transactionId: ObjectId (ref transactions),
  action: "create" | "update" | "soft-delete" | "restore",
  userId: ObjectId (ref users),
  timestamp: ISODate,
  before: Object | null,       // full snapshot before update
  after: Object | null         // full snapshot after update
}
```

Why separate audit:

* Fast pagination on transaction list
* Audit only queried by admin
* Clean separation of concerns

## API Design

Base URL: `/api`

Auth handled by session or JWT; not detailing here yet.

### 1) Auth

```
POST /auth/login
POST /auth/logout
```

No signup; admin creates users manually.

### 2) Users (admin only)

```
GET    /users                 // list users
POST   /users                 // create user
PATCH  /users/:id             // edit name/role/password
DELETE /users/:id             // optional; or disable instead
```

### 3) Transactions

```
GET    /transactions
POST   /transactions
PATCH  /transactions/:id
DELETE /transactions/:id      // soft delete only
PATCH  /transactions/:id/restore  // admin only
```

Server must enforce:

* Fiscal-year lock for non-admin edits
* Readers cannot POST/PATCH/DELETE
* Editors cannot see deleted ones
* Admin sees all

### 4) Audit (admin only)

```
GET /audit?transactionId=...
```

### 5) Reporting & Export

```
GET /reports/summary?from=&to=
    returns { totalIncome, totalExpense, balance }

GET /export/excel?from=&to=
GET /export/pdf?from=&to=&mode=summary|full
```

## API Payloads

### Transactions

#### `GET /transactions`

Query Parameter:

```
page=Number                default 1
pageSize=Number            default 50
from=YYYY-MM-DD            optional
to=YYYY-MM-DD              optional
type=income|expense        optional
search=string              optional  (matches note or amount)
includeDeleted=true        admin only optional
```

Response:

```
{
  "data": [
    {
      "_id": "6745f3c0dbe164e40cda5b4a",
      "type": "income",
      "amount": 1500,
      "note": "Monthly maintenance - flat 203",
      "date": "2025-10-27T00:00:00.000Z",
      "createdBy": {
        "_id": "6745...b2",
        "name": "Abhyas"
      },
      "updatedBy": {
        "_id": "6745...d1",
        "name": "Admin"
      },
      "deleted": false
    },
    ...
  ],
  "totalCount": 15342,
  "page": 1,
  "pageSize": 50
}
```

Rules:

- Soft-deleted rows not included unless admin + includeDeleted=true
- Sorted by date desc by default
- Readers get only non-deleted
- Editors get only non-deleted
- Admin may include deleted
- Fiscal-year lock is enforced on write routes only, not on read
- Search will match both note and amount.
- Soft-deleted transactions will be completely excluded from all totals and reports.
- Which fields can be edited by editor/admin? All fields editable (type, amount, note, date)
- All monetary fields will support decimals.

I will now define the write endpoints one by one.

#### POST /transactions

Request body

```
{
  "type": "income" | "expense",
  "amount": Number,
  "note": String,
  "date": "2025-10-27"   // if omitted, backend sets today
}
```

Response

```
{
  "_id": "...",
  "type": "...",
  "amount": ...,
  "note": "...",
  "date": "...",
  "createdBy": { "_id": "...", "name": "..." },
  "updatedBy": { "_id": "...", "name": "..." },
  "deleted": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```

Audit entry created:

```
{
  action: "create",
  before: null,
  after: <full transaction after create>
}
```

#### PATCH /transactions/:id

Updates any field; backend enforces fiscal-year lock for editor.

Request body (partial allowed)

```
{
  "type": "income" | "expense",
  "amount": Number,
  "note": String,
  "date": "2025-10-28"
}
```

Response

```
{
  "_id": "...",
  "type": "...",
  "amount": ...,
  "note": "...",
  "date": "...",
  "updatedBy": { "_id": "...", "name": "..." },
  "updatedAt": "..."
}
```

Audit entry created:

```
{
  action: "update",
  before: <full transaction before change>,
  after: <full transaction after change>
}
```

Rules:

- A soft-deleted transaction cannot be edited until it is explicitly restored.
-

#### DELETE /transactions/:id  (soft delete)

Admin and editor can delete current year. Admin can delete old also.

Response

```
{ "success": true }
```

Audit entry created:

```
{
  action: "soft-delete",
  before: <record before delete>,
  after: <record after delete with deleted=true>
}
```

#### PATCH /transactions/:id/restore  (admin only)

Response

```
{ "success": true }
```

Audit entry created:

```
{
  action: "restore",
  before: <record with deleted=true>,
  after: <record with deleted=false>
}
```

### USERS API (Admin only)

#### GET /users

Returns list of all users.

Response

```
[
  {
    "_id": "...",
    "name": "Ramesh",
    "email": "ramesh@example.com",
    "role": "editor",
    "createdAt": "...",
    "updatedAt": "..."
  },
  ...
]
```

Password is never returned.

#### POST /users

Create a new user.

Request body

```
{
  "name": "Ramesh",
  "email": "ramesh@example.com",
  "password": "somepass",
  "role": "admin" | "editor" | "reader"
}
```

Response

```
{
  "_id": "...",
  "name": "...",
  "email": "...",
  "role": "editor",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### PATCH /users/:id

Edit user info or reset password.

Request body (partial allowed)

```
{
  "name": "...",          optional
  "role": "editor",       optional
  "password": "newpass"   optional
}
```

Response

```
{ "success": true }
```

#### 4) DELETE /users/:id

Response

```
{ "success": true }
```

DB Change

```
{ isActive: false, updatedAt: ... }
```

### Audit API

#### GET /audit  (admin only)

Query params (all optional, combined allowed)

```
page=Number             default 1
pageSize=Number         default 50

transactionId=ObjectId
userId=ObjectId
action=create|update|soft-delete|restore
from=YYYY-MM-DD
to=YYYY-MM-DD
```

Response

```
{
  "data": [
    {
      "_id": "...",
      "transactionId": "...",
      "action": "update",
      "user": { "_id": "...", "name": "Admin" },
      "timestamp": "2025-10-27T17:42:00.000Z",
      "before": {
         "_id": "...",
         "type": "income",
         "amount": 3000,
         "note": "Rent 203",
         "date": "...",
         "deleted": false,
         ...
      },
      "after": {
         "_id": "...",
         "type": "income",
         "amount": 2500,
         "note": "Discounted rent 203",
         "date": "...",
         "deleted": false,
         ...
      }
    },
    ...
  ],
  "totalCount": 54210,
  "page": 1,
  "pageSize": 50
}
```

Proceeding with **Reports** and **Export** API contracts.

---

### Reports API

#### GET /reports/summary

Purpose: Return totals for a period or overall.

Query params

```
from=YYYY-MM-DD    optional
to=YYYY-MM-DD      optional
```

Response

```
{
  "totalIncome": 12345.50,
  "totalExpense": 9850.00,
  "balance": 2495.50
}
```

Rules:

* Soft deleted transactions are excluded
* If no range is given, full dataset is considered
* FY lock does not apply to reading

### Export API

#### GET /export/excel

Query params

```
from=YYYY-MM-DD         optional
to=YYYY-MM-DD           optional
includeDeleted=true     admin only optional
```

Response

* Returns `.xlsx` file download
* Always only transactions, never audit
* Deleted rows only included if `includeDeleted=true` and caller is admin

Excel Columns

```
Date | Income | Expense | Note | CreatedByName | UpdatedByName | Deleted
```

If not including deleted, the `Deleted` is completely omitted.

### GET /export/pdf

Query params

```
from=YYYY-MM-DD
to=YYYY-MM-DD
mode=summary|full
includeDeleted=true   admin only optional
```

Modes

```
summary   -> only totals and header period info
full      -> summary + full table of filtered transactions
```

### AUTH API

#### POST /auth/login

Request

```
{
  "email": "ramesh@example.com",
  "password": "secret"
}
```

Response

```
{
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "admin|editor|reader"
  }
}
```

And sets HttpOnly cookie: `access_token=<jwt>`

#### GET /auth/me

Returns logged-in user's info using the cookie.

Response

```
{
  "_id": "...",
  "name": "...",
  "email": "...",
  "role": "admin|editor|reader"
}
```

#### 3) POST /auth/logout

Clears the access cookie.

Response

```
{ "success": true }
```

## Express + Mongo + React Folder Structure

```
project-root/
  backend/
    src/
      config/
        db.js
        auth.js
      models/
        User.js
        Transaction.js
        Audit.js
      middleware/
        requireAuth.js
        requireRole.js
        fiscalLock.js
      controllers/
        authController.js
        userController.js
        transactionController.js
        auditController.js
        reportController.js
        exportController.js
      routes/
        authRoutes.js        // /api/auth/*
        userRoutes.js        // /api/users/*
        transactionRoutes.js // /api/transactions/*
        auditRoutes.js       // /api/audit/*
        reportRoutes.js      // /api/reports/*
        exportRoutes.js      // /api/export/*
      utils/
        pdfBuilder.js
        excelBuilder.js
        dateUtils.js
      app.js
      server.js
    public/                 // React build output placed here after build
    package.json

  frontend/                 // React (AntD) source
    src/
      api/                  // axios wrappers
      components/
      pages/
      hooks/
      context/
      App.jsx
      main.jsx
    package.json
```

Backend serves:

* `/api/...` → data
* `/` → static React build

## Order of Implementation (Do not start with UI)

```
1) Setup Express + Mongo connection
2) Implement /auth/login (JWT cookie)
3) Implement /users (admin only) with requireRole
4) Implement /transactions (create/read/update/delete/restore)
5) Implement fiscal-year lock middleware
6) Add audit logging inside transaction controller
7) Implement /audit (filters + pagination)
8) Implement /reports/summary
9) Implement /export/excel
10) Implement /export/pdf
11) Add global error handling + input validation
12) Deploy to Render + connect Atlas
```

## Mandatory Security Rules (must implement, not optional)

* JWT must be in HTTP-only cookie, not in localStorage
* Password must be hashed with bcrypt
* Role check must be in backend, not UI
* Returned objects must never contain passwordHash
* Deleted transactions always excluded unless admin includes explicitly
* No update on soft-deleted record without restore

## Frontend Integration Contract (Important)

### Login flow

1. `POST /api/auth/login`
   Backend sets HttpOnly cookie

2. Immediately call `GET /api/auth/me` to load user info into state

3. Store user info in React context, not in localStorage

### Role-based UI rules

* If role = `reader`: hide add/edit/delete UI and hide Users and Audit sections
* If role = `editor`: show add/edit, hide Users and Audit
* If role = `admin`: show everything

You must not rely only on frontend checks; backend will re-check.

### Base API rules

All frontend requests go to:

```
/api/...   (no need absolute URL since same domain)
```

Use `withCredentials: true` in axios to send the cookie.

Example axios instance:

```js
const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});
```

## Frontend Page Structure

```
/login
/transactions     (default landing after login)
/users            (admin only)
/reports          (summary + print/export)
```

No separate Audit page. Audit appears inline under a transaction row when expanded.

### Transactions Page (Main Working Screen)

Components inside same page:

1. **Filters bar at top**

    * Date range picker
    * Type dropdown: All | Income | Expense
    * Search box (note or amount)
    * Reset filters button

2. **Summary strip (live)**

    * Total Income | Total Expense | Balance
    * Updates based on current filters

3. **Transactions table**

    * Columns: Date | Type | Amount | Note | CreatedBy | UpdatedBy | Actions
    * Row actions depend on role:

        * reader: no action
        * editor: edit inline, delete
        * admin: edit inline, delete, restore (if deleted)

4. **Inline edit cells**

    * Clicking a cell converts it into editable input (for allowed roles)
    * Exiting a row completes an edit session. Multiple columns may be edited at this time. 
    * If browser or tab is being closed without save, warn. 

5. **Audit toggle**

    * A small icon (like "view changes") on each row (visible only to admin)
    * On click → expands an accordion under that row
    * Shows chronological list of all edits with before/after diffs
    * Scrollable inside that expanded area, not full page

### Users Page (Admin only)

Simple table:

* Name | Email | Role | Status (active/disabled) | Actions (edit/disable/reset password)
* Add User button at top

### Reports / Export Page

* Date range select
* Buttons: Export Excel, Export PDF
* Toggle: Summary or Full mode
* `includeDeleted` option shown only to Admin

On same page below filters:

* Show summary cards
* Show simple read-only table for preview before download

## Navigation

A very simple top bar:

```
[ Transactions ] [ Reports ] [ Users (admin only) ]       [ Logged in as: X ] [ Logout ]
```

No deep nesting. Straightforward.

## Frontend Implementation Plan


### Overall Project Setup

```
cd frontend
npm create vite@latest . --template react
npm install antd axios dayjs react-router-dom
npm install --save-dev @vitejs/plugin-react
```

Then connect this to backend using `/api/...` base with `withCredentials:true`.

### Shared Components

**/src/components/**

* `HeaderBar.jsx` – top navigation (Transactions, Reports, Users, Logout)
* `SummaryStrip.jsx` – shows total income/expense/balance
* `DateRangeFilter.jsx` – reusable AntD RangePicker + Apply/Reset
* `Pagination.jsx` – AntD pagination wrapper
* `AuditRow.jsx` – renders the under-row expandable audit list (admin only)

### 3. Context

**/src/context/AuthContext.jsx**

* Holds user info (name, role)
* Provides `login()`, `logout()`, `fetchMe()`
* Used to conditionally render routes and buttons

### 4. Pages

#### `/login`

* AntD Form with Email + Password
* On submit: `POST /api/auth/login`, then `GET /api/auth/me`
* Store user in AuthContext, redirect to `/transactions`

#### `/transactions`

* Table using AntD Table component
* Filters bar on top (AntD RangePicker, Select, Input.Search)
* Inline row editing:

    * AntD `EditableCell` pattern
    * Save triggers `PATCH /api/transactions/:id`
* Row actions:

    * Delete (soft)
    * Restore (if admin and deleted)
    * Audit icon → expands `AuditRow`
* Pagination below table

#### `/users` (admin only)

* Simple table: name, email, role, active status
* Add user modal (AntD Form)
* Edit inline or modal
* Disable toggles `PATCH /api/users/:id` with `{ isActive:false }`

#### `/reports`

* Date range filters
* Summary display (`GET /api/reports/summary`)
* Buttons: Export Excel, Export PDF (call `/api/export/...`)
* Checkbox “Include deleted” (visible only for admin)
* Table for preview of data before export

### 5. Routing

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route element={<ProtectedLayout />}>
    <Route path="/transactions" element={<Transactions />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/users" element={<Users />} />
  </Route>
</Routes>
```

`ProtectedLayout` calls `/api/auth/me` on mount and redirects to `/login` if cookie invalid.

### Deployment Flow

1. In `frontend/`, run `npm run build`
2. Move `frontend/dist` → `backend/public`
3. Add in Express:
    ```js
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    ```
4. Push to Render.
   Backend serves both API and frontend.

### 7. Summary of UX logic

* Pagination: Classic (AntD Pagination)
* Editing: Inline
* Audit: Expandable under row
* Deleted rows: hidden except admin with toggle
* Fiscal year lock: backend-enforced only; UI will show “locked” message if backend rejects
* All totals exclude deleted
* PDF/Excel exports use same filters


Here is the **Handoff Specification Document** you can directly give to a developer.

---

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

---

If you want I can now generate a **“Developer Onboarding Readme”** (the version you put inside the repo root) or a **Task Breakdown Checklist** for controlling the freelancer’s work sprint-wise.
Say which you want next:

Reply exactly with:

`README` or `TASK BREAKDOWN`

## Frontend Order of Implementation

To decide the order of implementation for the frontend, I would consider the following factors:

1. **Core User Flows and Pages:** Prioritize pages and features that are central to the application's main use cases, such as login, transactions management, and reporting. This ensures the core functionality is available early.

2. **Role-Based Access and UI:** Since the app has distinct roles (admin, editor, reader) with different UI and permissions, implementing the authentication and role-based UI rendering early is important to guide subsequent feature development.

3. **Component Reusability:** Identify shared components (e.g., header, filters, pagination) that will be used across multiple pages and implement them early to promote consistency and reduce duplication.

4. **Data Dependencies:** Implement pages in an order that respects backend data availability and dependencies. For example, transactions page depends on user authentication and API endpoints for transactions.

5. **Complexity and Integration:** Start with simpler pages or components to build confidence and infrastructure (e.g., API integration, context providers) before moving to more complex features like inline editing or audit views.

6. **User Experience Flow:** Follow the natural user journey, starting from login, then main working screen (transactions), followed by user management and reporting.

Based on these considerations, a suggested order of implementation for the frontend is:

1. Setup project, routing, and authentication context (AuthContext) to manage user state and roles.

2. Implement the Login page with form and API integration.

3. Implement shared components: HeaderBar, Pagination, DateRangeFilter, SummaryStrip.

4. Implement Transactions page:
    - Filters bar
    - Summary strip
    - Transactions table with pagination
    - Inline editing for allowed roles
    - Row actions (delete, restore)
    - Audit toggle and expandable audit rows (admin only)

5. Implement Users page (admin only):
    - User list table
    - Add user modal
    - Edit and disable user functionality

6. Implement Reports page:
    - Date range filters
    - Summary display
    - Export buttons (Excel, PDF)
    - Include deleted toggle (admin only)
    - Preview table for export data

7. Finalize routing with ProtectedLayout and role-based route guards.

This order ensures foundational elements and core user flows are built first, enabling incremental development and testing of more advanced features.

If you want, I can now create a detailed task breakdown checklist for this frontend implementation order.

### Transaction Table UI Design

- __Date as Section Headers with Grouped Cards__

    - Group transactions by date with a sticky or floating date header.
    - Each date section contains cards for transactions on that day.
    - This reduces repetition of the date and creates a natural timeline feel.

- __Timeline or Vertical Stepper View__

    - Visualize transactions as points on a vertical timeline.
    - Date is implicit in the timeline position or shown as a label.
    - Each transaction card can expand or collapse for details.
    - This gives a sense of flow and history, making it engaging.

- __Conversation/Chat Style UI__

    - Present transactions like chat bubbles.
    - Income transactions aligned to the right in green, expenses to the left in red.
    - Date separators appear as timestamps between groups.
    - This is very mobile-friendly and intuitive.

- __Interactive Summary Cards with Drill-Down__

    - Show summarized cards for each day or category with totals.
    - Tap a summary card to expand and show individual transactions.
    - Keeps the UI clean and focused on insights.

- __Swipeable Cards with Quick Actions__

    - Each transaction card supports swipe gestures for edit, delete, or favorite.
    - Provides quick access to common actions without clutter.

- __Use of Icons and Visual Cues__

    - Use culturally relevant icons or symbols for transaction types.
    - Color coding and subtle animations to guide attention.

- __Progressive Disclosure__

    - Show minimal info upfront (note and amount).
    - Tap or long press to reveal date, category, and other details.
    - Keeps the interface uncluttered.

- __Smart Sorting and Filtering UI__

    - Allow users to easily switch views: by date, by category, by amount.
    - Use segmented controls or tabs for quick toggling.

- __Personalized Insights Panel__

    - Alongside the list, show personalized insights like spending trends, alerts, or tips.
    - Makes the experience more engaging and valuable.
