// Main JavaScript for Project Management System

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Bootstrap form validation
  initializeFormValidation();
});

/**
 * Initialize Bootstrap form validation
 */
function initializeFormValidation() {
  const forms = document.querySelectorAll('form:not(.no-validate)');
  
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date) {
  if (typeof date === 'string') {
    return date.substring(0, 10);
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.setAttribute('role', 'alert');
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  const container = document.querySelector('main') || document.body;
  container.insertBefore(alertDiv, container.firstChild);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    const bsAlert = new bootstrap.Alert(alertDiv);
    bsAlert.close();
  }, 5000);
}

/**
 * Confirm dialog wrapper
 */
function confirmAction(message) {
  return confirm(message);
}

/**
 * Enable/disable form inputs
 */
function toggleFormInputs(formId, disabled) {
  const form = document.getElementById(formId);
  if (form) {
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => {
      if (input.type !== 'submit') {
        input.disabled = disabled;
      }
    });
  }
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate date is not in the past
 */
function isDateInFuture(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

/**
 * Format deadline status
 */
function getDeadlineStatus(deadline) {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (deadlineDate < today) {
    return { status: 'overdue', text: 'Overdue', badgeClass: 'bg-danger' };
  } else if (deadlineDate.toDateString() === today.toDateString()) {
    return { status: 'today', text: 'Due Today', badgeClass: 'bg-warning' };
  } else {
    const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    return { status: 'pending', text: `${daysLeft} days left`, badgeClass: 'bg-info' };
  }
}

/**
 * Parse comma-separated team members
 */
function parseTeamMembers(teamMembersString) {
  if (!teamMembersString) return [];
  return teamMembersString
    .split(',')
    .map(member => member.trim())
    .filter(member => member.length > 0);
}

/**
 * Validate form before submission
 */
function validateProjectForm() {
  const projectName = document.getElementById('projectName')?.value;
  const description = document.getElementById('description')?.value;
  const deadline = document.getElementById('deadline')?.value;
  const status = document.getElementById('status')?.value;
  
  const errors = [];
  
  if (!projectName || projectName.trim() === '') {
    errors.push('Project name is required');
  }
  
  if (!description || description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (!deadline || deadline === '') {
    errors.push('Deadline is required');
  } else if (!isDateInFuture(deadline)) {
    errors.push('Deadline must be in the future');
  }
  
  if (!status || status === '') {
    errors.push('Status is required');
  }
  
  return { valid: errors.length === 0, errors };
}
