/**
 * Date utility functions for ReturnReminder
 */

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds or subtracts days from a reference date and returns YYYY-MM-DD
 */
export function addDays(dateStrOrObj, days) {
  const d = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj + 'T00:00:00') : new Date(dateStrOrObj);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats YYYY-MM-DD to friendly human string, e.g. "Oct 15, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString + 'T00:00:00');
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Returns difference in calendar days between expectedReturnDate and today.
 * Positive = future, 0 = today, Negative = past (overdue).
 */
export function getDaysDifference(targetDateStr) {
  if (!targetDateStr) return 0;
  const todayStr = getTodayString();
  const today = new Date(todayStr + 'T00:00:00');
  const target = new Date(targetDateStr + 'T00:00:00');
  
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Computes dynamic status of an item.
 * Never relies on manual status string.
 */
export function calculateItemStatus(item) {
  if (!item) {
    return { key: 'active', label: 'Active', variant: 'info', daysDiff: 0 };
  }

  if (item.dateReturned) {
    return {
      key: 'returned',
      label: 'Returned',
      variant: 'success',
      daysDiff: 0,
      badgeText: 'Returned'
    };
  }

  const daysDiff = getDaysDifference(item.expectedReturnDate);

  if (daysDiff < 0) {
    const absDays = Math.abs(daysDiff);
    return {
      key: 'overdue',
      label: 'Overdue',
      variant: 'danger',
      daysDiff,
      badgeText: `${absDays}d overdue`
    };
  }

  if (daysDiff === 0) {
    return {
      key: 'due-today',
      label: 'Due Today',
      variant: 'warning',
      daysDiff: 0,
      badgeText: 'Due today'
    };
  }

  if (daysDiff <= 3) {
    return {
      key: 'due-soon',
      label: 'Due Soon',
      variant: 'caution',
      daysDiff,
      badgeText: `In ${daysDiff} ${daysDiff === 1 ? 'day' : 'days'}`
    };
  }

  return {
    key: 'active',
    label: 'Active',
    variant: 'neutral',
    daysDiff,
    badgeText: `In ${daysDiff} days`
  };
}

/**
 * Converts ISO timestamp or date to relative time, e.g. "Just now", "2 hours ago", "Yesterday"
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSec = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSec < 60) return 'Just now';
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `${diffInMin}m ago`;
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(dateString.slice(0, 10));
}
