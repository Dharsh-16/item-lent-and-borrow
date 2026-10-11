import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ItemFormModal } from '../items/ItemFormModal';
import { ItemDetailsModal } from '../items/ItemDetailsModal';
import { SendReminderModal } from '../items/SendReminderModal';
import { FriendFormModal } from '../friends/FriendFormModal';
import { FriendProfileModal } from '../friends/FriendProfileModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { ToastContainer } from '../common/Toast';
import { useApp } from '../../context/AppContext';

export function Layout() {
  const { confirmDialog, closeConfirmDialog } = useApp();

  return (
    <div className="app-container">
      {/* Collapsible / responsive sidebar */}
      <Sidebar />

      {/* Main content wrapper */}
      <div className="main-content-wrapper">
        <Topbar />

        <main className="page-container">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ItemFormModal />
      <ItemDetailsModal />
      <SendReminderModal />
      <FriendFormModal />
      <FriendProfileModal />
      <GlobalSearchModal />
      <ToastContainer />

      {/* Global Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={Boolean(confirmDialog)}
          onClose={closeConfirmDialog}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          isDanger={confirmDialog.isDanger}
          onConfirm={confirmDialog.onConfirm}
        />
      )}
    </div>
  );
}
