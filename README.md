# JobUpdate - Full-Stack Job & Opportunity Portal

A simple, modern, full-stack JobUpdate portal designed to announce verified career opportunities, fresher hiring programs, and off-campus drives. Built as a single cohesive project containing both a **public website** for job seekers and a **private admin panel** for administrators.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express.js (REST API architecture)
- **Database**: MongoDB (via Mongoose ODM) with resilient automatic storage fallback
- **Authentication**: JSON Web Tokens (JWT) for administrator session security
- **Environment Management**: `dotenv` with `.env.example`

---

## Features & Scope

### 1. Public Pages
- **Home (`#`)**: Verified job listings feed with cards displaying role title, company, location, batch, salary, and experience tags, plus advertisement placement slots.
- **Job Details (`#job/:id`)**: Comprehensive role specification containing:
  - Company Information
  - About the Role
  - Eligibility Criteria
  - Other Basic Information (selection process, work mode, perks)
  - Advertisement Placeholders
  - **Apply Now Button** (located at the very bottom, opening the company's verified application URL).
- **About (`#about`)**: Background, mission, and commitment to job seekers.
- **Contact (`#contact`)**: Functional inquiry form sending messages to the Express backend (`POST /api/contact`).

### 2. Private Admin Panel
- **Admin Login (`#admin/login`)**: Protected login for authorized moderators.
- **Admin Dashboard (`#admin/dashboard`)**: Summary metrics (Total Postings, Active Postings, Database Status), full listings table, and actions (View, Edit, Delete).
- **Add Job (`#admin/add`)**: Complete form to publish new job updates with required company and eligibility fields.
- **Edit Job (`#admin/edit/:id`)**: Pre-populated editor to update role details, status, and application links.

---

## Environment Variables Setup

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure the following variables in your `.env`:

```env
# Server Port (Default is 3000)
PORT=3000

# MongoDB Connection String
# Example for local MongoDB: mongodb://127.0.0.1:27017/jobupdate
# Example for MongoDB Atlas: mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobupdate?retryWrites=true&w=majority
MONGODB_URI="mongodb://127.0.0.1:27017/jobupdate"

# JWT Secret for Admin Authentication
JWT_SECRET="your-super-secret-jwt-key"

# Default Administrator Credentials
ADMIN_EMAIL="admin@jobupdate.com"
ADMIN_PASSWORD="admin_secret_password"
```

> **Note on MongoDB**: If an external MongoDB server is not running or unreachable, the system gracefully continues running with an active in-memory repository pre-seeded with sample job updates. Once a valid `MONGODB_URI` is provided, Mongoose automatically connects to your MongoDB cluster.

---

## How to Run the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
This boots the unified Express server and Vite development middleware on port `3000`:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Production Build & Start
```bash
# Compile React frontend and bundle backend server
npm run build

# Start production server
npm start
```

---

## Administrator Login Credentials

For quick evaluation and testing, the default pre-configured credentials are:

- **Email**: `admin@jobupdate.com`
- **Password**: `admin_secret_password`

You can change these anytime in your `.env` file using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` variables.

---

## REST API Architecture

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and database connection status |
| `GET` | `/api/jobs` | Retrieve all active job updates (newest first) |
| `GET` | `/api/jobs/:id` | Retrieve detailed information for a single job |
| `POST` | `/api/contact` | Submit a public contact message |

### Protected Admin Endpoints (Require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Authenticate admin credentials and receive JWT |
| `GET` | `/api/admin/me` | Verify admin token validity |
| `GET` | `/api/admin/stats` | Retrieve job counts and database engine stats |
| `POST` | `/api/jobs` | Create a new job update |
| `PUT` | `/api/jobs/:id` | Update an existing job update |
| `DELETE` | `/api/jobs/:id` | Permanently remove a job update |

---

## Security Model

- Public visitors can only view jobs and read job details.
- Public visitors **cannot** create, edit, or delete job updates.
- All mutating endpoints (`POST /api/jobs`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id`) are strictly protected on the backend using the Express `authMiddleware`.
