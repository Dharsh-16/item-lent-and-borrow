import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCheck, 
  Send, 
  MessageSquare, 
  Copy, 
  Check, 
  CheckCircle2, 
  Info,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { formatDate, calculateItemStatus } from '../utils/dateUtils';
import { generateReminderMessage } from '../utils/reminderTemplates';
import { EmptyState } from '../components/common/EmptyState';

export function Reminders() {
  const { 
    dashboardStats, 
    openReminderModal, 
    markAsReturned, 
    openDetailsModal, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    snoozeNotification,
    showToast,
    userProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState('overdue'); // 'overdue' | 'duetoday' | 'duesoon' | 'allalerts'

  const overdueList = dashboardStats.overdueItems;
  const dueTodayList = dashboardStats.dueTodayItems;
  const dueSoonList = dashboardStats.dueSoonItems;
  const allAlerts = dashboardStats.activeNotifications;

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Smart Reminder Center
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Track overdue and upcoming deadlines for both lent and borrowed items. Copy quick messages or send courteous nudges.
          </p>
        </div>

        {dashboardStats.unreadNotificationCount > 0 && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={markAllNotificationsAsRead}
          >
            <CheckCheck size={16} />
            <span>Mark All Notifications Read</span>
          </button>
        )}
      </div>

      {/* Info notice explaining reminder mechanism */}
      <div style={{
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--primary-light)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '24px',
        fontSize: '13px',
        color: 'var(--text-secondary)'
      }}>
        <Info size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Bidirectional Reminders:</strong> For items you have lent out, generate respectful nudges for your friends. For items you have borrowed, generate return reminders for yourself so you always return items on time.
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('overdue')}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'overdue' ? '2px solid #ef4444' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'overdue' ? '#ef4444' : 'var(--text-secondary)',
            fontWeight: activeTab === 'overdue' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertTriangle size={15} />
          <span>Overdue Items</span>
          <span style={{
            fontSize: '11px',
            padding: '1px 6px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: overdueList.length > 0 ? '#fee2e2' : 'var(--bg-subtle)',
            color: overdueList.length > 0 ? '#ef4444' : 'var(--text-muted)',
            fontWeight: 700
          }}>
            {overdueList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('duetoday')}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'duetoday' ? '2px solid #f59e0b' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'duetoday' ? '#f59e0b' : 'var(--text-secondary)',
            fontWeight: activeTab === 'duetoday' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Clock size={15} />
          <span>Due Today</span>
          <span style={{
            fontSize: '11px',
            padding: '1px 6px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: dueTodayList.length > 0 ? '#fef3c7' : 'var(--bg-subtle)',
            color: dueTodayList.length > 0 ? '#d97706' : 'var(--text-muted)',
            fontWeight: 700
          }}>
            {dueTodayList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('duesoon')}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'duesoon' ? '2px solid var(--primary)' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'duesoon' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'duesoon' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Bell size={15} />
          <span>Due Soon (≤ 3 Days)</span>
          <span style={{
            fontSize: '11px',
            padding: '1px 6px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            fontWeight: 700
          }}>
            {dueSoonList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('allalerts')}
          style={{
            padding: '10px 16px',
            border: 'none',
            borderBottom: activeTab === 'allalerts' ? '2px solid var(--text-primary)' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'allalerts' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'allalerts' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <MessageSquare size={15} />
          <span>System Alerts History</span>
          <span style={{
            fontSize: '11px',
            padding: '1px 6px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            fontWeight: 700
          }}>
            {allAlerts.length}
          </span>
        </button>
      </div>

      {/* Overdue Tab */}
      {activeTab === 'overdue' && (
        overdueList.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Awesome! No Overdue Items"
            description="All your lent items and borrowed items are on schedule."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {overdueList.map(item => (
              <ReminderItemCard
                key={item.id}
                item={item}
                userName={userProfile?.name}
                onRemind={() => openReminderModal(item)}
                onReturn={() => markAsReturned(item.id)}
                onView={() => openDetailsModal(item)}
                showToast={showToast}
              />
            ))}
          </div>
        )
      )}

      {/* Due Today Tab */}
      {activeTab === 'duetoday' && (
        dueTodayList.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No Items Due Today"
            description="Nothing is scheduled for return today. Check upcoming deadlines in Due Soon."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {dueTodayList.map(item => (
              <ReminderItemCard
                key={item.id}
                item={item}
                userName={userProfile?.name}
                onRemind={() => openReminderModal(item)}
                onReturn={() => markAsReturned(item.id)}
                onView={() => openDetailsModal(item)}
                showToast={showToast}
              />
            ))}
          </div>
        )
      )}

      {/* Due Soon Tab */}
      {activeTab === 'duesoon' && (
        dueSoonList.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No Items Due in Next 3 Days"
            description="All active items have plenty of time before their deadlines."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {dueSoonList.map(item => (
              <ReminderItemCard
                key={item.id}
                item={item}
                userName={userProfile?.name}
                onRemind={() => openReminderModal(item)}
                onReturn={() => markAsReturned(item.id)}
                onView={() => openDetailsModal(item)}
                showToast={showToast}
              />
            ))}
          </div>
        )
      )}

      {/* System Alerts History Tab */}
      {activeTab === 'allalerts' && (
        allAlerts.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No Active Alerts"
            description="System notifications generated for return deadlines will be listed here."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allAlerts.map(notif => (
              <div
                key={notif.id}
                className="card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderLeft: notif.type === 'overdue' ? '4px solid #ef4444' : notif.type === 'due_today' ? '4px solid #f59e0b' : '4px solid var(--primary)',
                  backgroundColor: notif.isRead ? 'var(--bg-surface)' : 'var(--primary-light)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {notif.title}
                    </span>
                    {notif.direction && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: notif.direction === 'lent' ? 'var(--primary-light)' : 'rgba(14, 165, 233, 0.1)',
                        color: notif.direction === 'lent' ? 'var(--primary)' : '#0ea5e9'
                      }}>
                        {notif.direction === 'lent' ? "Lent" : "Borrowed"}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {notif.message}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => snoozeNotification(notif.id, 1)}
                  >
                    Snooze 24h
                  </button>
                  {!notif.isRead && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => markNotificationAsRead(notif.id)}
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

function ReminderItemCard({ item, userName, onRemind, onReturn, onView, showToast }) {
  const status = calculateItemStatus(item);
  const isLent = (item.type || 'lent') === 'lent';
  const [copied, setCopied] = useState(false);

  const quickMessage = generateReminderMessage({
    tone: 'polite',
    friendName: item.friendName,
    itemName: item.itemName,
    expectedDate: formatDate(item.expectedReturnDate),
    status: status.key,
    daysDiff: status.daysDiff,
    userName: userName || 'I',
    type: item.type || 'lent'
  });

  const handleCopyQuick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(quickMessage).then(() => {
      setCopied(true);
      showToast({ message: 'Reminder message copied to clipboard!', type: 'success' });
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      showToast({ message: 'Failed to copy to clipboard', type: 'error' });
    });
  };

  return (
    <div
      className="card"
      style={{
        padding: '18px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        cursor: 'pointer',
        borderLeft: isLent ? '4px solid var(--primary)' : '4px solid #0ea5e9'
      }}
      onClick={onView}
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', minWidth: '260px', flex: 1 }}>
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt=""
            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: isLent ? 'var(--primary-light)' : 'rgba(14, 165, 233, 0.1)',
              color: isLent ? 'var(--primary)' : '#0ea5e9',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              {isLent ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
              <span>{isLent ? "I've Lent" : "I've Borrowed"}</span>
            </span>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {item.itemName}
            </span>
            <StatusBadge customStatus={status} />
            <PriorityBadge priority={item.priority} />
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            {isLent ? "Borrower:" : "Owner:"} <strong>{item.friendName}</strong>{' '}
            {item.contact ? `• ${item.contact}` : ''} • Due: <strong>{formatDate(item.expectedReturnDate)}</strong>
          </div>

          {/* Quick reminder text teaser */}
          <div style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-subtle)',
            padding: '5px 8px',
            borderRadius: '4px',
            marginTop: '6px',
            fontStyle: 'italic',
            maxWidth: '540px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            "{quickMessage}"
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleCopyQuick}
          title="Copy ready reminder message"
        >
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy Message'}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onRemind}
          title={isLent ? "Open full reminder composer" : "View return note composer"}
        >
          <Send size={14} color="var(--primary)" />
          <span>{isLent ? 'Remind' : 'Reminder'}</span>
        </button>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onReturn}
          title={isLent ? "Mark item returned by friend" : "Mark item returned to owner"}
        >
          <CheckCircle2 size={14} />
          <span>{isLent ? 'Mark Returned' : 'Return to Owner'}</span>
        </button>
      </div>
    </div>
  );
}
