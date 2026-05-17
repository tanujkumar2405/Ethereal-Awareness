/*
 * EtherealAwareness.com - Form validation and interactions
 * Ensures form data is valid before sending or acknowledging submission.
 */

(function () {
  'use strict';

  const form = document.querySelector('#contact-form');
  const fields = form ? Array.from(form.querySelectorAll('[data-required]')) : [];

  function createError(field, message) {
    const error = field.parentElement.querySelector('.error-message');
    if (error) {
      error.textContent = message;
      error.style.display = 'block';
    }
    field.classList.add('error');
    field.classList.remove('success');
  }

  function clearError(field) {
    const error = field.parentElement.querySelector('.error-message');
    if (error) {
      error.textContent = '';
      error.style.display = 'none';
    }
    field.classList.remove('error');
    field.classList.add('success');
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    let isValid = true;

    fields.forEach(field => {
      const value = field.value.trim();
      const name = field.name || field.id;

      if (!value) {
        createError(field, `Please enter your ${name.replace(/[-_]/g, ' ')}.`);
        isValid = false;
        return;
      }

      if (field.type === 'email' && !validateEmail(value)) {
        createError(field, 'Enter a valid email address.');
        isValid = false;
        return;
      }

      if (field.tagName.toLowerCase() === 'textarea' && value.length < 20) {
        createError(field, 'Please provide a more detailed message.');
        isValid = false;
        return;
      }

      clearError(field);
    });

    return isValid;
  }

  function createMailToLink(data) {
    const subject = `Ethereal Awareness inquiry: ${data.subject}`;
    const body = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
    return `mailto:ethereal.awareness11@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const formData = {
      name: form.querySelector('#name').value.trim(),
      email: form.querySelector('#email').value.trim(),
      subject: form.querySelector('#subject').value.trim(),
      message: form.querySelector('#message').value.trim(),
    };

    const successMessage = form.querySelector('.success-message');
    if (successMessage) {
      successMessage.textContent = 'Your message is ready and your email client will open. If it does not, contact us directly at ethereal.awareness11@gmail.com.';
      successMessage.style.display = 'block';
    }

    const mailToLink = createMailToLink(formData);
    window.location.href = mailToLink;

    form.reset();
    fields.forEach(field => field.classList.remove('success'));
  }

  function init() {
    if (!form) return;
    form.addEventListener('submit', handleSubmit);

    fields.forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error', 'success');
        const error = field.parentElement.querySelector('.error-message');
        if (error) {
          error.textContent = '';
          error.style.display = 'none';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();