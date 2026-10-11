import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { User, Phone, Mail, FileText } from 'lucide-react';

export function FriendFormModal({ isOpen: propIsOpen, onClose: propOnClose, onSuccess }) {
  const { 
    isFriendModalOpen, 
    closeFriendModal, 
    editingFriend, 
    addFriend, 
    updateFriend 
  } = useApp();

  // Can be controlled via AppContext OR via local props (e.g. from ItemFormModal)
  const isControlled = propIsOpen !== undefined;
  const isOpen = isControlled ? propIsOpen : isFriendModalOpen;
  const isEditing = Boolean(editingFriend);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingFriend) {
      setFormData({
        name: editingFriend.name || '',
        phone: editingFriend.phone || '',
        email: editingFriend.email || '',
        notes: editingFriend.notes || ''
      });
      setErrors({});
    } else if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        notes: ''
      });
      setErrors({});
    }
  }, [editingFriend, isOpen]);

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      closeFriendModal();
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let resultFriend = null;
    if (isEditing) {
      updateFriend(editingFriend.id, formData);
      resultFriend = { ...editingFriend, ...formData };
    } else {
      resultFriend = addFriend(formData);
    }

    if (onSuccess && resultFriend) {
      onSuccess(resultFriend);
    }

    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Friend Details' : 'Add New Friend'}
      subtitle={isEditing ? 'Update contact info and personal notes' : 'Save borrower or lender contact information'}
      size="md"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Friend'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label">
            <span>Full Name <span className="required">*</span></span>
          </label>
          <div style={{ position: 'relative' }}>
            <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              style={{ paddingLeft: '36px' }}
              autoFocus
            />
          </div>
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        {/* Phone number */}
        <div className="form-group">
          <label className="form-label">
            <span>Phone / WhatsApp <span style={{ color: 'var(--text-muted)' }}>(Optional)</span></span>
          </label>
          <div style={{ position: 'relative' }}>
            <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="tel"
              className="form-control"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ paddingLeft: '36px' }}
            />
          </div>
          <div className="form-hint">Used for 1-click WhatsApp reminder links</div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">
            <span>Email Address <span style={{ color: 'var(--text-muted)' }}>(Optional)</span></span>
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              style={{ paddingLeft: '36px' }}
            />
          </div>
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        {/* Notes */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">
            <span>Notes / Context <span style={{ color: 'var(--text-muted)' }}>(Optional)</span></span>
          </label>
          <textarea
            rows={3}
            className="form-control"
            placeholder="e.g. College roommate, lives next door, reliable with books"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
}
