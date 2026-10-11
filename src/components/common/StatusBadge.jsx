import React from 'react';
import { calculateItemStatus } from '../../utils/dateUtils';

export function StatusBadge({ item, customStatus, showDays = true }) {
  const status = customStatus || (item ? calculateItemStatus(item) : { key: 'active', label: 'Active', badgeText: 'Active' });

  return (
    <span className={`status-badge ${status.key}`}>
      <span className="status-dot" />
      <span>{showDays ? status.badgeText : status.label}</span>
    </span>
  );
}
