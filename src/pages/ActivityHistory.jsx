import React, { useState, useMemo } from 'react';
import { 
  History, 
  PlusCircle, 
  Edit3, 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  Trash2, 
  RotateCw, 
  Trash,
  Filter,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRelativeTime, formatDate } from '../utils/dateUtils';
import { EmptyState } from '../components/common/EmptyState';

export function ActivityHistory() {
  const { activities, clearActivityHistory, openConfirmDialog } = useApp();
  const [filterType, setFilterType] = useState('all');

  const filteredActivities = useMemo(() => {
    if (filterType === 'all') return activities;
    return activities.filter(a => {
      if (filterType === 'created') return a.type === 'item_created';
      if (filterType === 'returned') return a.type === 'item_returned';
      if (filterType === 'reminders') return a.type === 'reminder_sent';
      if (filterType === 'updated') return a.type === 'item_updated' || a.type === 'item_reopened';
      if (filterType === 'deleted') return a.type === 'item_deleted' || a.type === 'item_restored';
      if (filterType === 'friends') return a.type.startsWith('friend_');
      return true;
    });
  }, [activities, filterType]);

  const handleClearHistory = () => {
    openConfirmDialog({
      title: 'Clear Activity History?',
      message: 'Are you sure you want to delete all activity logs? Your items will remain untouched.',
      confirmText: 'Clear History',
      isDanger: true,
      onConfirm: clearActivityHistory
    });
  };

  const getActionBadge = (type) => {
    switch (type) {
      case 'item_created':
        return {
          icon: PlusCircle,
          color: 'var(--primary)',
          bg: 'var(--primary-light)',
          label: 'Added'
        };
      case 'item_returned':
        return {
          icon: CheckCircle2,
          color: '#10b981',
          bg: '#ecfdf5',
          label: 'Returned'
        };
      case 'reminder_sent':
        return {
          icon: Send,
          color: 'var(--accent-violet)',
          bg: 'rgba(139, 92, 246, 0.1)',
          label: 'Reminder'
        };
      case 'item_updated':
        return {
          icon: Edit3,
          color: '#0ea5e9',
          bg: '#f0f9ff',
          label: 'Edited'
        };
      case 'item_reopened':
        return {
          icon: RotateCcw,
          color: '#f59e0b',
          bg: '#fffbeb',
          label: 'Reopened'
        };
      case 'friend_added':
        return {
          icon: Users,
          color: 'var(--accent-violet)',
          bg: 'rgba(139, 92, 246, 0.1)',
          label: 'Friend Added'
        };
      case 'friend_updated':
        return {
          icon: Edit3,
          color: 'var(--accent-violet)',
          bg: 'rgba(139, 92, 246, 0.1)',
          label: 'Friend Updated'
        };
      case 'friend_deleted':
        return {
          icon: Trash2,
          color: '#ef4444',
          bg: '#fef2f2',
          label: 'Friend Removed'
        };
      case 'item_deleted':
        return {
          icon: Trash2,
          color: '#ef4444',
          bg: '#fef2f2',
          label: 'Deleted'
        };
      case 'item_restored':
        return {
          icon: RotateCw,
          color: '#10b981',
          bg: '#ecfdf5',
          label: 'Restored'
        };
      default:
        return {
          icon: History,
          color: 'var(--text-secondary)',
          bg: 'var(--bg-subtle)',
          label: 'Activity'
        };
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Activity Log
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Chronological audit trail of all items recorded, reminders drafted, returns, edits, and friends managed.
          </p>
        </div>

        {activities && activities.length > 0 && (
          <button
            type="button"
            className="btn btn-danger-ghost btn-sm"
            onClick={handleClearHistory}
          >
            <Trash size={15} />
            <span>Clear Activity Log</span>
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'all', label: 'All Activities' },
          { id: 'created', label: 'Item Created' },
          { id: 'returned', label: 'Returned' },
          { id: 'reminders', label: 'Reminders Sent' },
          { id: 'updated', label: 'Edits & Reopens' },
          { id: 'friends', label: 'Friends' },
          { id: 'deleted', label: 'Deletions' },
        ].map(chip => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilterType(chip.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${filterType === chip.id ? 'var(--primary)' : 'var(--border-subtle)'}`,
              backgroundColor: filterType === chip.id ? 'var(--primary-light)' : 'var(--bg-surface)',
              color: filterType === chip.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: filterType === chip.id ? 600 : 500,
              fontSize: '12.5px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Activities Timeline */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          icon={History}
          title="No activities found"
          description="Activities such as recording items, updating details, drafting reminders, and returning items will appear here."
        />
      ) : (
        <div className="card" style={{ padding: '8px 20px' }}>
          {filteredActivities.map((act, index) => {
            const badge = getActionBadge(act.type);
            const Icon = badge.icon;
            const isLast = index === filteredActivities.length - 1;

            return (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px 0',
                  borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
                  alignItems: 'flex-start'
                }}
              >
                {/* Icon Circle */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: badge.bg,
                  color: badge.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor: badge.bg,
                      color: badge.color
                    }}>
                      {badge.label}
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {act.itemName}
                    </span>
                    {act.friendName && (
                      <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                        ({act.friendName})
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '2px 0 4px' }}>
                    {act.details}
                  </p>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {formatRelativeTime(act.timestamp)} • {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
