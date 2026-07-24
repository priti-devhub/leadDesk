/**
 * LeadDesk Mini - Client-side Lead Form Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('public-lead-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-icon');
  
  const alertContainer = document.getElementById('form-alert');
  const alertIcon = document.getElementById('alert-icon');
  const alertMessage = document.getElementById('alert-message');

  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    budget: document.getElementById('budget'),
    message: document.getElementById('message'),
  };

  const errors = {
    name: document.getElementById('error-name'),
    email: document.getElementById('error-email'),
    budget: document.getElementById('error-budget'),
    message: document.getElementById('error-message'),
  };

  const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

  // Real-time clear on input
  Object.keys(fields).forEach((key) => {
    const input = fields[key];
    if (!input) return;

    input.addEventListener('input', () => {
      clearFieldError(key);
    });

    if (key === 'budget') {
      input.addEventListener('change', () => {
        clearFieldError(key);
      });
    }
  });

  // Client Validation Logic
  function validateForm() {
    let isValid = true;
    clearAllErrors();

    // Validate Name
    const nameVal = fields.name.value.trim();
    if (!nameVal) {
      showFieldError('name', 'Name is required');
      isValid = false;
    } else if (nameVal.length < 3) {
      showFieldError('name', 'Name must be at least 3 characters long');
      isValid = false;
    }

    // Validate Email
    const emailVal = fields.email.value.trim();
    if (!emailVal) {
      showFieldError('email', 'Email is required');
      isValid = false;
    } else if (!EMAIL_REGEX.test(emailVal)) {
      showFieldError('email', 'Please enter a valid email address');
      isValid = false;
    }

    // Validate Budget
    const budgetVal = fields.budget.value.trim();
    if (!budgetVal) {
      showFieldError('budget', 'Please select a budget range');
      isValid = false;
    }

    // Validate Message
    const messageVal = fields.message.value.trim();
    if (!messageVal) {
      showFieldError('message', 'Message is required');
      isValid = false;
    } else if (messageVal.length < 15) {
      showFieldError('message', 'Message must be at least 15 characters long');
      isValid = false;
    }

    return isValid;
  }

  function showFieldError(fieldKey, message) {
    if (fields[fieldKey]) {
      fields[fieldKey].classList.add('is-invalid');
    }
    if (errors[fieldKey]) {
      errors[fieldKey].textContent = message;
      errors[fieldKey].classList.remove('d-none');
    }
  }

  function clearFieldError(fieldKey) {
    if (fields[fieldKey]) {
      fields[fieldKey].classList.remove('is-invalid');
    }
    if (errors[fieldKey]) {
      errors[fieldKey].textContent = '';
      errors[fieldKey].classList.add('d-none');
    }
  }

  function clearAllErrors() {
    Object.keys(fields).forEach((key) => clearFieldError(key));
    hideAlert();
  }

  function showAlert(type, message) {
    alertContainer.className = `alert alert-${type} d-flex align-items-center rounded-3 mb-4`;
    alertIcon.className = type === 'success' ? 'bi bi-check-circle-fill fs-5 text-success' : 'bi bi-exclamation-triangle-fill fs-5 text-danger';
    alertMessage.textContent = message;
    alertContainer.classList.remove('d-none');
  }

  function hideAlert() {
    alertContainer.classList.add('d-none');
  }

  function setSubmittingState(isSubmitting) {
    if (isSubmitting) {
      submitBtn.disabled = true;
      btnSpinner.classList.remove('d-none');
      btnText.textContent = 'Submitting...';
      btnIcon.classList.add('d-none');
    } else {
      submitBtn.disabled = false;
      btnSpinner.classList.add('d-none');
      btnText.textContent = 'Submit Lead Details';
      btnIcon.classList.remove('d-none');
    }
  }

  // Handle Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert('danger', 'Please fix the errors in the form before submitting.');
      return;
    }

    setSubmittingState(true);
    hideAlert();

    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      budget: fields.budget.value.trim(),
      message: fields.message.value.trim(),
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Backend validation errors returned
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            showFieldError(key, result.errors[key]);
          });
        }
        showAlert('danger', result.message || 'Submission failed. Please check inputs.');
      } else {
        // Success
        showAlert('success', result.message || 'Lead submitted successfully!');
        form.reset();
      }
    } catch (err) {
      console.error('[Submit Lead Error]:', err);
      showAlert('danger', 'Network error. Could not submit lead. Please check server connection.');
    } finally {
      setSubmittingState(false);
    }
  });
});
