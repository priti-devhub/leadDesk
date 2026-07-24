const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');

// Load Environment Variables
dotenv.config();

const connectDB = require('./config/db.js');
const apiRoutes = require('./routes/apiRoutes');
const viewRoutes = require('./routes/viewRoutes');
const { attachAuthLocals } = require('./middleware/auth');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

// Initialize Express Application
const app = express();

// Connect to MongoDB Database
connectDB();

// Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Body Parser & CORS Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session Middleware - Production Ready Config
app.use(
  session({
    name: 'leaddesk.sid', // Mask default session cookie name
    secret: process.env.SESSION_SECRET || 'leaddesk_super_secret_session_key_2026',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Resets cookie expiration on every request so active users stay logged in
    cookie: {
      httpOnly: true, // Prevents client-side JS XSS access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Attach authentication state to EJS locals for header/nav rendering
app.use(attachAuthLocals);

// Serve Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Configure EJS Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mount Application Routes
app.use('/api', apiRoutes);
app.use('/', viewRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 LeadDesk Mini Server is running on port ${PORT}`);
  console.log(`🌐 Public Landing Page: http://localhost:${PORT}`);
  console.log(`🔐 Admin Login:        http://localhost:${PORT}/login`);
  console.log(`⚡ Admin Dashboard:     http://localhost:${PORT}/admin`);
  console.log(`====================================================`);
});

module.exports = app;
