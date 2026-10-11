import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/dateUtils';
import { 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Package, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export function FriendProfileModal() {
  const { 
    viewingFriend, 
    closeFriendProfile, 
    openEditModal, 
    openDetailsModal, 
    openReminderModal, 
    markAsReturned, 
    openAddModal, 
    openFriendModal,
    deleteFriend,
    friendsSummary
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'lent' | 'borrowed'

  if (!viewingFriend) return null;

  // Retrieve current up-to-date summary for this friend
  const currentSummary = friendsSummary.find(f => f.id === viewingFriend.id) || viewingFriend;

  const lentItems = currentSummary.lentItems || [];
  const borrowedItems = currentSummary.borrowedItems || [];

  const handleAddLent = () => {
    openAddModal({ type: 'lent', friendId: currentSummary.id });
    closeFriendProfile();
  };

  const handleAddBorrowed = () => {
    openAddModal({ type: 'borrowed', friendId: currentSummary.id });
    closeFriendProfile();
  };

  const handleEditFriend = () => {
    openFriendModal(currentSummary);
  };

  const getInitials = (name) => {
    if (!name) return 'F';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Modal
      isOpen={Boolean(viewingFriend)}
      onClose={closeFriendProfile}
      title="Friend Profile & Transactions"
      size="lg"
      footer={
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleEditFriend}
          >
            <Edit3 size={14} />
            <span>Edit Friend Info</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={closeFriendProfile}
            >
              Close
            </button>
          </div>
        </div>
      }
    >
      <div>
        {/* Profile Header Hero */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Avatar Initials */}
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-violet) 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            {getInitials(currentSummary.name)}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {currentSummary.name}
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {currentSummary.phone ? (
                <a 
                  href={`tel:${currentSummary.phone}`} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}
                >
                  <Phone size={13} />
                  <span>{currentSummary.phone}</span>
                </a>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>No phone number</span>
              )}

              {currentSummary.email && (
                <a 
                  href={`mailto:${currentSummary.email}`} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}
                >
                  <Mail size={13} />
                  <span>{currentSummary.email}</span>
                </a>
              )}
            </div>

            {currentSummary.notes && (
              <div style={{ 
                marginTop: '10px', 
                fontSize: '12.5px', 
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-subtle)',
                padding: '8px 12px',
                borderRadius: '6px',
                fontStyle: 'italic'
              }}>
                "{currentSummary.notes}"
              </div>
            )}
          </div>

          {/* Quick Add CTA buttons directly on profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAddLent}
              style={{ justifyContent: 'flex-start' }}
            >
              <ArrowUpRight size={15} />
              <span>+ Record Lent Item</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddBorrowed}
              style={{ justifyContent: 'flex-start', color: '#0ea5e9', borderColor: '#0ea5e940' }}
            >
              <ArrowDownLeft size={15} />
              <span>+ Record Borrowed Item</span>
            </button>
          </div>
        </div>

        {/* Transaction Summary Stats Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-light)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '2px' }}>
              I Lent to Them
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentSummary.lentActive || 0}{' '}
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
                active ({currentSummary.lentTotal || 0} total)
              </span>
            </div>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#0ea5e9', textTransform: 'uppercase', marginBottom: '2px' }}>
              I Borrowed from Them
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentSummary.borrowedActive || 0}{' '}
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
                active ({currentSummary.borrowedTotal || 0} total)
              </span>
            </div>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: (currentSummary.overdueCount || 0) > 0 ? '#fee2e2' : 'var(--bg-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: (currentSummary.overdueCount || 0) > 0 ? '#ef4444' : 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
              Overdue Items
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: (currentSummary.overdueCount || 0) > 0 ? '#ef4444' : 'var(--text-primary)' }}>
              {currentSummary.overdueCount || 0}
            </div>
          </div>
        </div>

        {/* Direction Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '16px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 14px',
              border: 'none',
              borderBottom: activeTab === 'all' ? '2px solid var(--text-primary)' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'all' ? 600 : 500,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            All Items ({currentSummary.totalItems || 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lent')}
            style={{
              padding: '8px 14px',
              border: 'none',
              borderBottom: activeTab === 'lent' ? '2px solid var(--primary)' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'lent' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'lent' ? 600 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowUpRight size={14} />
            <span>Items I've Lent ({lentItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('borrowed')}
            style={{
              padding: '8px 14px',
              border: 'none',
              borderBottom: activeTab === 'borrowed' ? '2px solid #0ea5e9' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'borrowed' ? '#0ea5e9' : 'var(--text-secondary)',
              fontWeight: activeTab === 'borrowed' ? 600 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowDownLeft size={14} />
            <span>Items I've Borrowed ({borrowedItems.length})</span>
          </button>
        </div>

        {/* Section A: Items I've Lent to Them */}
        {(activeTab === 'all' || activeTab === 'lent') && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  Lent by Me
                </span>
                <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Items I've Lent to {currentSummary.name} ({lentItems.length})
                </h4>
              </div>

              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}
                onClick={handleAddLent}
              >
                + Add Lent
              </button>
            </div>

            {lentItems.length === 0 ? (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                fontSize: '12.5px'
              }}>
                No items lent to {currentSummary.name} yet.{' '}
                <button
                  type="button"
                  onClick={handleAddLent}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Record an item lent to them
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lentItems.map(item => (
                  <TransactionRow
                    key={item.id}
                    item={item}
                    direction="lent"
                    onDetails={() => {
                      closeFriendProfile();
                      openDetailsModal(item);
                    }}
                    onRemind={() => {
                      closeFriendProfile();
                      openReminderModal(item);
                    }}
                    onReturn={() => markAsReturned(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section B: Items I've Borrowed from Them */}
        {(activeTab === 'all' || activeTab === 'borrowed') && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(14, 165, 233, 0.1)',
                  color: '#0ea5e9',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  Borrowed by Me
                </span>
                <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Items I've Borrowed from {currentSummary.name} ({borrowedItems.length})
                </h4>
              </div>

              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: 600 }}
                onClick={handleAddBorrowed}
              >
                + Add Borrowed
              </button>
            </div>

            {borrowedItems.length === 0 ? (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                fontSize: '12.5px'
              }}>
                No items borrowed from {currentSummary.name} yet.{' '}
                <button
                  type="button"
                  onClick={handleAddBorrowed}
                  style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 600, cursor: 'pointer' }}
                >
                  Record an item borrowed from them
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {borrowedItems.map(item => (
                  <TransactionRow
                    key={item.id}
                    item={item}
                    direction="borrowed"
                    onDetails={() => {
                      closeFriendProfile();
                      openDetailsModal(item);
                    }}
                    onRemind={() => {
                      closeFriendProfile();
                      openReminderModal(item);
                    }}
                    onReturn={() => markAsReturned(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

function TransactionRow({ item, direction, onDetails, onRemind, onReturn }) {
  const isReturned = Boolean(item.dateReturned);
  const isLent = direction === 'lent';

  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-subtle)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ minWidth: '200px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
            {item.itemName}
          </span>
          <CategoryBadge category={item.category} size="small" />
          <StatusBadge customStatus={item.statusInfo} />
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {isLent ? 'Lent' : 'Borrowed'}: {formatDate(item.dateLent || item.dateBorrowed)} • Due: {formatDate(item.expectedReturnDate)}
          {item.dateReturned && ` • Returned: ${formatDate(item.dateReturned)}`}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {!isReturned ? (
          <>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onRemind}
              title={isLent ? "Send reminder to friend" : "Create return reminder for myself"}
            >
              <Send size={13} color="var(--primary)" />
              <span>{isLent ? 'Remind' : 'Reminder'}</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onReturn}
              title={isLent ? "Mark item returned by friend" : "Mark item returned to owner"}
            >
              <CheckCircle2 size={13} />
              <span>{isLent ? 'Mark Returned' : 'Return to Owner'}</span>
            </button>
          </>
        ) : (
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
            Returned ✓
          </span>
        )}

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onDetails}
        >
          Details
        </button>
      </div>
    </div>
  );
}
