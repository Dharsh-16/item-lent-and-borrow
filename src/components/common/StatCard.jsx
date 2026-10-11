import React from 'react';

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = '#6366f1', 
  subtitle, 
  trend, 
  onClick, 
  isActive = false 
}) {
  return (
    <div 
      className={`card stat-card ${onClick ? 'interactive' : ''} ${isActive ? 'active-filter' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        padding: '20px 22px',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            {title}
          </span>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: 700, 
            letterSpacing: '-0.03em', 
            margin: '6px 0 4px',
            color: 'var(--text-primary)'
          }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {subtitle}
            </div>
          )}
        </div>
        
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          backgroundColor: `${color}15`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>

      {trend && (
        <div style={{ 
          marginTop: '12px', 
          paddingTop: '10px', 
          borderTop: '1px solid var(--border-light)',
          fontSize: '11.5px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {trend}
        </div>
      )}
    </div>
  );
}
