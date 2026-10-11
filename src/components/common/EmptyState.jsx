import React from 'react';
import { PackageOpen } from 'lucide-react';

export function EmptyState({ 
  icon: Icon = PackageOpen, 
  title = 'No items found', 
  description = 'Try adjusting your search or filters, or add a new borrowed item.', 
  actionText, 
  onAction 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-subtle)',
      margin: '16px 0'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <Icon size={28} />
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {title}
      </h3>

      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: actionText ? '20px' : 0 }}>
        {description}
      </p>

      {actionText && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
