import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { AlertCircle, Calendar, Send, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DeadlineAlerts() {
  const { 
    dashboardStats, 
    openDetailsModal, 
    openReminderModal, 
    markAsReturned 
  } = useApp();

  const navigate = useNavigate();
  const upcoming = dashboardStats.upcomingDeadlines.slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#ecfdf5',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 10px'
        }}>
          <CheckCircle2 size={22} />
        </div>
        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          No Urgent Deadlines
        </h4>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
          All lent items are on schedule or safely returned!
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Upcoming Return Deadlines
          </h3>
        </div>
        <button
          type="button"
          className="btn-ghost"
          style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 500 }}
          onClick={() => navigate('/reminders')}
        >
          View all →
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {upcoming.map(item => (
          <div
            key={item.id}
            onClick={() => openDetailsModal(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-light)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
          >
            <div style={{ minWidth: 0, flex: 1, paddingRight: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ 
                  fontWeight: 600, 
                  fontSize: '13.5px', 
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.itemName}
                </span>
                <StatusBadge customStatus={item.statusInfo} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Borrowed by <strong>{item.friendName}</strong> • Due {formatDate(item.expectedReturnDate)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => openReminderModal(item)}
                title="Send polite reminder"
              >
                <Send size={13} />
                <span>Remind</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => markAsReturned(item.id)}
                title="Mark as returned"
              >
                <CheckCircle2 size={13} />
                <span>Return</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
