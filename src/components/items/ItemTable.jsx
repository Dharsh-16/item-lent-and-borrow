import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatDate, calculateItemStatus } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  Edit3, 
  Trash2, 
  Phone,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export function ItemTable({ items }) {
  const { 
    openDetailsModal, 
    openEditModal, 
    openReminderModal, 
    markAsReturned, 
    reopenItem, 
    deleteItem, 
    openConfirmDialog 
  } = useApp();

  const handleDelete = (item) => {
    openConfirmDialog({
      title: 'Delete this item?',
      message: `Are you sure you want to delete "${item.itemName}"?`,
      confirmText: 'Delete',
      isDanger: true,
      onConfirm: () => deleteItem(item.id)
    });
  };

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
        <thead>
          <tr style={{ 
            borderBottom: '1px solid var(--border-subtle)', 
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            <th style={{ padding: '12px 16px' }}>Item</th>
            <th style={{ padding: '12px 16px' }}>Direction</th>
            <th style={{ padding: '12px 16px' }}>Friend / Owner</th>
            <th style={{ padding: '12px 16px' }}>Date Recorded</th>
            <th style={{ padding: '12px 16px' }}>Return Deadline</th>
            <th style={{ padding: '12px 16px' }}>Status</th>
            <th style={{ padding: '12px 16px' }}>Priority</th>
            <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const status = calculateItemStatus(item);
            const isReturned = Boolean(item.dateReturned);
            const isLent = (item.type || 'lent') === 'lent';

            return (
              <tr 
                key={item.id}
                style={{ 
                  borderBottom: '1px solid var(--border-light)',
                  transition: 'background-color 0.15s ease',
                  cursor: 'pointer'
                }}
                onClick={() => openDetailsModal(item)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Item Name + Category */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt="" 
                        style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} 
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.itemName}
                      </div>
                      <div style={{ marginTop: '2px' }}>
                        <CategoryBadge category={item.category} size="small" />
                      </div>
                    </div>
                  </div>
                </td>

                {/* Direction: Lent Out vs Borrowed */}
                <td style={{ padding: '14px 16px' }}>
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
                </td>

                {/* Friend / Owner */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    {item.friendName}
                  </div>
                  {item.contact && (
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={11} />
                      <span>{item.contact}</span>
                    </div>
                  )}
                </td>

                {/* Date Recorded */}
                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                  {formatDate(item.dateLent || item.dateBorrowed)}
                </td>

                {/* Expected Return */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    {formatDate(item.expectedReturnDate)}
                  </div>
                  {isReturned && (
                    <div style={{ fontSize: '11px', color: '#10b981' }}>
                      Returned {formatDate(item.dateReturned)}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td style={{ padding: '14px 16px' }}>
                  <StatusBadge customStatus={status} />
                </td>

                {/* Priority */}
                <td style={{ padding: '14px 16px' }}>
                  <PriorityBadge priority={item.priority} />
                </td>

                {/* Actions */}
                <td 
                  style={{ padding: '14px 16px', textAlign: 'right' }} 
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    {!isReturned ? (
                      <>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ color: '#10b981' }}
                          title={isLent ? "Mark Returned" : "Return to Owner"}
                          onClick={() => markAsReturned(item.id)}
                        >
                          <CheckCircle2 size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn-icon"
                          style={{ color: 'var(--primary)' }}
                          title={isLent ? "Send Reminder" : "Create Reminder"}
                          onClick={() => openReminderModal(item)}
                        >
                          <Send size={15} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn-icon"
                        title="Reopen"
                        onClick={() => reopenItem(item.id)}
                      >
                        <RotateCcw size={15} />
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-icon"
                      title="Edit"
                      onClick={() => openEditModal(item)}
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon"
                      style={{ color: '#ef4444' }}
                      title="Delete"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
