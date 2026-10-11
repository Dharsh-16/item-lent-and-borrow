import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { REMINDER_TONES, generateReminderMessage, buildWhatsAppLink } from '../../utils/reminderTemplates';
import { formatDate, calculateItemStatus } from '../../utils/dateUtils';
import { Copy, MessageCircle, Check, Send, CheckCircle2 } from 'lucide-react';

export function SendReminderModal() {
  const { 
    remindingItem, 
    closeReminderModal, 
    sendReminder, 
    markAsReturned,
    showToast,
    userProfile 
  } = useApp();

  const [selectedTone, setSelectedTone] = useState('polite');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (remindingItem) {
      const status = calculateItemStatus(remindingItem);
      const isLent = (remindingItem.type || 'lent') === 'lent';
      const initialMsg = generateReminderMessage({
        tone: selectedTone,
        friendName: remindingItem.friendName,
        itemName: remindingItem.itemName,
        expectedDate: formatDate(remindingItem.expectedReturnDate),
        status: status.key,
        daysDiff: status.daysDiff,
        userName: userProfile?.name || 'I',
        type: remindingItem.type || 'lent'
      });
      setCustomMessage(initialMsg);
      setCopied(false);
    }
  }, [remindingItem, selectedTone, userProfile]);

  if (!remindingItem) return null;

  const status = calculateItemStatus(remindingItem);
  const isLent = (remindingItem.type || 'lent') === 'lent';
  const waLink = buildWhatsAppLink(remindingItem.contact, customMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage).then(() => {
      setCopied(true);
      showToast({ message: 'Reminder message copied to clipboard!', type: 'success' });
      sendReminder(remindingItem.id, { message: customMessage, tone: selectedTone, channel: 'clipboard' });
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      showToast({ message: 'Failed to copy to clipboard', type: 'error' });
    });
  };

  const handleWhatsAppClick = () => {
    if (waLink) {
      window.open(waLink, '_blank', 'noopener,noreferrer');
      sendReminder(remindingItem.id, { message: customMessage, tone: selectedTone, channel: 'whatsapp' });
    }
  };

  const handleMarkReturnedDirectly = () => {
    markAsReturned(remindingItem.id);
    closeReminderModal();
  };

  return (
    <Modal
      isOpen={Boolean(remindingItem)}
      onClose={closeReminderModal}
      title={isLent ? "Generate Polite Reminder" : "Return Reminder Note"}
      subtitle={
        isLent 
          ? `Craft a customized reminder message for ${remindingItem.friendName}`
          : `Create a return reminder note or message for ${remindingItem.friendName}`
      }
      size="md"
      footer={
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={closeReminderModal}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleMarkReturnedDirectly}
              title="If the item was already returned, mark it now"
              style={{ color: '#10b981', fontWeight: 600 }}
            >
              <CheckCircle2 size={14} />
              <span>Mark Returned</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopy}
            >
              {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            {remindingItem.contact && isLent ? (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleWhatsAppClick}
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle size={15} />
                <span>Open WhatsApp</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleCopy}
              >
                <Send size={15} />
                <span>Copy & Log</span>
              </button>
            )}
          </div>
        </div>
      }
    >
      <div>
        {/* Tone Selector */}
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label">
            {isLent ? "Select Reminder Tone" : "Select Reminder Style"}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {REMINDER_TONES.map(tone => {
              const isSelected = selectedTone === tone.id;
              return (
                <button
                  type="button"
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-subtle)',
                    color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tone.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom message textarea */}
        <div className="form-group">
          <label className="form-label">
            <span>Message / Reminder Preview <span style={{ color: 'var(--text-muted)' }}>(Editable)</span></span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{customMessage.length} chars</span>
          </label>
          <textarea
            rows={5}
            className="form-control"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            style={{ fontSize: '13.5px', lineHeight: 1.5, resize: 'vertical' }}
          />
        </div>

        {/* Contact info notice */}
        <div style={{
          padding: '12px 14px',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div>
            <strong>{isLent ? "Borrower:" : "Owner:"}</strong> {remindingItem.friendName}{' '}
            {remindingItem.contact ? `(${remindingItem.contact})` : '(No phone number on file)'}
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            {isLent 
              ? "💡 Clicking WhatsApp opens a prepopulated chat with your friend. ReturnReminder never sends messages without your explicit action."
              : "💡 You can copy this note as a reminder for your personal calendar or send it as a message to the owner."}
          </div>
        </div>
      </div>
    </Modal>
  );
}
