import React, { useMemo } from 'react';
import { 
  Package, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  PlusCircle, 
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  User,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDate } from '../utils/dateUtils';
import { CATEGORIES } from '../utils/sampleData';
import { useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

export function Dashboard() {
  const { 
    items, 
    dashboardStats, 
    friendsSummary,
    openAddModal, 
    userProfile, 
    openDetailsModal,
    openReminderModal,
    markAsReturned,
    openFriendProfile,
    openFriendModal
  } = useApp();

  const navigate = useNavigate();

  // Dynamic Greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Category breakdown for donut chart
  const categoryData = useMemo(() => {
    const countMap = {};
    (items || []).forEach(item => {
      const cat = item.category || 'Other';
      countMap[cat] = (countMap[cat] || 0) + 1;
    });

    return Object.entries(countMap).map(([name, value]) => {
      const catObj = CATEGORIES.find(c => c.id === name);
      return {
        name,
        value,
        color: catObj ? catObj.color : '#64748b'
      };
    });
  }, [items]);

  // Weekly Activity Trend Data
  const activityTrendData = useMemo(() => {
    return [
      { name: 'Mon', lent: 1, borrowed: 1, returned: 0 },
      { name: 'Tue', lent: 2, borrowed: 1, returned: 1 },
      { name: 'Wed', lent: 1, borrowed: 0, returned: 1 },
      { name: 'Thu', lent: 0, borrowed: 2, returned: 1 },
      { name: 'Fri', lent: 2, borrowed: 1, returned: 2 },
      { name: 'Sat', lent: 1, borrowed: 1, returned: 0 },
      { name: 'Sun', lent: 0, borrowed: 0, returned: 1 },
    ];
  }, []);

  const overdueBorrowed = dashboardStats.overdueBorrowedToReturn || [];
  const upcomingBorrowed = dashboardStats.upcomingBorrowedToReturn || [];
  const lentDue = dashboardStats.lentItemsDueFromFriends || [];
  const recentFriends = (friendsSummary || []).slice(0, 4);

  return (
    <div>
      {/* Top Welcome Banner */}
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
            {greeting}, {userProfile?.name?.split(' ')[0] || 'Friend'}! 👋
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Here is your live lending & borrowing overview. Keep both your lent items and commitments organized.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => openAddModal('borrowed')}
            style={{ color: '#0ea5e9', borderColor: '#0ea5e940' }}
          >
            <ArrowDownLeft size={16} />
            <span>+ Record Borrowed</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openAddModal('lent')}
          >
            <ArrowUpRight size={16} />
            <span>+ Record Lent</span>
          </button>
        </div>
      </div>

      {/* METRIC STAT CARDS: Separate Lent & Borrowed stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {/* Total Lent */}
        <StatCard
          title="Total Items Lent"
          value={dashboardStats.totalLent}
          icon={ArrowUpRight}
          color="var(--primary)"
          subtitle={`${dashboardStats.activeLent} currently with friends`}
          onClick={() => navigate('/items/lent')}
        />

        {/* Total Borrowed */}
        <StatCard
          title="Items Borrowed"
          value={dashboardStats.totalBorrowed}
          icon={ArrowDownLeft}
          color="#0ea5e9"
          subtitle={`${dashboardStats.activeBorrowed} currently in my care`}
          onClick={() => navigate('/items/borrowed')}
        />

        {/* Due Soon */}
        <StatCard
          title="Due Soon (≤ 3 Days)"
          value={dashboardStats.dueSoonCount}
          icon={Clock}
          color="#f59e0b"
          subtitle={`${dashboardStats.dueSoonLent} lent • ${dashboardStats.dueSoonBorrowed} borrowed`}
          onClick={() => navigate('/reminders')}
        />

        {/* Overdue Items */}
        <StatCard
          title="Overdue Items"
          value={dashboardStats.overdueCount}
          icon={AlertTriangle}
          color="#ef4444"
          subtitle={dashboardStats.overdueCount > 0 
            ? `${dashboardStats.overdueLent} lent • ${dashboardStats.overdueBorrowed} borrowed` 
            : "All on schedule"}
          onClick={() => navigate('/reminders')}
        />

        {/* Successfully Returned */}
        <StatCard
          title="Safely Returned"
          value={dashboardStats.returnedCount}
          icon={CheckCircle2}
          color="#10b981"
          subtitle={`${dashboardStats.returnedLent} lent back • ${dashboardStats.returnedBorrowed} returned to owner`}
          onClick={() => navigate('/items')}
        />
      </div>

      {/* Quick Action Shortcuts */}
      <QuickActions />

      {/* SPECIAL ALERT: Overdue items I need to return to others */}
      {overdueBorrowed.length > 0 && (
        <div className="card" style={{
          padding: '20px',
          marginBottom: '24px',
          borderLeft: '4px solid #ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#ef4444" />
              <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#ef4444' }}>
                Overdue Items I Need to Return to Others ({overdueBorrowed.length})
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Please return these to their owners as soon as possible!
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {overdueBorrowed.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid #fee2e2',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {item.itemName}
                    </span>
                    <StatusBadge customStatus={item.statusInfo} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Owner: <strong>{item.friendName}</strong> • Was due: <strong>{formatDate(item.expectedReturnDate)}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => markAsReturned(item.id)}
                  >
                    <CheckCircle2 size={13} />
                    <span>Return to Owner</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => openReminderModal(item)}
                  >
                    <Send size={13} />
                    <span>Self Note</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEPARATE DASHBOARD SECTIONS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Section 1: Upcoming items I need to return to others */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowDownLeft size={18} color="#0ea5e9" />
              <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Upcoming Items I Need to Return
              </h3>
            </div>
            <button
              type="button"
              className="btn-ghost"
              style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: 500 }}
              onClick={() => navigate('/items/borrowed')}
            >
              View all →
            </button>
          </div>

          {upcomingBorrowed.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No borrowed items currently due for return. You are all caught up! ✨
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcomingBorrowed.slice(0, 4).map(item => (
                <div
                  key={item.id}
                  onClick={() => openDetailsModal(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                      {item.itemName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Owner: <strong>{item.friendName}</strong> • Due: {formatDate(item.expectedReturnDate)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => markAsReturned(item.id)}
                    >
                      <CheckCircle2 size={13} />
                      <span>Return</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Items that friends need to return to me */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpRight size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Items Friends Need to Return to Me
              </h3>
            </div>
            <button
              type="button"
              className="btn-ghost"
              style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 500 }}
              onClick={() => navigate('/items/lent')}
            >
              View all →
            </button>
          </div>

          {lentDue.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No lent items currently due or overdue. Everything is on schedule! ✨
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lentDue.slice(0, 4).map(item => (
                <div
                  key={item.id}
                  onClick={() => openDetailsModal(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                      {item.itemName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      With <strong>{item.friendName}</strong> • Due: {formatDate(item.expectedReturnDate)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openReminderModal(item)}
                    >
                      <Send size={13} color="var(--primary)" />
                      <span>Remind</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => markAsReturned(item.id)}
                    >
                      <CheckCircle2 size={13} />
                      <span>Return</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RECENTLY ADDED FRIENDS & RECENTLY RETURNED ITEMS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Section 3: Recently added friends */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--accent-violet)" />
              <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Friends Network ({friendsSummary.length})
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}
                onClick={() => openFriendModal()}
              >
                + Add Friend
              </button>
              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}
                onClick={() => navigate('/friends')}
              >
                View all →
              </button>
            </div>
          </div>

          {recentFriends.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No friends recorded yet.{' '}
              <button
                type="button"
                onClick={() => openFriendModal()}
                style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}
              >
                Add your first friend
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentFriends.map(friend => (
                <div
                  key={friend.id}
                  onClick={() => openFriendProfile(friend)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-violet)20',
                      color: 'var(--accent-violet)',
                      fontWeight: 700,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {friend.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                        {friend.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {friend.phone || friend.email || 'No contact added'}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {friend.activeCount} active item{friend.activeCount !== 1 ? 's' : ''}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {friend.lentTotal || 0} lent • {friend.borrowedTotal || 0} borrowed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Safely Returned Items */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Recently Returned Items
              </h3>
            </div>
            <button
              type="button"
              className="btn-ghost"
              style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 500 }}
              onClick={() => navigate('/items')}
            >
              View all →
            </button>
          </div>

          {dashboardStats.returnedItems.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No items returned yet. Mark items as returned when transactions are complete!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dashboardStats.returnedItems.slice(0, 4).map(item => {
                const isLent = (item.type || 'lent') === 'lent';
                return (
                  <div
                    key={item.id}
                    onClick={() => openDetailsModal(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                          {item.itemName}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          backgroundColor: isLent ? 'var(--primary-light)' : 'rgba(14, 165, 233, 0.1)',
                          color: isLent ? 'var(--primary)' : '#0ea5e9'
                        }}>
                          {isLent ? "Lent" : "Borrowed"}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {isLent ? `Returned by ${item.friendName}` : `Returned to ${item.friendName}`} on {formatDate(item.dateReturned)}
                      </div>
                    </div>

                    <CategoryBadge category={item.category} size="small" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Charts Grid: Weekly Activity & Category Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        {/* Weekly Activity Chart */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Weekly Activity Overview
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Lent, borrowed, and returned activities
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                <span>Lent</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9' }} />
                <span>Borrowed</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Returned</span>
              </span>
            </div>
          </div>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis allowDecimals={false} stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)',
                    color: 'var(--text-primary)',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="lent" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="borrowed" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="returned" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Items by Category
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Distribution across both lent and borrowed items
            </p>
          </div>

          {categoryData.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No categories recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', height: '220px' }}>
              <div style={{ flex: 1, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px' }}>
                {categoryData.map(c => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
