import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Package, User, ArrowRight, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';

export function GlobalSearchModal() {
  const { 
    isGlobalSearchOpen, 
    closeGlobalSearch, 
    items, 
    openDetailsModal, 
    friendsSummary,
    openFriendProfile 
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isGlobalSearchOpen]);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        closeGlobalSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, closeGlobalSearch]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return (items || []).slice(0, 6);
    const q = query.toLowerCase();
    return (items || []).filter(item => 
      item.itemName.toLowerCase().includes(q) ||
      (item.friendName && item.friendName.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.notes && item.notes.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [items, query]);

  const filteredFriends = useMemo(() => {
    if (!query.trim()) return (friendsSummary || []).slice(0, 4);
    const q = query.toLowerCase();
    return (friendsSummary || []).filter(f => 
      f.name.toLowerCase().includes(q) ||
      (f.phone && f.phone.toLowerCase().includes(q)) ||
      (f.email && f.email.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [friendsSummary, query]);

  if (!isGlobalSearchOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={closeGlobalSearch}
      style={{ alignItems: 'flex-start', paddingTop: '10vh' }}
    >
      <div 
        className="modal-dialog" 
        style={{ maxWidth: '620px', borderRadius: '16px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <Search size={20} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search items, friends, categories, or notes... (Press Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '15px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
          {query && (
            <button 
              type="button" 
              className="btn-icon" 
              style={{ padding: '4px' }} 
              onClick={() => setQuery('')}
            >
              <X size={16} />
            </button>
          )}
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)'
          }}>
            ESC
          </span>
        </div>

        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px' }}>
          {/* Items Section */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Package size={13} />
              <span>Items ({filteredItems.length})</span>
            </div>

            {filteredItems.length === 0 ? (
              <div style={{ padding: '10px 12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                No matching items found.
              </div>
            ) : (
              filteredItems.map(item => {
                const isLent = (item.type || 'lent') === 'lent';
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      closeGlobalSearch();
                      openDetailsModal(item);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: isLent ? 'var(--primary-light)' : 'rgba(14, 165, 233, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isLent ? 'var(--primary)' : '#0ea5e9'
                      }}>
                        {isLent ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {item.itemName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {isLent ? "Lent to" : "Borrowed from"} {item.friendName}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CategoryBadge category={item.category} size="small" />
                      <StatusBadge item={item} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Friends Section */}
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <User size={13} />
              <span>Friends ({filteredFriends.length})</span>
            </div>

            {filteredFriends.length === 0 ? (
              <div style={{ padding: '10px 12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                No matching friends found.
              </div>
            ) : (
              filteredFriends.map(friend => (
                <div
                  key={friend.id || friend.name}
                  onClick={() => {
                    closeGlobalSearch();
                    openFriendProfile(friend);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-violet)20',
                      color: 'var(--accent-violet)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {friend.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {friend.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {friend.activeCount || 0} active • {friend.lentTotal || 0} lent, {friend.borrowedTotal || 0} borrowed
                      </div>
                    </div>
                  </div>

                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{
          padding: '10px 16px',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <span>Press <strong>ESC</strong> to exit</span>
          <span>ReturnReminder Quick Search</span>
        </div>
      </div>
    </div>
  );
}
