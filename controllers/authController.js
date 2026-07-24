/**
 * Authentication Controller for LeadDesk Mini Admin
 */

/**
 * @desc   Render Admin Login Page
 * @route  GET /login
 */
const renderLoginPage = (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin');
  }

  // Prevent caching of login page
  res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate');
  
  res.render('login', {
    pageTitle: 'Admin Login | LeadDesk Mini',
    activeNav: 'login',
    errorMessage: null,
    email: '',
  });
};

/**
 * @desc   Handle Admin Login Submission
 * @route  POST /login
 */
const handleLogin = (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin');
  }

  const { email, password } = req.body;

  const trimmedEmail = (email || '').trim();
  const trimmedPassword = (password || '').trim();

  // Field validation
  if (!trimmedEmail || !trimmedPassword) {
    return res.status(400).render('login', {
      pageTitle: 'Admin Login | LeadDesk Mini',
      activeNav: 'login',
      errorMessage: 'Both Email and Password are required to sign in.',
      email: trimmedEmail,
    });
  }

  const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@leaddesk.com').trim();
  const expectedPassword = (process.env.ADMIN_PASSWORD || 'AdminPass123!').trim();

  // Credentials verification
  if (
    trimmedEmail.toLowerCase() !== expectedEmail.toLowerCase() ||
    trimmedPassword !== expectedPassword
  ) {
    return res.status(401).render('login', {
      pageTitle: 'Admin Login | LeadDesk Mini',
      activeNav: 'login',
      errorMessage: 'Invalid admin credentials. Access denied.',
      email: trimmedEmail,
    });
  }

  // Create secure session
  req.session.isAdmin = true;

  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).render('login', {
        pageTitle: 'Admin Login | LeadDesk Mini',
        activeNav: 'login',
        errorMessage: 'An error occurred during session initialization.',
        email: trimmedEmail,
      });
    }
    res.redirect('/admin');
  });
};

/**
 * @desc   Handle Admin Logout
 * @route  GET /logout, POST /logout
 */
const handleLogout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.clearCookie('leaddesk.sid');
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  } else {
    res.clearCookie('leaddesk.sid');
    res.clearCookie('connect.sid');
    res.redirect('/login');
  }
};

module.exports = {
  renderLoginPage,
  handleLogin,
  handleLogout,
};
