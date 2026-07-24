const Lead = require('../models/Lead');

/**
 * @desc   Render Public Landing Page & Lead Capture Form
 * @route  GET /
 */
const renderLandingPage = (req, res) => {
  res.render('index', {
    pageTitle: 'LeadDesk Mini - Capture Better Leads. Manage Everything Easily.',
    activeNav: 'home',
  });
};

/**
 * @desc   Render Admin Dashboard Page
 * @route  GET /admin
 */
const renderAdminDashboard = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
    const closedLeads = await Lead.countDocuments({ status: 'Closed' });

    res.render('admin', {
      pageTitle: 'Admin Dashboard | LeadDesk Mini',
      activeNav: 'admin',
      leads,
      stats: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
        closed: closedLeads,
      },
    });
  } catch (error) {
    // If DB is offline, gracefully render admin with empty data
    res.render('admin', {
      pageTitle: 'Admin Dashboard | LeadDesk Mini',
      activeNav: 'admin',
      leads: [],
      stats: { total: 0, new: 0, contacted: 0, closed: 0 },
      dbError: 'Database connection offline or pending.',
    });
  }
};

module.exports = {
  renderLandingPage,
  renderAdminDashboard,
};
