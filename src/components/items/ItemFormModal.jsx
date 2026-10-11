import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, PRIORITIES } from '../../utils/sampleData';
import { getTodayString, addDays } from '../../utils/dateUtils';
import { FriendFormModal } from '../friends/FriendFormModal';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  UserPlus, 
  Sparkles, 
  Calendar,
  User
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Book', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Camera Lens', url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=600&q=80' },
  { label: 'Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Basketball', url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=600&q=80' },
  { label: 'Power Bank', url: 'https://images.unsplash.com/photo-1609592426804-0ee061801267?auto=format&fit=crop&w=600&q=80' },
  { label: 'Laptop Charger', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tripod', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80' }
];

export function ItemFormModal() {
  const { 
    isAddModalOpen, 
    closeAddModal, 
    addModalConfig,
    editingItem, 
    closeEditModal, 
    addItem, 
    updateItem,
    friends
  } = useApp();

  const isEditing = Boolean(editingItem);
  const isOpen = isAddModalOpen || isEditing;

  // Local state to open the Add Friend submodal without losing current form data
  const [isLocalAddFriendOpen, setIsLocalAddFriendOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: 'lent', // 'lent' | 'borrowed'
    itemName: '',
    category: 'Books',
    friendId: '',
    friendName: '',
    contact: '',
    dateLent: getTodayString(),
    dateBorrowed: getTodayString(),
    expectedReturnDate: addDays(getTodayString(), 7),
    priority: 'Normal',
    description: '',
    imageUrl: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        type: editingItem.type || 'lent',
        itemName: editingItem.itemName || '',
        category: editingItem.category || 'Books',
        friendId: editingItem.friendId || '',
        friendName: editingItem.friendName || '',
        contact: editingItem.contact || '',
        dateLent: editingItem.dateLent || editingItem.dateBorrowed || getTodayString(),
        dateBorrowed: editingItem.dateBorrowed || editingItem.dateLent || getTodayString(),
        expectedReturnDate: editingItem.expectedReturnDate || addDays(getTodayString(), 7),
        priority: editingItem.priority || 'Normal',
        description: editingItem.description || '',
        imageUrl: editingItem.imageUrl || '',
        notes: editingItem.notes || ''
      });
      setErrors({});
    } else if (isAddModalOpen) {
      const defaultType = addModalConfig?.type || 'lent';
      let preselectedFriend = null;
      if (addModalConfig?.friendId) {
        preselectedFriend = (friends || []).find(f => f.id === addModalConfig.friendId);
      }

      setFormData({
        type: defaultType,
        itemName: '',
        category: 'Books',
        friendId: preselectedFriend ? preselectedFriend.id : ((friends && friends.length > 0) ? friends[0].id : ''),
        friendName: preselectedFriend ? preselectedFriend.name : ((friends && friends.length > 0) ? friends[0].name : ''),
        contact: preselectedFriend ? (preselectedFriend.phone || preselectedFriend.email || '') : ((friends && friends.length > 0) ? (friends[0].phone || friends[0].email || '') : ''),
        dateLent: getTodayString(),
        dateBorrowed: getTodayString(),
        expectedReturnDate: addDays(getTodayString(), 7),
        priority: 'Normal',
        description: '',
        imageUrl: '',
        notes: ''
      });
      setErrors({});
    }
  }, [editingItem, isAddModalOpen, addModalConfig, friends]);

  const isLent = formData.type === 'lent';

  // Handle friend dropdown selection
  const handleFriendSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId === '__add_new__') {
      setIsLocalAddFriendOpen(true);
      return;
    }

    const foundFriend = (friends || []).find(f => f.id === selectedId);
    if (foundFriend) {
      setFormData(prev => ({
        ...prev,
        friendId: foundFriend.id,
        friendName: foundFriend.name,
        contact: foundFriend.phone || foundFriend.email || prev.contact
      }));
      if (errors.friendId) setErrors(prev => ({ ...prev, friendId: null, friendName: null }));
    }
  };

  // Callback when a friend is added via local modal
  const handleFriendAddedLocally = (newFriend) => {
    if (newFriend) {
      setFormData(prev => ({
        ...prev,
        friendId: newFriend.id,
        friendName: newFriend.name,
        contact: newFriend.phone || newFriend.email || prev.contact
      }));
      if (errors.friendId) setErrors(prev => ({ ...prev, friendId: null, friendName: null }));
    }
    setIsLocalAddFriendOpen(false);
  };

  const validate = () => {
    const errs = {};
    if (!formData.itemName.trim()) {
      errs.itemName = 'Item name is required.';
    }
    if (!formData.friendId && !formData.friendName.trim()) {
      errs.friendId = 'Please select or add a friend.';
    }
    
    const startDate = isLent ? formData.dateLent : formData.dateBorrowed;
    if (!startDate) {
      errs.startDate = isLent ? 'Date lent is required.' : 'Date borrowed is required.';
    }
    if (!formData.expectedReturnDate) {
      errs.expectedReturnDate = 'Expected return date is required.';
    } else if (startDate && formData.expectedReturnDate < startDate) {
      errs.expectedReturnDate = 'Return date cannot precede the start date.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      dateLent: isLent ? formData.dateLent : (formData.dateBorrowed || formData.dateLent),
      dateBorrowed: !isLent ? formData.dateBorrowed : (formData.dateLent || formData.dateBorrowed)
    };

    if (isEditing) {
      updateItem(editingItem.id, payload);
    } else {
      addItem(payload);
    }
  };

  const handleClose = () => {
    if (isEditing) {
      closeEditModal();
    } else {
      closeAddModal();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={
          isEditing 
            ? (isLent ? "Edit Lent Item" : "Edit Borrowed Item")
            : (isLent ? "Record Lent Item" : "Record Borrowed Item")
        }
        subtitle={
          isLent 
            ? "Keep track of an item you gave to a friend" 
            : "Keep track of an item you borrowed from a friend"
        }
        size="lg"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              {isEditing ? 'Save Changes' : (isLent ? 'Record Lent Item' : 'Record Borrowed Item')}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          {/* DIRECTION TOGGLE: I've Lent vs I've Borrowed */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'lent' }))}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isLent ? 'var(--primary)' : 'transparent',
                color: isLent ? 'white' : 'var(--text-secondary)',
                fontWeight: isLent ? 600 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isLent ? '0 2px 6px var(--primary-glow)' : 'none'
              }}
            >
              <ArrowUpRight size={16} />
              <span>I've Lent This Item (I gave it to someone)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'borrowed' }))}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: !isLent ? '#0ea5e9' : 'transparent',
                color: !isLent ? 'white' : 'var(--text-secondary)',
                fontWeight: !isLent ? 600 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: !isLent ? '0 2px 6px rgba(14, 165, 233, 0.25)' : 'none'
              }}
            >
              <ArrowDownLeft size={16} />
              <span>I've Borrowed This Item (Someone gave it to me)</span>
            </button>
          </div>

          {/* Row 1: Item Name & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Item Name <span className="required">*</span></span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.itemName ? 'is-invalid' : ''}`}
                placeholder="e.g. Operating Systems Textbook, DSLR Camera, Power Drill"
                value={formData.itemName}
                onChange={(e) => {
                  setFormData({ ...formData, itemName: e.target.value });
                  if (errors.itemName) setErrors({ ...errors, itemName: null });
                }}
              />
              {errors.itemName && <div className="form-error">{errors.itemName}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Connected Friend Dropdown + Add Friend Modal Trigger */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  <span>{isLent ? "Borrower / Friend" : "Owner / Friend"} <span className="required">*</span></span>
                </label>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    padding: '1px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onClick={() => setIsLocalAddFriendOpen(true)}
                >
                  <UserPlus size={12} />
                  <span>+ Add New Friend</span>
                </button>
              </div>

              <select
                className={`form-control ${errors.friendId ? 'is-invalid' : ''}`}
                value={formData.friendId || ''}
                onChange={handleFriendSelect}
              >
                <option value="" disabled>-- Select a friend from your list --</option>
                {(friends || []).map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.phone ? `(${f.phone})` : f.email ? `(${f.email})` : ''}
                  </option>
                ))}
                <option value="__add_new__">+ Add New Friend...</option>
              </select>
              {errors.friendId && <div className="form-error">{errors.friendId}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Phone / Email <span style={{ color: 'var(--text-muted)' }}>(Optional Contact)</span></span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. +91 98765 43210 or email"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
              <div className="form-hint">Auto-populated from friend record if available</div>
            </div>
          </div>

          {/* Row 3: Start Date & Expected Return Date */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                <span>{isLent ? "Date Lent" : "Date Borrowed"} <span className="required">*</span></span>
              </label>
              <input
                type="date"
                className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                value={isLent ? formData.dateLent : formData.dateBorrowed}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    dateLent: val,
                    dateBorrowed: val
                  });
                  if (errors.startDate) setErrors({ ...errors, startDate: null });
                }}
              />
              {errors.startDate && <div className="form-error">{errors.startDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Expected Return Date <span className="required">*</span></span>
              </label>
              <input
                type="date"
                className={`form-control ${errors.expectedReturnDate ? 'is-invalid' : ''}`}
                value={formData.expectedReturnDate}
                onChange={(e) => {
                  setFormData({ ...formData, expectedReturnDate: e.target.value });
                  if (errors.expectedReturnDate) setErrors({ ...errors, expectedReturnDate: null });
                }}
              />
              {errors.expectedReturnDate && <div className="form-error">{errors.expectedReturnDate}</div>}
            </div>
          </div>

          {/* Row 4: Priority selector */}
          <div className="form-group">
            <label className="form-label">Priority</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {PRIORITIES.map(p => {
                const isSelected = formData.priority === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setFormData({ ...formData, priority: p.id })}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isSelected ? p.color : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? `${p.color}15` : 'var(--bg-surface)',
                      color: isSelected ? p.color : 'var(--text-secondary)',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Description & Image URL with Quick presets */}
          <div className="form-group">
            <label className="form-label">Description / Identifying Details</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Black carrying pouch, edition 10, include serial/model details"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Item Image URL <span style={{ color: 'var(--text-muted)' }}>(Optional)</span></span>
            </label>
            <input
              type="url"
              className="form-control"
              placeholder="Paste image web link or choose a preset below"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            
            {/* Quick preset images */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={12} />
                <span>Quick photo presets:</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {PRESET_IMAGES.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: formData.imageUrl === preset.url ? 'var(--primary-light)' : 'var(--bg-subtle)',
                      color: formData.imageUrl === preset.url ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 6: Additional Notes */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Personal Notes / Context</label>
            <textarea
              rows={2}
              className="form-control"
              placeholder="e.g. Needed for the semester exams, agreed to return after Friday meetup"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Embedded Friend Modal for "+ Add New Friend" without losing form state */}
      {isLocalAddFriendOpen && (
        <FriendFormModal
          isOpen={isLocalAddFriendOpen}
          onClose={() => setIsLocalAddFriendOpen(false)}
          onSuccess={handleFriendAddedLocally}
        />
      )}
    </>
  );
}
