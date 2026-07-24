# 🚀 LeadDesk Mini - Production-Ready Lead Management System

> A full-stack, secure, and modern Lead Capture & Management Platform built with Node.js, Express.js, MongoDB Atlas, EJS, and Vanilla JavaScript. Designed with glassmorphism aesthetics, session-based authentication, real-time AJAX lead processing, and production-grade security headers.

---

## 📌 Project Overview

**LeadDesk Mini** is a streamlined CRM and lead conversion management web application engineered for agency owners, digital marketers, and software vendors. It allows prospective clients to submit inquiry requests via an interactive, high-converting public landing page while providing administrators with a secure, password-protected dashboard to filter, search, track, and update lead statuses in real time.

---

## ✨ Features

### 🌐 Public Client Portal
- **High-Converting Landing Page**: Modern, responsive dark mode design with sleek micro-interactions and smooth scroll navigation.
- **Dynamic Lead Capture Form**: Asynchronous client-side form submission with real-time field validation (name, email, budget, message).
- **Instant Visual Feedback**: Interactive toast notifications and inline field error hints for smooth user experience.

### 🔐 Secure Admin Portal
- **Protected Dashboard (`/admin`)**: Password-protected route guarded by Express session authentication (`express-session`).
- **Modern Login Portal (`/login`)**: Professional glassmorphic login card with validation messages and secure cookie handling.
- **Session Durability & Hardening**:
  - `rolling: true` session refresh keeps active admins logged in seamlessly.
  - HTTP-Only and SameSite cookie attributes prevent XSS and CSRF vulnerabilities.
  - Anti-caching HTTP headers prevent browser back-button access after logout.
- **Helmet Security Integration**: Configured Content Security Policy (CSP) headers protecting against script injection.

### ⚡ Real-Time Lead Management
- **Interactive Metric Cards**: Dynamic counter cards showing Total, New, Contacted, and Closed lead analytics.
- **Instant AJAX Status Updates**: In-line status dropdown with instant MongoDB persistence and UI counter synchronization without full page reloads.
- **Real-Time Search & Filtering**: Client-side instant multi-column search (name, email, budget) and status filtering (`All`, `New`, `Contacted`, `Closed`).

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose ORM (Supports MongoDB Atlas & Local MongoDB)
- **Frontend / Templating**: EJS (Embedded JavaScript), Vanilla JavaScript (ES6+), Bootstrap 5, Bootstrap Icons, Google Fonts (Inter)
- **Authentication & Security**: Express Session (`express-session`), Helmet (`helmet`), CORS, Dotenv (`dotenv`)
- **Development Tools**: Nodemon

---

## 📁 Folder Structure

```text
Lead_flow/
├── config/
│   └── db.js                 # MongoDB connection handler with Atlas support
├── controllers/
│   ├── authController.js     # Admin login, logout, & session verification
│   ├── leadController.js     # CRUD operations for Lead management
│   └── viewController.js     # EJS view rendering handlers
├── middleware/
│   ├── auth.js               # Route guard middleware & anti-caching headers
│   ├── errorHandler.js       # Centralized 404 & 500 error handlers
│   └── validateLead.js       # Express validator for incoming lead payload
├── models/
│   └── Lead.js               # Mongoose schema and model definition
├── public/
│   ├── css/
│   │   └── style.css         # Design system, dark glassmorphism, & custom utility styles
│   └── js/
│       ├── admin.js          # Admin dashboard AJAX controller & status filter logic
│       └── main.js           # Client-side form handler & UI toast notifications
├── routes/
│   ├── apiRoutes.js          # REST API endpoints (/api/leads)
│   └── viewRoutes.js         # Frontend page routes (/, /login, /logout, /admin)
├── views/
│   ├── partials/
│   │   ├── header.ejs        # Shared navigation header & meta dependencies
│   │   └── footer.ejs        # Shared footer
│   ├── 404.ejs               # Custom 404 Not Found error page
│   ├── 500.ejs               # Custom 500 Internal Server error page
│   ├── admin.ejs             # Admin Dashboard view
│   ├── index.ejs             # Public Landing Page & Lead Form view
│   └── login.ejs             # Secure Admin Login view
├── .env                      # Environment variables (Git-ignored)
├── .env.example              # Environment variables template
├── app.js                    # Express application entry point
├── package.json              # Project dependencies and npm scripts
└── README.md                 # Project documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/leaddesk_mini?retryWrites=true&w=majority

# Administrator Credentials
ADMIN_EMAIL=admin@leaddesk.com
ADMIN_PASSWORD=AdminPass123!

# Session Secret Key
SESSION_SECRET=leaddesk_super_secret_session_key_2026
```

---

## 🚀 Installation & Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB** (Local instance or free cloud cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/lead-flow.git
cd lead-flow
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The server will start at:
- **Public Landing Page**: `http://localhost:5000`
- **Admin Login**: `http://localhost:5000/login`
- **Admin Dashboard**: `http://localhost:5000/admin`

---

## 🍃 MongoDB Setup

LeadDesk Mini uses **Mongoose ORM** to manage database connections. It seamlessly connects to both cloud-hosted **MongoDB Atlas** clusters and local MongoDB instances.

### Connecting to MongoDB Atlas:
1. Create a database cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, whitelist your IP address (or `0.0.0.0/0` for production hosting).
3. Under **Database Access**, create a database user with read/write privileges.
4. Copy the connection string and paste it into `.env` under `MONGODB_URI`.

---

## 🔐 Admin Authentication

Access to `/admin` and protected management APIs is secured via Express session authentication.

### Default Credentials (Configurable via `.env`):
- **Email**: `admin@leaddesk.com`
- **Password**: `AdminPass123!`

### Security Highlights:
- **Protected Routes**: Direct access to `/admin` without logging in triggers an immediate 302 redirect to `/login`.
- **Protected APIs**: Requests to `/api/leads` without valid session cookies return `401 Unauthorized`.
- **Session Auto-Refresh**: Active user interactions extend session lifetime via `rolling: true`.
- **Anti-Caching Headers**: Prevents unauthenticated viewing of cached dashboard states upon browser back-button navigation after logout.

---

## 📡 REST API Reference

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/api/leads` | `POST` | No | Submit a new lead inquiry from public form |
| `/api/leads` | `GET` | **Yes** | Fetch all leads and metric statistics |
| `/api/leads/:id/status` | `PATCH` | **Yes** | Update a lead's status (`New`, `Contacted`, `Closed`) |

### Example Request (Submit Lead)
```http
POST /api/leads
Content-Type: application/json

{
  "name": "Sarah Jenkins",
  "email": "sarah@example.com",
  "budget": "$5,000 - $10,000",
  "message": "Looking to redesign our corporate platform."
}
```

### Example Response
```json
{
  "success": true,
  "message": "Thank you! Your inquiry has been submitted successfully.",
  "data": {
    "_id": "66a12bc4f3a7a9128c4e5678",
    "name": "Sarah Jenkins",
    "email": "sarah@example.com",
    "budget": "$5,000 - $10,000",
    "message": "Looking to redesign our corporate platform.",
    "status": "New",
    "createdAt": "2026-07-24T20:30:00.000Z"
  }
}
``

## 🌐 Deployment

### Deploying on Render / Railway / Heroku:
1. Push repository to GitHub.
2. Create a new Web Service on Render / Railway.
3. Connect your GitHub repository.
4. Set Environment Variables (`PORT`, `NODE_ENV=production`, `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`).
5. Build Command: `npm install`
6. Start Command: `npm start`

---

## 🔮 Future Improvements

- [ ] Export leads to CSV / Excel format.
- [ ] Email notification integration via Nodemailer / SendGrid upon new lead submission.
- [ ] Multi-user admin role management (Super Admin, Sales Manager).
- [ ] Activity audit logs for status modifications.

---

## 👨‍💻 Author

**Digital Heroes / LeadDesk Team**  
Full Stack Developer & Software Architect  

*Built with precision, modern UX standards, and production-ready security practices.*
