document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded');
});

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
