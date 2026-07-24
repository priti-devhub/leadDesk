// 404 Not Found Middleware
const notFoundHandler = (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint ${req.originalUrl} not found`,
    });
  }
  res.status(404).render('404', {
    pageTitle: '404 - Page Not Found | LeadDesk Mini',
    url: req.originalUrl,
  });
};

// Centralized Error Handler Middleware
const globalErrorHandler = (err, req, res, next) => {
  console.error('[Unhandled Error]:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (req.originalUrl.startsWith('/api')) {
    return res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  res.status(statusCode).render('500', {
    pageTitle: '500 - Server Error | LeadDesk Mini',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on our servers.',
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
