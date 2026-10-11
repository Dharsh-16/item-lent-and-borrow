import React from 'react';
import { ArrowUpRight, ArrowDownLeft, FileDown, Bell, Users, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportItemsToCSV } from '../../utils/exportUtils';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const { openAddModal, items } = useApp();
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
      marginBottom: '28px'
    }}>
      {/* Action 1: Record Lent Item */}
      <button
        type="button"
        onClick={() => openAddModal('lent')}
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          textAlign: 'left',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ArrowUpRight size={20} />
        </div>
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Record Lent Item
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Track item given to a friend
          </div>
        </div>
      </button>

      {/* Action 2: Record Borrowed Item */}
      <button
        type="button"
        onClick={() => openAddModal('borrowed')}
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          textAlign: 'left',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          color: '#0ea5e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ArrowDownLeft size={20} />
        </div>
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Record Borrowed Item
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Track item borrowed from friend
          </div>
        </div>
      </button>

      {/* Action 3: Friends List */}
      <button
        type="button"
        onClick={() => navigate('/friends')}
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          textAlign: 'left',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          color: 'var(--accent-violet)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Users size={20} />
        </div>
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Friends Management
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            View profiles & transactions
          </div>
        </div>
      </button>

      {/* Action 4: Export CSV */}
      <button
        type="button"
        onClick={() => exportItemsToCSV(items)}
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          textAlign: 'left',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <FileDown size={20} />
        </div>
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Export to CSV
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Spreadsheet backup
          </div>
        </div>
      </button>
    </div>
  );
}
