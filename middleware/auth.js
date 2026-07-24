/**
 * Authentication Middleware for LeadDesk Mini
 * Protects admin routes, disables caching on sensitive pages, and manages session locals
 */

const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    // Disable browser caching for protected admin pages to prevent back-button access after logout
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    return next();
  }

  // Handle API unauthorized request vs Page redirect
  if (req.originalUrl.startsWith('/api')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Please log in as Admin.',
    });
  }

  return res.redirect('/login');
};

const attachAuthLocals = (req, res, next) => {
  res.locals.isAuthenticated = !!(req.session && req.session.isAdmin);
  next();
};

module.exports = {
  requireAuth,
  attachAuthLocals,
};
