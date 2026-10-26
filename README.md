# StaffSync - Modern Human Resource Management Solution (MERN)

StaffSync is a comprehensive web-based application built using the **MERN Stack** (MongoDB, Express.js, React.js, and Node.js) that streamlines and automates various HR processes within an organization. The system provides distinct roles and access levels for **HR personnel**, **Managers**, and **Employees**, ensuring efficient management and transparency across all operations.

---

## 🌟 Key Features by Role

| Feature | HR Personnel | Managers | Employees |
|---|:---:|:---:|:---:|
| **Dashboard & Metrics** | Organization overview, headcount, pending leaves | Team summary, team leaves | Personal stats (leaves, attendance count) |
| **Employee Directory** | Full CRUD (Add, Edit, View, Delete, Assign Manager) | View direct team members | Profile view |
| **Leave Management** | View & approve/reject all leave requests | Review & approve/reject team leaves | Apply for leave, view status & feedback |
| **Attendance Tracking** | View company-wide attendance records by date | View team attendance records | 1-Click Daily Check-in / Check-out |
| **Announcements & News** | Create, publish, and delete company announcements | View news feed | View news feed |
| **Training Programs** | Create & manage training programs, assign staff | Create training programs for team | View enrolled training sessions & trainers |
| **Personal Profile** | Manage account settings | Manage account settings | Update phone, address, and password |

---

## 🛠️ Tech Stack & Prerequisites

- **Frontend**: React 18, Vite, Bootstrap 5, Axios, React Router 6
- **Backend**: Node.js (v16+), Express.js, JSON Web Tokens (JWT), bcryptjs
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Deployment Ready**: Production-ready static build serving, Render blueprint (`render.yaml`), and Vercel routing (`vercel.json`).

---

## 🚀 Quick Start Guide (Local Setup)

### 1. Clone & Install Dependencies

Clone this repository and install dependencies for both root, server, and client:

```bash
git clone <your-repository-url>
cd StaffSync

# Install server and client packages
npm run install:all
```

*(Alternatively, run `npm install` inside both `server` and `client` directories).*

---

### 2. Configure Environment Variables

Create or configure `.env` inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/staffsync
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

> **Using MongoDB Atlas (Cloud Database - Free):**
> 1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
> 2. Create a free M0 cluster.
> 3. Under **Database Access**, create a user with a password.
> 4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`).
> 5. Click **Connect** -> **Drivers** (Node.js) and copy the connection string into `server/.env`:
>    ```env
>    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/staffsync?retryWrites=true&w=majority
>    ```

---

### 3. Seed Demo Users & Sample Data

Run the database seed script to populate demo users for each role:

```bash
npm run seed
```

#### Demo Logins:
| Role | Email | Password |
|---|---|---|
| **HR** | `hr@staffsync.com` | `hr1234` |
| **Manager** | `manager@staffsync.com` | `mgr1234` |
| **Employee** | `employee@staffsync.com` | `emp1234` |

---

### 4. Run the Application

You can run the frontend and backend in two separate terminals:

**Terminal 1 (Backend Server):**
```bash
npm run server
# API running at: http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
# Client running at: http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your web browser to sign in.

---

## 📦 How to Upload to a Git Repository (GitHub / GitLab)

1. **Initialize Git** (if not already done):
   ```bash
   git init -b main
   ```

2. **Add Files and Commit**:
   ```bash
   git add .
   git commit -m "feat: initial commit for StaffSync HR Management system"
   ```

3. **Link your Remote Repository & Push**:
   Create a new empty repository on [GitHub](https://github.com/new), then run:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

---

## 🌐 Deployment Instructions

### Option A: Unified Full-Stack Deployment on Render (Recommended & Free)

The project is preconfigured to allow Express to serve the built React frontend directly in production.

1. Push your code to GitHub.
2. Sign in to [Render](https://render.com/).
3. Click **New +** -> **Web Service** and connect your GitHub repository.
4. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm --prefix server install && npm --prefix client install && npm --prefix client run build`
   - **Start Command**: `node server/server.js`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_secure_random_jwt_secret`
6. Click **Deploy Web Service**. Render will build and host both the API and UI at a single URL.

*(Note: A `render.yaml` blueprint is also included in the repository for automatic Blueprint deployment).*

---

### Option B: Split Deployment (Vercel Frontend + Render Backend)

#### 1. Backend on Render:
- Create a Web Service pointing to root or `server/`.
- **Build Command**: `cd server && npm install`
- **Start Command**: `node server.js`
- Set `MONGO_URI` and `JWT_SECRET`.
- Copy your Render backend URL (e.g. `https://staffsync-api.onrender.com`).

#### 2. Frontend on Vercel:
- Import your repository on [Vercel](https://vercel.com/).
- Set **Root Directory** to `client`.
- Add an Environment Variable:
  - `VITE_API_URL`: `https://staffsync-api.onrender.com/api`
- Deploy. The included `client/vercel.json` ensures client-side routing works on refresh.

---

## 📚 API Reference Overview

All API endpoints are prefixed with `/api` and secured with Bearer JWT tokens.

| Route | Method | Description | Access |
|---|---|---|---|
| `/api/auth/register` | POST | Register new employee | Public |
| `/api/auth/login` | POST | Login and receive JWT | Public |
| `/api/auth/me` | GET | Get current authenticated user | Authenticated |
| `/api/users` | GET | List users (HR: all, Manager: team) | HR, Manager |
| `/api/users` | POST | Create employee/manager account | HR |
| `/api/users/:id` | PUT / DELETE | Update / delete employee record | HR |
| `/api/users/me/profile`| PUT | Update own personal profile | Authenticated |
| `/api/leaves` | GET / POST | View leave list / submit leave request | Authenticated |
| `/api/leaves/:id/status`| PUT | Approve or reject leave request | HR, Manager |
| `/api/attendance/checkin`| POST | Daily check-in | Authenticated |
| `/api/attendance/checkout`| POST | Daily check-out | Authenticated |
| `/api/attendance` | GET | View attendance records | HR, Manager |
| `/api/announcements` | GET / POST / DELETE | View or publish company announcements | Authenticated (POST/DELETE: HR) |
| `/api/trainings` | GET / POST / DELETE | View or manage training programs | Authenticated (POST/DELETE: HR/Mgr) |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
