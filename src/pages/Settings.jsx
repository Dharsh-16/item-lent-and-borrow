import React, { useState, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Download, 
  Upload,
  RotateCcw, 
  Trash2, 
  User, 
  ShieldCheck, 
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportItemsToCSV, exportBackupJSON } from '../utils/exportUtils';
import { REMINDER_TONES } from '../utils/reminderTemplates';

export function Settings() {
  const { 
    theme, 
    setTheme, 
    items, 
    activities, 
    notifications, 
    userProfile, 
    setUserProfile,
    resetToDemoData, 
    clearAllData, 
    importBackupData,
    openConfirmDialog,
    showToast 
  } = useApp();

  const fileInputRef = useRef(null);
  const [name, setName] = useState(userProfile?.name || 'Alex Morgan');
  const [email, setEmail] = useState(userProfile?.email || 'alex.morgan@example.com');
  const [defaultTone, setDefaultTone] = useState(userProfile?.defaultTone || 'polite');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile({
      name,
      email,
      defaultTone
    });
    setSaved(true);
    showToast({ message: 'Settings saved successfully!', type: 'success' });
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetDemo = () => {
    openConfirmDialog({
      title: 'Reset to Sample Data?',
      message: 'This will reset items, notifications, and activity logs to the realistic demo dataset.',
      confirmText: 'Reset to Demo',
      onConfirm: resetToDemoData
    });
  };

  const handleClearAll = () => {
    openConfirmDialog({
      title: 'Clear All Data?',
      message: 'Are you sure you want to erase all lent items, activity history, and notifications? This cannot be undone.',
      confirmText: 'Erase All Data',
      isDanger: true,
      onConfirm: clearAllData
    });
  };

  const handleExportJSON = () => {
    exportBackupJSON({
      items,
      activities,
      notifications,
      userProfile,
      exportedAt: new Date().toISOString()
    });
    showToast({ message: 'JSON backup downloaded!', type: 'success' });
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        openConfirmDialog({
          title: 'Restore Backup Data?',
          message: `This will restore records from "${file.name}". Existing records will be replaced with the backup file data.`,
          confirmText: 'Restore Now',
          onConfirm: () => {
            importBackupData(parsed);
          }
        });
      } catch {
        showToast({ message: 'Invalid JSON file. Please select a valid backup.', type: 'error' });
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Hidden file input for backup restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImportJSON}
      />
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Settings & Preferences
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Manage your appearance, reminder message preferences, and data backups.
        </p>
      </div>

      {/* Section 1: Appearance Theme */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Interface Theme
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Choose your preferred theme appearance.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <button
            type="button"
            onClick={() => setTheme('light')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${theme === 'light' ? 'var(--primary)' : 'var(--border-subtle)'}`,
              backgroundColor: theme === 'light' ? 'var(--primary-light)' : 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sun size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Light Mode</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Crisp, soft off-white</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${theme === 'dark' ? 'var(--primary)' : 'var(--border-subtle)'}`,
              backgroundColor: theme === 'dark' ? 'var(--primary-light)' : 'var(--bg-subtle)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#1e1b4b',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Moon size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Dark Mode</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Sleek deep navy</div>
            </div>
          </button>
        </div>
      </div>

      {/* Section 2: User Profile & Reminder Tone */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Profile & Reminder Defaults
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Personalize greetings and your default reminder draft style.
        </p>

        <form onSubmit={handleSaveProfile}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Default Reminder Tone</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              {REMINDER_TONES.map(tone => {
                const isSelected = defaultTone === tone.id;
                return (
                  <button
                    type="button"
                    key={tone.id}
                    onClick={() => setDefaultTone(tone.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-subtle)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>{tone.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {tone.id === 'friendly' ? 'Warm and relaxed' : tone.id === 'polite' ? 'Courteous and clear' : 'Direct and firm'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            {saved ? <Check size={16} /> : null}
            <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
          </button>
        </form>
      </div>

      {/* Section 3: Data Management & Export */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Data Management
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Export your items to a spreadsheet or restore the realistic demonstration dataset.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => exportItemsToCSV(items)}
          >
            <FileSpreadsheet size={16} color="#10b981" />
            <span>Export to CSV</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportJSON}
          >
            <Download size={16} color="var(--primary)" />
            <span>Download JSON Backup</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} color="var(--accent-violet)" />
            <span>Restore JSON Backup</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleResetDemo}
          >
            <RotateCcw size={16} />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="button"
            className="btn btn-danger-ghost"
            onClick={handleClearAll}
          >
            <Trash2 size={16} />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* Section 4: System Architecture & Project Credits */}
      <div className="card" style={{ padding: '20px 24px', backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <ShieldCheck size={20} color="var(--primary)" />
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            ReturnReminder – Borrowed Item Tracker
          </h4>
        </div>
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Designed and engineered as a modern, reactive single-page application. Built with React 19, React Router, Recharts, Lucide Icons, and resilient LocalStorage state persistence.
        </p>
      </div>
    </div>
  );
}
