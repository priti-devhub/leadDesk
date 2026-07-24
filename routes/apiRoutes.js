const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLeadStatus,
} = require('../controllers/leadController');
const validateLeadMiddleware = require('../middleware/validateLead');
const { requireAuth } = require('../middleware/auth');

// Public API Route (Lead Capture)
router.post('/leads', validateLeadMiddleware, createLead);

// Protected Admin API Routes
router.get('/leads', requireAuth, getLeads);
router.patch('/leads/:id/status', requireAuth, updateLeadStatus);

module.exports = router;
