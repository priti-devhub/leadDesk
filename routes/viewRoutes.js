const express = require('express');
const router = express.Router();
const {
  renderLandingPage,
  renderAdminDashboard,
} = require('../controllers/viewController');
const {
  renderLoginPage,
  handleLogin,
  handleLogout,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Public Page Routes
router.get('/', renderLandingPage);
router.get('/login', renderLoginPage);
router.post('/login', handleLogin);
router.get('/logout', handleLogout);
router.post('/logout', handleLogout);

// Protected Admin Route
router.get('/admin', requireAuth, renderAdminDashboard);

module.exports = router;
