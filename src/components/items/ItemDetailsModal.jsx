import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { useApp } from '../../context/AppContext';
import { formatDate, calculateItemStatus, formatRelativeTime } from '../../utils/dateUtils';
import { 
  Calendar, 
  User, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  FileText,
  BellRing,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export function ItemDetailsModal() {
  const { 
    viewingItem, 
    closeDetailsModal, 
    openEditModal, 
    openReminderModal, 
    markAsReturned, 
    reopenItem, 
    deleteItem, 
    openConfirmDialog,
    activities 
  } = useApp();

  if (!viewingItem) return null;

  const status = calculateItemStatus(viewingItem);
  const isReturned = Boolean(viewingItem.dateReturned);
  const isLent = (viewingItem.type || 'lent') === 'lent';

  // Filter activities for this item
  const itemActivities = (activities || []).filter(a => a.itemId === viewingItem.id);

  const handleDelete = () => {
    openConfirmDialog({
      title: 'Delete this item?',
      message: `Are you sure you want to remove "${viewingItem.itemName}"? You can temporarily undo this action.`,
      confirmText: 'Delete Item',
      isDanger: true,
      onConfirm: () => deleteItem(viewingItem.id)
    });
  };

  return (
    <Modal
      isOpen={Boolean(viewingItem)}
      onClose={closeDetailsModal}
      title={isLent ? "Lent Item Details" : "Borrowed Item Details"}
      size="lg"
      footer={
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-danger-ghost btn-sm"
            onClick={handleDelete}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                closeDetailsModal();
                openEditModal(viewingItem);
              }}
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </button>

            {!isReturned ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--primary)' }}
                  onClick={() => openReminderModal(viewingItem)}
                >
                  <Send size={15} />
                  <span>{isLent ? "Send Reminder" : "Return Reminder"}</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => markAsReturned(viewingItem.id)}
                >
                  <CheckCircle2 size={15} />
                  <span>{isLent ? "Mark Returned" : "Mark Returned to Owner"}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => reopenItem(viewingItem.id)}
              >
                <RotateCcw size={15} />
                <span>Mark as Active</span>
              </button>
            )}
          </div>
        </div>
      }
    >
      <div>
        {/* Header Hero Area */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
          {viewingItem.imageUrl ? (
            <img
              src={viewingItem.imageUrl}
              alt={viewingItem.itemName}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1px solid var(--border-subtle)',
                flexShrink: 0
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : null}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{
                fontSize: '11px',
                color: isLent ? 'var(--primary)' : '#0ea5e9',
                backgroundColor: isLent ? 'var(--primary-light)' : 'rgba(14, 165, 233, 0.1)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {isLent ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                <span>{isLent ? "I've Lent This Item" : "I've Borrowed This Item"}</span>
              </span>
              <CategoryBadge category={viewingItem.category} />
              <StatusBadge customStatus={status} />
              <PriorityBadge priority={viewingItem.priority} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {viewingItem.itemName}
            </h2>

            {viewingItem.description && (
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {viewingItem.description}
              </p>
            )}
          </div>
        </div>

        {/* Info Grid Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {/* Friend / Owner info */}
          <div style={{
            padding: '14px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={13} />
              <span>{isLent ? "Borrower" : "Owner"}</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {viewingItem.friendName}
            </div>
            {viewingItem.contact ? (
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={12} />
                <span>{viewingItem.contact}</span>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                No contact info added
              </div>
            )}
          </div>

          {/* Timeline info */}
          <div style={{
            padding: '14px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} />
              <span>Timeline</span>
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>
                <strong>{isLent ? "Lent on:" : "Borrowed on:"}</strong> {formatDate(viewingItem.dateLent || viewingItem.dateBorrowed)}
              </div>
              <div>
                <strong>Return Due:</strong> {formatDate(viewingItem.expectedReturnDate)}
              </div>
              {viewingItem.dateReturned && (
                <div style={{ color: '#10b981', fontWeight: 600 }}>
                  <strong>Returned:</strong> {formatDate(viewingItem.dateReturned)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reminder stats & notes */}
        <div style={{
          padding: '14px 16px',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BellRing size={16} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Reminders Sent / Drafted: {viewingItem.remindersSentCount || 0}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {viewingItem.lastReminderDate 
                  ? `Last reminder logged: ${formatDate(viewingItem.lastReminderDate)}` 
                  : 'No reminders logged yet'}
              </div>
            </div>
          </div>

          {!isReturned && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => openReminderModal(viewingItem)}
            >
              {isLent ? "Draft Nudge" : "Draft Reminder"}
            </button>
          )}
        </div>

        {/* Personal Notes */}
        {viewingItem.notes && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={13} />
              <span>Notes & Context</span>
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: 'var(--text-secondary)', 
              backgroundColor: 'var(--bg-surface)', 
              padding: '12px 14px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-subtle)',
              fontStyle: 'italic'
            }}>
              "{viewingItem.notes}"
            </div>
          </div>
        )}

        {/* Activity Timeline for this item */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} />
            <span>Activity History ({itemActivities.length})</span>
          </div>

          {itemActivities.length === 0 ? (
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', padding: '10px 0' }}>
              No history recorded for this item yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {itemActivities.map(act => (
                <div key={act.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '12.5px'
                }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>•</span>
                  <div style={{ flex: 1, color: 'var(--text-primary)' }}>
                    {act.details}
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                    {formatRelativeTime(act.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
