import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  PlusCircle, 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PackageOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/items/ItemCard';
import { ItemTable } from '../components/items/ItemTable';
import { EmptyState } from '../components/common/EmptyState';
import { CATEGORIES, PRIORITIES } from '../utils/sampleData';
import { calculateItemStatus } from '../utils/dateUtils';

export function MyItems({ forcedType }) {
  const { items, openAddModal, dashboardStats } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active Category Direction: 'lent' | 'borrowed'
  const initialType = forcedType || searchParams.get('type') || 'lent';
  const [activeCategory, setActiveCategory] = useState(initialType);

  useEffect(() => {
    if (forcedType) {
      setActiveCategory(forcedType);
    } else {
      const typeParam = searchParams.get('type');
      if (typeParam === 'borrowed' || typeParam === 'lent') {
        setActiveCategory(typeParam);
      }
    }
  }, [forcedType, searchParams]);

  const handleCategorySwitch = (newType) => {
    setActiveCategory(newType);
    if (forcedType) {
      navigate(`/items/${newType}`);
    } else {
      setSearchParams({ type: newType });
    }
  };

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('nearest_deadline');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Status Filter Options
  const STATUS_OPTIONS = [
    { id: 'All', label: 'All Statuses' },
    { id: 'active', label: 'Active Items' },
    { id: 'due-today', label: 'Due Today' },
    { id: 'due-soon', label: 'Due Soon (≤3d)' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'returned', label: 'Returned' },
  ];

  // Filtered & Sorted items
  const processedItems = useMemo(() => {
    return (items || []).filter(item => {
      // Direction filter: Lent vs Borrowed
      const itemDirection = item.type || 'lent';
      if (itemDirection !== activeCategory) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.itemName.toLowerCase().includes(q);
        const matchFriend = (item.friendName || '').toLowerCase().includes(q);
        const matchDesc = item.description && item.description.toLowerCase().includes(q);
        const matchNotes = item.notes && item.notes.toLowerCase().includes(q);
        if (!matchName && !matchFriend && !matchDesc && !matchNotes) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'All' && item.priority !== selectedPriority) {
        return false;
      }

      // Dynamic Status filter
      if (selectedStatus !== 'All') {
        const status = calculateItemStatus(item);
        if (selectedStatus === 'active') {
          if (status.key === 'returned') return false;
        } else if (status.key !== selectedStatus) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const statusA = calculateItemStatus(a);
      const statusB = calculateItemStatus(b);

      if (sortBy === 'nearest_deadline') {
        return statusA.daysDiff - statusB.daysDiff;
      }
      if (sortBy === 'farthest_deadline') {
        return statusB.daysDiff - statusA.daysDiff;
      }
      if (sortBy === 'newest_recorded') {
        const dateA = new Date(a.dateLent || a.dateBorrowed || 0).getTime();
        const dateB = new Date(b.dateLent || b.dateBorrowed || 0).getTime();
        return dateB - dateA;
      }
      if (sortBy === 'oldest_recorded') {
        const dateA = new Date(a.dateLent || a.dateBorrowed || 0).getTime();
        const dateB = new Date(b.dateLent || b.dateBorrowed || 0).getTime();
        return dateA - dateB;
      }
      if (sortBy === 'name_asc') {
        return a.itemName.localeCompare(b.itemName);
      }
      return 0;
    });
  }, [items, activeCategory, searchQuery, selectedCategory, selectedStatus, selectedPriority, sortBy]);

  const visibleItems = processedItems.slice(0, itemsPerPage);
  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedPriority !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSortBy('nearest_deadline');
  };

  const isLent = activeCategory === 'lent';

  return (
    <div>
      {/* Integrated Page Header & Direction Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Left: Title & Context */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: isLent ? 'var(--primary-light)' : 'rgba(14, 165, 233, 0.12)',
              color: isLent ? 'var(--primary)' : '#0ea5e9'
            }}>
              {isLent ? "Outgoing Assets" : "Incoming Borrowed Assets"}
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isLent ? "Items I've Lent" : "Items I've Borrowed"}
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            {isLent 
              ? `Belongings you lent to friends. Tracking ${processedItems.length} record${processedItems.length !== 1 ? 's' : ''}.`
              : `Items borrowed from friends in your possession. Tracking ${processedItems.length} record${processedItems.length !== 1 ? 's' : ''}.`}
          </p>
        </div>

        {/* Right: Segmented Control & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            padding: '3px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => handleCategorySwitch('lent')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isLent ? 600 : 500,
                backgroundColor: isLent ? 'var(--primary)' : 'transparent',
                color: isLent ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
                boxShadow: isLent ? '0 1px 4px var(--primary-glow)' : 'none'
              }}
            >
              <ArrowUpRight size={14} />
              <span>I've Lent</span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isLent ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-muted)',
                color: isLent ? 'white' : 'var(--text-muted)'
              }}>
                {dashboardStats.activeLent}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySwitch('borrowed')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: !isLent ? 600 : 500,
                backgroundColor: !isLent ? '#0ea5e9' : 'transparent',
                color: !isLent ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.15s ease',
                boxShadow: !isLent ? '0 1px 4px rgba(14, 165, 233, 0.25)' : 'none'
              }}
            >
              <ArrowDownLeft size={14} />
              <span>I've Borrowed</span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: !isLent ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-muted)',
                color: !isLent ? 'white' : 'var(--text-muted)'
              }}>
                {dashboardStats.activeBorrowed}
              </span>
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openAddModal(activeCategory)}
            style={{ 
              backgroundColor: isLent ? 'var(--primary)' : '#0ea5e9',
              padding: '8px 16px',
              fontSize: '13px'
            }}
          >
            <PlusCircle size={16} />
            <span>{isLent ? "Record Lent Item" : "Record Borrowed Item"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search Box */}
          <div style={{
            position: 'relative',
            flex: '1 1 260px',
            maxWidth: '360px'
          }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              className="form-control"
              placeholder={isLent ? "Search lent items or borrowers..." : "Search borrowed items or owners..."}
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

          {/* Filter Dropdowns */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {/* Category Dropdown */}
            <select
              className="form-control"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              className="form-control"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>

            {/* Priority Dropdown */}
            <select
              className="form-control"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }}
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              {PRIORITIES.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              className="form-control"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nearest_deadline">Due Date: Nearest First</option>
              <option value="farthest_deadline">Due Date: Farthest First</option>
              <option value="newest_recorded">Date Recorded: Newest First</option>
              <option value="oldest_recorded">Date Recorded: Oldest First</option>
              <option value="name_asc">Item Name: A to Z</option>
            </select>

            {/* Reset Filters button if active */}
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={resetFilters}
                style={{ color: '#ef4444' }}
              >
                <X size={14} />
                <span>Reset</span>
              </button>
            )}

            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginLeft: '4px'
            }}>
              <button
                type="button"
                className="btn-icon"
                style={{
                  padding: '7px 10px',
                  borderRadius: 0,
                  backgroundColor: viewMode === 'grid' ? 'var(--primary-light)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)'
                }}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                className="btn-icon"
                style={{
                  padding: '7px 10px',
                  borderRadius: 0,
                  backgroundColor: viewMode === 'table' ? 'var(--primary-light)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-muted)'
                }}
                onClick={() => setViewMode('table')}
                title="Table list view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Item Listing */}
      {processedItems.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title={
            hasActiveFilters 
              ? "No items match your filters" 
              : (isLent ? "No items lent out yet" : "No borrowed items recorded yet")
          }
          description={
            hasActiveFilters 
              ? "Try resetting or adjusting your search queries and filter options."
              : (isLent 
                  ? "Record items you lend to friends to keep track of return dates and gentle reminders."
                  : "Record items you borrowed from friends so you never forget to return them on time.")
          }
          actionText={hasActiveFilters ? "Reset Filters" : (isLent ? "+ Record Lent Item" : "+ Record Borrowed Item")}
          onAction={hasActiveFilters ? resetFilters : () => openAddModal(activeCategory)}
        />
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '18px'
        }}>
          {visibleItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <ItemTable items={visibleItems} />
      )}

      {/* Load More Pagination */}
      {processedItems.length > visibleItems.length && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setItemsPerPage(prev => prev + 12)}
          >
            Load More Items ({processedItems.length - visibleItems.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
