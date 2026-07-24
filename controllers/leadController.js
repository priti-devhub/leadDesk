const Lead = require('../models/Lead');

/**
 * @desc   Create new Lead
 * @route  POST /api/leads
 * @access Public
 */
const createLead = async (req, res, next) => {
  try {
    const { name, email, budget, message } = req.body;

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      budget: budget.trim(),
      message: message.trim(),
      status: 'New',
    });

    return res.status(201).json({
      success: true,
      message: 'Lead captured successfully! Thank you for reaching out.',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all leads with optional search filtering
 * @route  GET /api/leads
 * @access Public/Admin
 */
const getLeads = async (req, res, next) => {
  try {
    const search = req.query.search || req.query.q || '';
    let query = {};

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query = {
        $or: [
          { name: regex },
          { email: regex },
          { budget: regex },
          { message: regex },
          { status: regex },
        ],
      };
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    // Calculate metrics
    const totalCount = await Lead.countDocuments();
    const newCount = await Lead.countDocuments({ status: 'New' });
    const contactedCount = await Lead.countDocuments({ status: 'Contacted' });
    const closedCount = await Lead.countDocuments({ status: 'Closed' });

    return res.status(200).json({
      success: true,
      count: leads.length,
      stats: {
        total: totalCount,
        new: newCount,
        contacted: contactedCount,
        closed: closedCount,
      },
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update Lead status
 * @route  PATCH /api/leads/:id/status
 * @access Admin
 */
const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Contacted', 'Closed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    lead.status = status;
    await lead.save();

    // Recalculate stats for live response update
    const totalCount = await Lead.countDocuments();
    const newCount = await Lead.countDocuments({ status: 'New' });
    const contactedCount = await Lead.countDocuments({ status: 'Contacted' });
    const closedCount = await Lead.countDocuments({ status: 'Closed' });

    return res.status(200).json({
      success: true,
      message: `Lead status updated to ${status}`,
      stats: {
        total: totalCount,
        new: newCount,
        contacted: contactedCount,
        closed: closedCount,
      },
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
};
