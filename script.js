/**
 * Contact Form - Form validation and submission logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('success-toast');
  let toastTimeout = null;

  // Field validation rules
  const fields = [
    {
      id: 'first-name',
      errorId: 'first-name-error',
      validate: (val) => val.trim() !== '',
      errorMessage: 'This field is required',
    },
    {
      id: 'last-name',
      errorId: 'last-name-error',
      validate: (val) => val.trim() !== '',
      errorMessage: 'This field is required',
    },
    {
      id: 'email',
      errorId: 'email-error',
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      errorMessage: 'Please enter a valid email address',
    },
    {
      id: 'message',
      errorId: 'message-error',
      validate: (val) => val.trim() !== '',
      errorMessage: 'This field is required',
    },
  ];

  const queryRadios = document.querySelectorAll('input[name="query-type"]');
  const queryError = document.getElementById('query-type-error');
  const consentCheckbox = document.getElementById('consent');
  const consentError = document.getElementById('consent-error');

  /**
   * Show error state for an input field
   */
  function showError(inputEl, errorEl) {
    inputEl.classList.add('border-red', 'focus:ring-red/30');
    inputEl.classList.remove('border-grey-500');
    inputEl.setAttribute('aria-invalid', 'true');
    errorEl.classList.remove('hidden');
  }

  /**
   * Clear error state for an input field
   */
  function clearError(inputEl, errorEl) {
    inputEl.classList.remove('border-red', 'focus:ring-red/30');
    inputEl.classList.add('border-grey-500');
    inputEl.setAttribute('aria-invalid', 'false');
    errorEl.classList.add('hidden');
  }

  /**
   * Validate a single field and show/clear error
   */
  function validateField(field) {
    const input = document.getElementById(field.id);
    const error = document.getElementById(field.errorId);
    if (field.validate(input.value)) {
      clearError(input, error);
      return true;
    } else {
      showError(input, error);
      return false;
    }
  }

  /**
   * Validate all form fields and return whether the form is valid
   */
  function validateForm() {
    let isValid = true;

    // Validate text/email fields
    fields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Validate query type (radio group)
    const querySelected = document.querySelector('input[name="query-type"]:checked');
    if (!querySelected) {
      queryError.classList.remove('hidden');
      isValid = false;
    } else {
      queryError.classList.add('hidden');
    }

    // Validate consent (checkbox)
    if (!consentCheckbox.checked) {
      consentError.classList.remove('hidden');
      isValid = false;
    } else {
      consentError.classList.add('hidden');
    }

    return isValid;
  }

  /**
   * Collect form data into an object
   */
  function getFormData() {
    return {
      firstName: document.getElementById('first-name').value.trim(),
      lastName: document.getElementById('last-name').value.trim(),
      email: document.getElementById('email').value.trim(),
      queryType: document.querySelector('input[name="query-type"]:checked')?.value || '',
      message: document.getElementById('message').value.trim(),
      consent: consentCheckbox.checked,
    };
  }

  /**
   * Show the success toast notification
   */
  function showToast() {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toast.classList.remove('hidden', 'toast-exit');
    toast.classList.add('toast-enter');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-exit');
      setTimeout(() => {
        toast.classList.add('hidden');
        toast.classList.remove('toast-exit');
      }, 300);
    }, 4000);
  }

  /**
   * Reset the form to its initial state
   */
  function resetForm() {
    form.reset();

    // Clear all error states
    document.querySelectorAll('.border-red').forEach((el) => {
      el.classList.remove('border-red', 'focus:ring-red/30');
      el.classList.add('border-grey-500');
      el.setAttribute('aria-invalid', 'false');
    });

    document.querySelectorAll('[role="alert"]').forEach((el) => {
      el.classList.add('hidden');
    });
  }

  // ── Event Listeners ──────────────────────────────────────────────

  // Real-time validation on blur for text/email fields
  fields.forEach((field) => {
    const input = document.getElementById(field.id);
    const error = document.getElementById(field.errorId);

    input.addEventListener('blur', () => {
      // For email, allow empty on blur (don't show error until submit or typing)
      if (field.id === 'email' && input.value.trim() === '') {
        clearError(input, error);
        return;
      }
      if (field.validate(input.value)) {
        clearError(input, error);
      } else {
        showError(input, error);
      }
    });

    input.addEventListener('input', () => {
      if (field.validate(input.value)) {
        clearError(input, error);
      }
    });
  });

  // Query type radio: clear error on selection
  queryRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      queryError.classList.add('hidden');
    });
  });

  // Consent checkbox: clear error on check
  consentCheckbox.addEventListener('change', () => {
    if (consentCheckbox.checked) {
      consentError.classList.add('hidden');
    }
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = getFormData();
      console.log('Form submitted successfully:', formData);

      // Here you would typically send the data to a server:
      // fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData), headers: { 'Content-Type': 'application/json' } })

      showToast();
      resetForm();
    } else {
      // Focus the first invalid field
      const firstError = document.querySelector('.border-red');
      if (firstError) {
        firstError.focus();
      }
    }
  });
});