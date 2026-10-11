import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  PlusCircle, 
  Phone, 
  Mail, 
  ArrowRight, 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Edit3, 
  Trash2, 
  Eye, 
  SlidersHorizontal,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDate } from '../utils/dateUtils';
import { EmptyState } from '../components/common/EmptyState';

export function Friends() {
  const { 
    friendsSummary, 
    openFriendModal, 
    openFriendProfile, 
    deleteFriend,
    openAddModal 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name_asc'); // 'name_asc' | 'most_items' | 'most_active' | 'most_overdue' | 'most_lent' | 'most_borrowed'

  const filteredAndSortedFriends = useMemo(() => {
    let list = [...friendsSummary];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(f => 
        f.name.toLowerCase().includes(q) ||
        (f.phone && f.phone.toLowerCase().includes(q)) ||
        (f.email && f.email.toLowerCase().includes(q)) ||
        (f.notes && f.notes.toLowerCase().includes(q))
      );
    }

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'most_items') {
        return (b.totalItems || 0) - (a.totalItems || 0);
      }
      if (sortBy === 'most_active') {
        return (b.activeCount || 0) - (a.activeCount || 0);
      }
      if (sortBy === 'most_overdue') {
        return (b.overdueCount || 0) - (a.overdueCount || 0);
      }
      if (sortBy === 'most_lent') {
        return (b.lentTotal || 0) - (a.lentTotal || 0);
      }
      if (sortBy === 'most_borrowed') {
        return (b.borrowedTotal || 0) - (a.borrowedTotal || 0);
      }
      return 0;
    });
  }, [friendsSummary, searchQuery, sortBy]);

  const getInitials = (name) => {
    if (!name) return 'F';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
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
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Friends & Borrowers
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Manage your network. Track who has your items and whose items you are holding.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openFriendModal()}
          style={{ padding: '9px 18px', fontSize: '14px' }}
        >
          <PlusCircle size={18} />
          <span>+ Add Friend</span>
        </button>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search friends by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-icon"
                style={{ position: 'absolute', right: '8px', top: '7px', padding: '4px' }}
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Sort by:
            </span>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name_asc">Name: A to Z</option>
              <option value="most_active">Most Active Items</option>
              <option value="most_overdue">Most Overdue Items First</option>
              <option value="most_items">Total Items (Lent + Borrowed)</option>
              <option value="most_lent">Most Items Lent</option>
              <option value="most_borrowed">Most Items Borrowed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Friends Cards Grid */}
      {filteredAndSortedFriends.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchQuery ? "No matching friends found" : "No friends added yet"}
          description={searchQuery ? "Try searching with a different name or email." : "Add friends to track items you lend to them and borrow from them."}
          actionText="+ Add First Friend"
          onAction={() => openFriendModal()}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredAndSortedFriends.map(friend => {
            const hasOverdue = (friend.overdueCount || 0) > 0;
            const initials = getInitials(friend.name);

            return (
              <div
                key={friend.id || friend.name}
                className="card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderTop: hasOverdue ? '3px solid #ef4444' : '1px solid var(--border-subtle)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onClick={() => openFriendProfile(friend)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                }}
              >
                {/* Header: Avatar, Name, Contact */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-violet) 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '17px',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {initials}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        color: 'var(--text-primary)', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }}>
                        {friend.name}
                      </h3>

                      {hasOverdue && (
                        <span style={{
                          fontSize: '11px',
                          color: '#ef4444',
                          backgroundColor: '#fee2e2',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          {friend.overdueCount} overdue
                        </span>
                      )}
                    </div>

                    {/* Contact info: phone & email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                      {friend.phone ? (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={11} color="var(--text-muted)" />
                          <span>{friend.phone}</span>
                        </div>
                      ) : (
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>No phone number</div>
                      )}

                      {friend.email && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={11} color="var(--text-muted)" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '190px' }}>
                            {friend.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown: Lent to them, Borrowed from them, Pending & Overdue */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '12px',
                  borderRadius: '10px',
                  marginBottom: '16px'
                }}>
                  {/* Lent to friend */}
                  <div style={{
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <ArrowUpRight size={12} color="var(--primary)" />
                      <span>I Lent</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {friend.lentTotal || 0}{' '}
                      <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--primary)' }}>
                        ({friend.lentActive || 0} active)
                      </span>
                    </div>
                  </div>

                  {/* Borrowed from friend */}
                  <div style={{
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <ArrowDownLeft size={12} color="#0ea5e9" />
                      <span>I Borrowed</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {friend.borrowedTotal || 0}{' '}
                      <span style={{ fontSize: '11px', fontWeight: 500, color: '#0ea5e9' }}>
                        ({friend.borrowedActive || 0} active)
                      </span>
                    </div>
                  </div>

                  {/* Pending total */}
                  <div style={{ textAlign: 'center', paddingTop: '4px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pending Items</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {friend.activeCount || 0}
                    </div>
                  </div>

                  {/* Overdue total */}
                  <div style={{ textAlign: 'center', paddingTop: '4px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Overdue Items</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: hasOverdue ? '#ef4444' : 'var(--text-primary)' }}>
                      {friend.overdueCount || 0}
                    </div>
                  </div>
                </div>

                {/* Items Preview preview list */}
                <div style={{ marginTop: 'auto', marginBottom: '14px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Recent Activity:
                  </div>

                  {(!friend.items || friend.items.length === 0) ? (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No items recorded yet with this friend.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {friend.items.slice(0, 2).map(item => {
                        const isLent = (item.type || 'lent') === 'lent';
                        return (
                          <div key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '12.5px',
                            padding: '3px 0',
                            color: 'var(--text-secondary)'
                          }}>
                            <span style={{ 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              maxWidth: '170px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <span style={{ color: isLent ? 'var(--primary)' : '#0ea5e9', fontWeight: 600, fontSize: '11px' }}>
                                {isLent ? '↑ Lent:' : '↓ Borr:'}
                              </span>
                              <span>{item.itemName}</span>
                            </span>
                            <StatusBadge customStatus={item.statusInfo} />
                          </div>
                        );
                      })}
                      {friend.items.length > 2 && (
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                          +{friend.items.length - 2} more transactions...
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Footer: View Profile, Quick Lend/Borrow, Edit, Delete */}
                <div 
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openFriendProfile(friend)}
                      title="View full transactions and history"
                    >
                      <Eye size={13} />
                      <span>Profile</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--primary)', fontWeight: 600, padding: '4px 8px' }}
                      onClick={() => openAddModal({ type: 'lent', friendId: friend.id })}
                      title={`Record item lent to ${friend.name}`}
                    >
                      <ArrowUpRight size={13} />
                      <span>Lend</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#0ea5e9', fontWeight: 600, padding: '4px 8px' }}
                      onClick={() => openAddModal({ type: 'borrowed', friendId: friend.id })}
                      title={`Record item borrowed from ${friend.name}`}
                    >
                      <ArrowDownLeft size={13} />
                      <span>Borrow</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '2px' }}>
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ padding: '6px' }}
                      onClick={() => openFriendModal(friend)}
                      title="Edit Friend Details"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon"
                      style={{ padding: '6px', color: '#ef4444' }}
                      onClick={() => deleteFriend(friend.id)}
                      title="Delete Friend"
                    >
                      <Trash2 size={15} />
                    </button>
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
