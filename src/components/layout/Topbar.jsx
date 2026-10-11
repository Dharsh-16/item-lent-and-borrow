import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  CheckCheck, 
  Clock, 
  AlertTriangle, 
  X,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

export function Topbar({ onMenuToggle }) {
  const { 
    theme, 
    toggleTheme, 
    openGlobalSearch, 
    dashboardStats, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    snoozeNotification,
    openDetailsModal,
    items
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close notification popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  const activeNotifs = dashboardStats.activeNotifications || [];
  const unreadCount = dashboardStats.unreadNotificationCount || 0;

  return (
    <header style={{
      height: 'var(--topbar-height)',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Global Search trigger bar */}
      <div style={{ flex: 1, maxWidth: '420px' }}>
        <button
          type="button"
          onClick={openGlobalSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '7px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '13px',
            textAlign: 'left',
            transition: 'border-color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
        >
          <Search size={15} color="var(--text-muted)" />
          <span style={{ flex: 1 }}>Search items, friends, or categories...</span>
          <kbd style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 5px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)'
          }}>
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions: Theme Toggle, Notifications, User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Theme Toggle Button */}
        <button
          type="button"
          className="btn-icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="btn-icon"
            onClick={() => setIsNotifOpen(prev => !prev)}
            aria-label="View notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 0 2px var(--bg-surface)'
              }} />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '360px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 100,
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease'
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span style={{
                      fontSize: '11px',
                      backgroundColor: '#fee2e2',
                      color: '#ef4444',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 600
                    }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ fontSize: '11.5px', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={markAllNotificationsAsRead}
                  >
                    <CheckCheck size={13} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {activeNotifs.length === 0 ? (
                  <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No alerts right now. All items are on schedule! ✨
                  </div>
                ) : (
                  activeNotifs.slice(0, 6).map(notif => {
                    const isOverdue = notif.type === 'overdue';
                    const isDueToday = notif.type === 'due_today';

                    return (
                      <div
                        key={notif.id}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--border-light)',
                          backgroundColor: notif.isRead ? 'transparent' : 'var(--primary-light)',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <div style={{
                            marginTop: '2px',
                            color: isOverdue ? '#ef4444' : isDueToday ? '#f59e0b' : 'var(--primary)',
                            flexShrink: 0
                          }}>
                            {isOverdue ? <AlertTriangle size={16} /> : <Clock size={16} />}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ 
                              fontSize: '12.5px', 
                              fontWeight: notif.isRead ? 500 : 600, 
                              color: 'var(--text-primary)',
                              marginBottom: '2px'
                            }}>
                              {notif.title}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '6px' }}>
                              {notif.message}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {formatRelativeTime(notif.timestamp)}
                              </span>

                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  type="button"
                                  className="btn-ghost"
                                  style={{ fontSize: '11px', padding: '2px 6px' }}
                                  onClick={() => snoozeNotification(notif.id, 1)}
                                  title="Snooze for 1 day"
                                >
                                  Snooze 1d
                                </button>
                                
                                {notif.itemId && (
                                  <button
                                    type="button"
                                    className="btn-ghost"
                                    style={{ fontSize: '11px', padding: '2px 6px', color: 'var(--primary)', fontWeight: 600 }}
                                    onClick={() => {
                                      setIsNotifOpen(false);
                                      const found = items.find(i => i.id === notif.itemId);
                                      if (found) openDetailsModal(found);
                                    }}
                                  >
                                    View Item
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{
                padding: '8px 12px',
                borderTop: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                textAlign: 'center'
              }}>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ fontSize: '12px', width: '100%', color: 'var(--primary)', fontWeight: 500 }}
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigate('/reminders');
                  }}
                >
                  Open Reminder Center →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
