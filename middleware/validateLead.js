const { validateLeadData } = require('../utils/validation');

const validateLeadMiddleware = (req, res, next) => {
  const { isValid, errors } = validateLeadData(req.body);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct input errors.',
      errors,
    });
  }

  next();
};

module.exports = validateLeadMiddleware;
