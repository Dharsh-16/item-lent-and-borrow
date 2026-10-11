import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Bell, 
  Users, 
  BarChart3, 
  History, 
  Settings, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { dashboardStats, friendsSummary, openAddModal, userProfile } = useApp();
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { 
      to: '/items/lent', 
      label: "Items I've Lent", 
      icon: ArrowUpRight, 
      badge: dashboardStats.activeLent > 0 ? dashboardStats.activeLent : null,
      badgeColor: 'var(--primary)',
      accentClass: 'lent-link'
    },
    { 
      to: '/items/borrowed', 
      label: "Items I've Borrowed", 
      icon: ArrowDownLeft, 
      badge: dashboardStats.activeBorrowed > 0 ? dashboardStats.activeBorrowed : null,
      badgeColor: '#0ea5e9',
      accentClass: 'borrowed-link'
    },
    { 
      to: '/reminders', 
      label: 'Reminders', 
      icon: Bell, 
      badge: dashboardStats.overdueCount > 0 ? dashboardStats.overdueCount : (dashboardStats.dueTodayCount > 0 ? '!' : null),
      badgeColor: '#ef4444'
    },
    { 
      to: '/friends', 
      label: 'Friends', 
      icon: Users,
      badge: friendsSummary?.length > 0 ? friendsSummary.length : null,
      badgeColor: 'var(--accent-violet)'
    },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/activity', label: 'Activity Log', icon: History },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden'
      }}
    >
      {/* Brand Header */}
      <div style={{
        height: 'var(--topbar-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '0 12px' : '0 20px',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px var(--primary-glow)',
            flexShrink: 0
          }}>
            <ShieldCheck size={20} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ 
                fontFamily: 'Plus Jakarta Sans', 
                fontWeight: 700, 
                fontSize: '15px', 
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                ReturnReminder
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Lent & Borrowed Tracker
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button 
            type="button" 
            className="btn-icon" 
            style={{ padding: '6px' }} 
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Quick Add CTA */}
      <div style={{ padding: collapsed ? '14px 10px' : '16px 16px 10px', flexShrink: 0 }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openAddModal()}
          style={{
            width: '100%',
            padding: collapsed ? '10px' : '9px 16px',
            borderRadius: 'var(--radius-md)',
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}
          title="Add New Lent or Borrowed Item"
        >
          <PlusCircle size={18} />
          {!collapsed && <span>Record Item</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            // Handle active state accurately for /items/lent and /items/borrowed
            const isItemActive = (to) => {
              if (to === '/') return location.pathname === '/';
              if (to === '/items/lent') {
                return location.pathname === '/items/lent' || (location.pathname === '/items' && location.search.includes('type=lent'));
              }
              if (to === '/items/borrowed') {
                return location.pathname === '/items/borrowed' || (location.pathname === '/items' && location.search.includes('type=borrowed'));
              }
              return location.pathname.startsWith(to);
            };

            const active = isItemActive(item.to);

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: collapsed ? '10px' : '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    color: active ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: active ? 'var(--primary-light)' : 'transparent',
                    fontWeight: active ? 600 : 500,
                    fontSize: '13.5px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} style={{ flexShrink: 0, color: active ? (item.to.includes('borrowed') ? '#0ea5e9' : 'var(--primary)') : undefined }} />
                  {!collapsed && (
                    <span style={{ flex: 1 }}>{item.label}</span>
                  )}
                  {!collapsed && item.badge !== null && item.badge !== undefined && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: item.badgeColor,
                      color: 'white',
                      lineHeight: 1
                    }}>
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge !== null && item.badge !== undefined && (
                    <span style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: item.badgeColor
                    }} />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Expand trigger if collapsed */}
      {collapsed && (
        <div style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
          <button 
            type="button" 
            className="btn-icon" 
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* User profile / footer */}
      <div style={{
        padding: collapsed ? '12px' : '14px 16px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        flexShrink: 0
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-violet)',
          color: 'white',
          fontWeight: 600,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {userProfile?.name?.charAt(0) || 'U'}
        </div>
        {!collapsed && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userProfile?.name || 'Alex Morgan'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Personal Workspace
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
