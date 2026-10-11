import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

export function PriorityBadge({ priority = 'Normal' }) {
  const getIcon = () => {
    switch (priority) {
      case 'Urgent':
        return <AlertCircle size={12} />;
      case 'Important':
        return <Clock size={12} />;
      default:
        return <CheckCircle size={12} />;
    }
  };

  return (
    <span className={`priority-chip ${priority}`}>
      {getIcon()}
      <span>{priority}</span>
    </span>
  );
}
