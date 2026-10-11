import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatDate, calculateItemStatus } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  User, 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  Edit3, 
  Trash2,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export function ItemCard({ item }) {
  const { 
    openDetailsModal, 
    openEditModal, 
    openReminderModal, 
    markAsReturned, 
    reopenItem, 
    deleteItem, 
    openConfirmDialog 
  } = useApp();

  const status = calculateItemStatus(item);
  const isReturned = Boolean(item.dateReturned);
  const isLent = (item.type || 'lent') === 'lent';

  const handleDelete = (e) => {
    e.stopPropagation();
    openConfirmDialog({
      title: 'Delete this item?',
      message: `Are you sure you want to remove "${item.itemName}"? You can undo this temporarily.`,
      confirmText: 'Delete',
      isDanger: true,
      onConfirm: () => deleteItem(item.id)
    });
  };

  return (
    <div
      className="card item-card"
      onClick={() => openDetailsModal(item)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '18px',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        borderLeft: isLent ? '3px solid var(--primary)' : '3px solid #0ea5e9'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* Top row: Category, Direction Badge, Priority & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CategoryBadge category={item.category} size="small" />
          <span style={{
            fontSize: '11px',
            color: isLent ? 'var(--primary)' : '#0ea5e9',
            backgroundColor: isLent ? 'var(--primary-light)' : 'rgba(14, 165, 233, 0.1)',
            padding: '2px 7px',
            borderRadius: '4px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            {isLent ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
            <span>{isLent ? "Lent Out" : "Borrowed"}</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PriorityBadge priority={item.priority} />
          <StatusBadge customStatus={status} />
        </div>
      </div>

      {/* Item Image (if available) or Header */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '12px' }}>
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.itemName}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '8px',
              objectFit: 'cover',
              border: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ 
            fontSize: '15.5px', 
            fontWeight: 600, 
            color: 'var(--text-primary)', 
            lineHeight: 1.3,
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {item.itemName}
          </h4>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '12.5px', 
            color: 'var(--text-secondary)' 
          }}>
            <User size={13} color="var(--text-muted)" />
            <span style={{ fontWeight: 500 }}>
              {isLent ? "To:" : "From:"} {item.friendName}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline: Start Date & Due Date */}
      <div style={{
        marginTop: 'auto',
        padding: '10px 12px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-subtle)',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={13} color="var(--text-muted)" />
          <span>Due: <strong>{formatDate(item.expectedReturnDate)}</strong></span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {isLent ? 'Lent' : 'Borrowed'} {formatDate(item.dateLent || item.dateBorrowed)}
        </span>
      </div>

      {/* Card Action Footer */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '10px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {!isReturned ? (
            <>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => markAsReturned(item.id)}
                title={isLent ? "Mark item returned by friend" : "Mark item returned to owner"}
              >
                <CheckCircle2 size={14} />
                <span>{isLent ? 'Return' : 'Return to Owner'}</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => openReminderModal(item)}
                title={isLent ? "Send reminder to friend" : "Create return reminder for myself"}
              >
                <Send size={13} color="var(--primary)" />
                <span>{isLent ? 'Remind' : 'Reminder'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => reopenItem(item.id)}
              title="Mark item back to active"
            >
              <RotateCcw size={13} />
              <span>Reopen</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '2px' }}>
          <button
            type="button"
            className="btn-icon"
            style={{ padding: '6px' }}
            onClick={() => openEditModal(item)}
            title="Edit item details"
          >
            <Edit3 size={15} />
          </button>
          <button
            type="button"
            className="btn-icon"
            style={{ padding: '6px', color: '#ef4444' }}
            onClick={handleDelete}
            title="Delete item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
