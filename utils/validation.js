const ALLOWED_BUDGETS = ['₹5k–10k', '₹10k–25k', '₹25k–50k', '₹50k+'];
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

/**
 * Validates lead submission payload
 * @param {Object} data 
 * @returns {Object} { isValid, errors }
 */
const validateLeadData = (data = {}) => {
  const errors = {};
  const { name, email, budget, message } = data;

  // Name validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters long';
  }

  // Email validation
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  // Budget validation
  if (!budget || typeof budget !== 'string' || !budget.trim()) {
    errors.budget = 'Budget range selection is required';
  } else if (!ALLOWED_BUDGETS.includes(budget.trim())) {
    errors.budget = `Budget must be one of: ${ALLOWED_BUDGETS.join(', ')}`;
  }

  // Message validation
  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.message = 'Message is required';
  } else if (message.trim().length < 15) {
    errors.message = 'Message must be at least 15 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateLeadData,
  ALLOWED_BUDGETS,
};
