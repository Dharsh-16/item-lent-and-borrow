import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateSampleData } from '../utils/sampleData';
import { calculateItemStatus, getTodayString, addDays } from '../utils/dateUtils';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Primary persistent data stores
  const [friends, setFriends] = useLocalStorage('rr_friends', () => generateSampleData().friends);
  const [items, setItems] = useLocalStorage('rr_items', () => generateSampleData().items);
  const [activities, setActivities] = useLocalStorage('rr_activities', () => generateSampleData().activities);
  const [notifications, setNotifications] = useLocalStorage('rr_notifications', () => generateSampleData().notifications);
  const [theme, setTheme] = useLocalStorage('rr_theme', 'light');
  const [userProfile, setUserProfile] = useLocalStorage('rr_profile', {
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    defaultTone: 'polite'
  });

  // Ephemeral states: toasts, modals
  const [toasts, setToasts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalConfig, setAddModalConfig] = useState({ type: 'lent', friendId: null });
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [remindingItem, setRemindingItem] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Friend modals
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);
  const [editingFriend, setEditingFriend] = useState(null);
  const [viewingFriend, setViewingFriend] = useState(null);

  // Data migration / consistency verification
  // Data migration / consistency verification
  // Runs safely once to ensure items have valid 'type' ('lent'|'borrowed'), sample data is enriched, and friend links are verified
  useEffect(() => {
    let itemsChanged = false;
    let friendsChanged = false;

    const sample = generateSampleData();
    const currentFriends = [...(friends || [])];
    const friendMapByName = new Map(currentFriends.map(f => [f.name.trim().toLowerCase(), f]));

    // Ensure all sample friends exist
    sample.friends.forEach(sf => {
      const key = sf.name.trim().toLowerCase();
      if (!friendMapByName.has(key)) {
        currentFriends.push(sf);
        friendMapByName.set(key, sf);
        friendsChanged = true;
      }
    });

    let updatedItems = (items || []).map(item => {
      let modified = false;
      const copy = { ...item };

      // 1. Default direction type to 'lent' if not specified
      if (!copy.type) {
        copy.type = 'lent';
        modified = true;
      }

      // 2. Synchronize dateLent and dateBorrowed
      if (copy.type === 'borrowed' && !copy.dateBorrowed && copy.dateLent) {
        copy.dateBorrowed = copy.dateLent;
        modified = true;
      }
      if (copy.type === 'lent' && !copy.dateLent && copy.dateBorrowed) {
        copy.dateLent = copy.dateBorrowed;
        modified = true;
      }

      // 3. Connect friend by friendId or name
      const friendNameKey = (copy.friendName || '').trim().toLowerCase();
      if (!copy.friendId && friendNameKey) {
        if (friendMapByName.has(friendNameKey)) {
          copy.friendId = friendMapByName.get(friendNameKey).id;
          modified = true;
        } else {
          const newFriendId = 'friend-gen-' + Math.random().toString(36).substr(2, 6);
          const newFriend = {
            id: newFriendId,
            name: copy.friendName.trim(),
            phone: copy.contact || '',
            email: '',
            notes: 'Imported from existing item record',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          currentFriends.push(newFriend);
          friendMapByName.set(friendNameKey, newFriend);
          copy.friendId = newFriendId;
          modified = true;
          friendsChanged = true;
        }
      }

      if (modified) itemsChanged = true;
      return copy;
    });

    // 4. Ensure two-way tracking has borrowed items: if no borrowed items exist, seed sample borrowed items
    const hasBorrowed = updatedItems.some(i => i.type === 'borrowed');
    if (!hasBorrowed) {
      const sampleBorrowed = sample.items.filter(i => i.type === 'borrowed').map(bi => {
        const friend = currentFriends.find(f => f.name.toLowerCase() === (bi.friendName || '').toLowerCase());
        return {
          ...bi,
          friendId: friend ? friend.id : bi.friendId
        };
      });
      if (sampleBorrowed.length > 0) {
        updatedItems = [...updatedItems, ...sampleBorrowed];
        itemsChanged = true;
      }
    }

    // 5. Seed sample activities if currently empty
    if (!activities || activities.length === 0) {
      setActivities(sample.activities);
    }

    if (itemsChanged) {
      setItems(updatedItems);
    }
    if (friendsChanged) {
      setFriends(currentFriends);
    }
  }, []); // Run on mount

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keyboard shortcut for Cmd/Ctrl+K Global Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast manager
  const showToast = useCallback(({ message, type = 'success', actionLabel, onAction, duration = 4000 }) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast = { id, message, type, actionLabel, onAction };
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Activity logger helper
  const logActivity = useCallback((activityData) => {
    const newActivity = {
      id: 'act-' + Date.now(),
      timestamp: new Date().toISOString(),
      ...activityData
    };
    setActivities(prev => [newActivity, ...(prev || [])]);
  }, [setActivities]);

  // Automatic notification evaluation when items change
  useEffect(() => {
    const now = new Date();
    const generatedNotifs = [];

    (items || []).forEach(item => {
      if (item.dateReturned) return; // already returned

      const status = calculateItemStatus(item);
      const notifIdPrefix = `notif-${item.id}-${item.expectedReturnDate}`;
      const isLent = (item.type || 'lent') === 'lent';
      const friendDisplayName = item.friendName || 'Friend';

      if (status.key === 'overdue') {
        generatedNotifs.push({
          id: `${notifIdPrefix}-overdue`,
          itemId: item.id,
          type: 'overdue',
          direction: item.type || 'lent',
          title: isLent ? 'Lent Item Overdue' : 'Borrowed Item Overdue for Return',
          message: isLent
            ? `"${item.itemName}" lent to ${friendDisplayName} is overdue (${Math.abs(status.daysDiff)} days).`
            : `"${item.itemName}" borrowed from ${friendDisplayName} is overdue (${Math.abs(status.daysDiff)} days)!`,
          timestamp: now.toISOString(),
          isRead: false,
          snoozedUntil: null
        });
      } else if (status.key === 'due-today') {
        generatedNotifs.push({
          id: `${notifIdPrefix}-duetoday`,
          itemId: item.id,
          type: 'due_today',
          direction: item.type || 'lent',
          title: isLent ? 'Lent Item Due Today' : 'Borrowed Item Due Today',
          message: isLent
            ? `"${item.itemName}" lent to ${friendDisplayName} is scheduled to return today.`
            : `"${item.itemName}" borrowed from ${friendDisplayName} should be returned to them today.`,
          timestamp: now.toISOString(),
          isRead: false,
          snoozedUntil: null
        });
      } else if (status.key === 'due-soon') {
        generatedNotifs.push({
          id: `${notifIdPrefix}-duesoon`,
          itemId: item.id,
          type: 'due_soon',
          direction: item.type || 'lent',
          title: isLent ? 'Lent Item Due Soon' : 'Borrowed Item Due Soon',
          message: isLent
            ? `"${item.itemName}" lent to ${friendDisplayName} is due in ${status.daysDiff} days.`
            : `"${item.itemName}" borrowed from ${friendDisplayName} is due in ${status.daysDiff} days.`,
          timestamp: now.toISOString(),
          isRead: false,
          snoozedUntil: null
        });
      }
    });

    // Merge without overriding existing read or snooze status
    setNotifications(prev => {
      const existingMap = new Map((prev || []).map(n => [n.id, n]));
      const merged = [...(prev || [])];

      generatedNotifs.forEach(gen => {
        if (!existingMap.has(gen.id)) {
          merged.unshift(gen);
        }
      });

      return merged;
    });
  }, [items, setNotifications]);

  // ==========================================
  // FRIENDS CRUD OPERATIONS
  // ==========================================
  const addFriend = useCallback((friendData) => {
    const id = 'friend-' + Date.now();
    const newFriend = {
      id,
      name: friendData.name.trim(),
      phone: (friendData.phone || '').trim(),
      email: (friendData.email || '').trim(),
      notes: (friendData.notes || '').trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setFriends(prev => [newFriend, ...(prev || [])]);

    logActivity({
      type: 'friend_added',
      friendName: newFriend.name,
      details: `Added new friend: ${newFriend.name}`
    });

    showToast({
      message: `Friend "${newFriend.name}" added successfully!`,
      type: 'success'
    });

    setIsFriendModalOpen(false);
    setEditingFriend(null);
    return newFriend;
  }, [setFriends, logActivity, showToast]);

  const updateFriend = useCallback((id, updatedFields) => {
    let updatedFriend = null;

    setFriends(prev => prev.map(f => {
      if (f.id === id) {
        updatedFriend = {
          ...f,
          ...updatedFields,
          name: updatedFields.name !== undefined ? updatedFields.name.trim() : f.name,
          phone: updatedFields.phone !== undefined ? updatedFields.phone.trim() : f.phone,
          email: updatedFields.email !== undefined ? updatedFields.email.trim() : f.email,
          notes: updatedFields.notes !== undefined ? updatedFields.notes.trim() : f.notes,
          updatedAt: new Date().toISOString()
        };
        return updatedFriend;
      }
      return f;
    }));

    // Cascade name/contact update to associated items
    if (updatedFields.name || updatedFields.phone) {
      setItems(prev => prev.map(item => {
        if (item.friendId === id) {
          return {
            ...item,
            friendName: updatedFields.name ? updatedFields.name.trim() : item.friendName,
            contact: updatedFields.phone !== undefined ? updatedFields.phone.trim() : item.contact,
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      }));
    }

    if (viewingFriend && viewingFriend.id === id && updatedFriend) {
      setViewingFriend(updatedFriend);
    }

    logActivity({
      type: 'friend_updated',
      friendName: updatedFields.name || 'Friend',
      details: `Updated details for ${updatedFields.name || 'friend'}`
    });

    showToast({
      message: 'Friend details updated successfully!',
      type: 'success'
    });

    setIsFriendModalOpen(false);
    setEditingFriend(null);
  }, [setFriends, setItems, viewingFriend, logActivity, showToast]);

  const deleteFriend = useCallback((id) => {
    const friendToDelete = (friends || []).find(f => f.id === id);
    if (!friendToDelete) return;

    // Check for associated items
    const associatedItems = (items || []).filter(item => item.friendId === id);
    if (associatedItems.length > 0) {
      const activeCount = associatedItems.filter(i => !i.dateReturned).length;
      openConfirmDialog({
        title: 'Cannot Delete Friend With Records',
        message: `"${friendToDelete.name}" has ${associatedItems.length} associated item record${associatedItems.length !== 1 ? 's' : ''} (${activeCount} currently active). Please reassign or delete the associated items first before removing this friend.`,
        confirmText: 'Understood',
        isDanger: false,
        onConfirm: () => {}
      });
      return;
    }

    setFriends(prev => prev.filter(f => f.id !== id));

    if (viewingFriend && viewingFriend.id === id) {
      setViewingFriend(null);
    }

    logActivity({
      type: 'friend_deleted',
      friendName: friendToDelete.name,
      details: `Removed friend "${friendToDelete.name}"`
    });

    showToast({
      message: `Removed friend "${friendToDelete.name}".`,
      type: 'warning',
      actionLabel: 'Undo',
      duration: 6000,
      onAction: () => {
        setFriends(prev => [friendToDelete, ...prev]);
        logActivity({
          type: 'friend_restored',
          friendName: friendToDelete.name,
          details: `Restored friend "${friendToDelete.name}"`
        });
        showToast({ message: `Restored "${friendToDelete.name}"!`, type: 'success' });
      }
    });
  }, [friends, items, viewingFriend, setFriends, logActivity, showToast]);

  // ==========================================
  // ITEMS CRUD OPERATIONS
  // ==========================================
  const addItem = useCallback((itemData) => {
    const id = 'item-' + Date.now();
    const type = itemData.type || 'lent';

    const newItem = {
      ...itemData,
      id,
      type,
      dateLent: itemData.dateLent || itemData.dateBorrowed || getTodayString(),
      dateBorrowed: itemData.dateBorrowed || itemData.dateLent || getTodayString(),
      dateReturned: null,
      remindersSentCount: 0,
      lastReminderDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setItems(prev => [newItem, ...(prev || [])]);

    const isLent = type === 'lent';
    logActivity({
      type: 'item_created',
      itemId: id,
      itemName: newItem.itemName,
      friendName: newItem.friendName,
      details: isLent
        ? `Lent "${newItem.itemName}" to ${newItem.friendName} (due: ${newItem.expectedReturnDate})`
        : `Borrowed "${newItem.itemName}" from ${newItem.friendName} (due: ${newItem.expectedReturnDate})`
    });

    showToast({
      message: `"${newItem.itemName}" recorded successfully!`,
      type: 'success'
    });

    setIsAddModalOpen(false);
    return newItem;
  }, [setItems, logActivity, showToast]);

  const updateItem = useCallback((id, updatedFields) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const type = updatedFields.type || item.type || 'lent';
        const updated = {
          ...item,
          ...updatedFields,
          type,
          dateLent: updatedFields.dateLent || item.dateLent || updatedFields.dateBorrowed || item.dateBorrowed,
          dateBorrowed: updatedFields.dateBorrowed || item.dateBorrowed || updatedFields.dateLent || item.dateLent,
          updatedAt: new Date().toISOString()
        };
        if (viewingItem && viewingItem.id === id) {
          setViewingItem(updated);
        }
        return updated;
      }
      return item;
    }));

    logActivity({
      type: 'item_updated',
      itemId: id,
      itemName: updatedFields.itemName,
      friendName: updatedFields.friendName,
      details: `Updated details for ${updatedFields.itemName || 'item'}`
    });

    showToast({
      message: 'Item details updated successfully!',
      type: 'success'
    });

    setEditingItem(null);
  }, [setItems, viewingItem, logActivity, showToast]);

  const markAsReturned = useCallback((id, dateReturned = getTodayString()) => {
    let returnedItem = null;

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        returnedItem = item;
        const updated = {
          ...item,
          dateReturned: dateReturned || getTodayString(),
          updatedAt: new Date().toISOString()
        };
        if (viewingItem && viewingItem.id === id) {
          setViewingItem(updated);
        }
        return updated;
      }
      return item;
    }));

    // Delightful celebration confetti
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b']
      });
    } catch {
      // Safe fallback
    }

    if (returnedItem) {
      const isLent = (returnedItem.type || 'lent') === 'lent';
      const actionMsg = isLent
        ? `🎉 Great! "${returnedItem.itemName}" has been returned by ${returnedItem.friendName}.`
        : `🎉 Done! "${returnedItem.itemName}" has been returned to ${returnedItem.friendName}.`;

      logActivity({
        type: 'item_returned',
        itemId: id,
        itemName: returnedItem.itemName,
        friendName: returnedItem.friendName,
        details: isLent
          ? `Returned by ${returnedItem.friendName} on ${dateReturned}`
          : `Returned to ${returnedItem.friendName} on ${dateReturned}`
      });

      showToast({
        message: actionMsg,
        type: 'success'
      });
    }
  }, [setItems, viewingItem, logActivity, showToast]);

  const reopenItem = useCallback((id) => {
    let reopenedItem = null;
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        reopenedItem = item;
        const updated = {
          ...item,
          dateReturned: null,
          updatedAt: new Date().toISOString()
        };
        if (viewingItem && viewingItem.id === id) {
          setViewingItem(updated);
        }
        return updated;
      }
      return item;
    }));

    if (reopenedItem) {
      logActivity({
        type: 'item_reopened',
        itemId: id,
        itemName: reopenedItem.itemName,
        friendName: reopenedItem.friendName,
        details: 'Reopened item; marked back to active status'
      });

      showToast({
        message: `"${reopenedItem.itemName}" has been marked back to active.`,
        type: 'info'
      });
    }
  }, [setItems, viewingItem, logActivity, showToast]);

  const deleteItem = useCallback((id) => {
    const itemToDelete = (items || []).find(i => i.id === id);
    if (!itemToDelete) return;

    setItems(prev => prev.filter(i => i.id !== id));

    if (viewingItem && viewingItem.id === id) {
      setViewingItem(null);
    }

    logActivity({
      type: 'item_deleted',
      itemId: id,
      itemName: itemToDelete.itemName,
      friendName: itemToDelete.friendName,
      details: `Deleted "${itemToDelete.itemName}"`
    });

    showToast({
      message: `Deleted "${itemToDelete.itemName}".`,
      type: 'warning',
      actionLabel: 'Undo',
      duration: 6000,
      onAction: () => {
        setItems(prev => [itemToDelete, ...prev]);
        logActivity({
          type: 'item_restored',
          itemId: itemToDelete.id,
          itemName: itemToDelete.itemName,
          friendName: itemToDelete.friendName,
          details: `Restored "${itemToDelete.itemName}"`
        });
        showToast({
          message: `Restored "${itemToDelete.itemName}"!`,
          type: 'success'
        });
      }
    });
  }, [items, viewingItem, setItems, logActivity, showToast]);

  const sendReminder = useCallback((itemId, { message, tone, channel = 'whatsapp' }) => {
    const item = (items || []).find(i => i.id === itemId);
    if (!item) return;

    const today = getTodayString();
    setItems(prev => prev.map(i => {
      if (i.id === itemId) {
        const updated = {
          ...i,
          remindersSentCount: (i.remindersSentCount || 0) + 1,
          lastReminderDate: today,
          updatedAt: new Date().toISOString()
        };
        if (viewingItem && viewingItem.id === itemId) {
          setViewingItem(updated);
        }
        return updated;
      }
      return i;
    }));

    const isLent = (item.type || 'lent') === 'lent';
    logActivity({
      type: 'reminder_sent',
      itemId: item.id,
      itemName: item.itemName,
      friendName: item.friendName,
      details: isLent
        ? `Generated ${tone || 'polite'} reminder for ${item.friendName}`
        : `Generated return reminder note for ${item.friendName}`
    });

    showToast({
      message: isLent ? `Reminder message ready for ${item.friendName}!` : `Reminder note created!`,
      type: 'success'
    });

    setRemindingItem(null);
  }, [items, viewingItem, setItems, logActivity, showToast]);

  // Notifications actions
  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, [setNotifications]);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast({ message: 'All notifications marked as read', type: 'info' });
  }, [setNotifications, showToast]);

  const snoozeNotification = useCallback((id, days = 1) => {
    const snoozeUntil = addDays(getTodayString(), days);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, snoozedUntil: snoozeUntil } : n));
    showToast({ message: `Alert snoozed until tomorrow (${snoozeUntil})`, type: 'info' });
  }, [setNotifications, showToast]);

  // Clear demo data / Reset data
  const resetToDemoData = useCallback(() => {
    const demo = generateSampleData();
    setFriends(demo.friends);
    setItems(demo.items);
    setActivities(demo.activities);
    setNotifications(demo.notifications);
    showToast({ message: 'Reset to demo sample data successfully!', type: 'success' });
  }, [setFriends, setItems, setActivities, setNotifications, showToast]);

  const clearAllData = useCallback(() => {
    setFriends([]);
    setItems([]);
    setActivities([]);
    setNotifications([]);
    showToast({ message: 'All records cleared!', type: 'info' });
  }, [setFriends, setItems, setActivities, setNotifications, showToast]);

  const importBackupData = useCallback((importedData) => {
    if (!importedData || typeof importedData !== 'object') {
      showToast({ message: 'Invalid backup file format.', type: 'error' });
      return false;
    }
    if (Array.isArray(importedData.friends)) setFriends(importedData.friends);
    if (Array.isArray(importedData.items)) setItems(importedData.items);
    if (Array.isArray(importedData.activities)) setActivities(importedData.activities);
    if (Array.isArray(importedData.notifications)) setNotifications(importedData.notifications);
    if (importedData.userProfile) setUserProfile(importedData.userProfile);

    showToast({ message: 'Backup successfully restored!', type: 'success' });
    logActivity({
      type: 'backup_restored',
      details: `Restored data with ${importedData.items?.length || 0} items and ${importedData.friends?.length || 0} friends.`
    });
    return true;
  }, [setFriends, setItems, setActivities, setNotifications, setUserProfile, showToast, logActivity]);

  // ==========================================
  // COMPUTED DASHBOARD METRICS & LISTS
  // ==========================================
  const dashboardStats = useMemo(() => {
    const allItems = items || [];
    const totalItems = allItems.length;

    let totalLent = 0;
    let activeLent = 0;
    let returnedLent = 0;
    let overdueLent = 0;
    let dueSoonLent = 0;
    let dueTodayLent = 0;

    let totalBorrowed = 0;
    let activeBorrowed = 0;
    let returnedBorrowed = 0;
    let overdueBorrowed = 0;
    let dueSoonBorrowed = 0;
    let dueTodayBorrowed = 0;

    const overdueItems = [];
    const dueSoonItems = [];
    const dueTodayItems = [];
    const returnedItems = [];
    const activeItems = [];

    // Distinct lists for dashboard sections
    const upcomingBorrowedToReturn = [];
    const overdueBorrowedToReturn = [];
    const lentItemsDueFromFriends = [];

    allItems.forEach(item => {
      const status = calculateItemStatus(item);
      const isLent = (item.type || 'lent') === 'lent';
      const itemWithStatus = { ...item, statusInfo: status };

      if (isLent) {
        totalLent++;
        if (status.key === 'returned') {
          returnedLent++;
        } else {
          activeLent++;
          if (status.key === 'overdue') {
            overdueLent++;
            lentItemsDueFromFriends.push(itemWithStatus);
          } else if (status.key === 'due-today') {
            dueTodayLent++;
            lentItemsDueFromFriends.push(itemWithStatus);
          } else if (status.key === 'due-soon') {
            dueSoonLent++;
            lentItemsDueFromFriends.push(itemWithStatus);
          }
        }
      } else {
        totalBorrowed++;
        if (status.key === 'returned') {
          returnedBorrowed++;
        } else {
          activeBorrowed++;
          if (status.key === 'overdue') {
            overdueBorrowed++;
            overdueBorrowedToReturn.push(itemWithStatus);
          } else if (status.key === 'due-today') {
            dueTodayBorrowed++;
            upcomingBorrowedToReturn.push(itemWithStatus);
          } else if (status.key === 'due-soon') {
            dueSoonBorrowed++;
            upcomingBorrowedToReturn.push(itemWithStatus);
          }
        }
      }

      // Overall collections
      if (status.key === 'returned') {
        returnedItems.push(itemWithStatus);
      } else if (status.key === 'overdue') {
        overdueItems.push(itemWithStatus);
        activeItems.push(itemWithStatus);
      } else if (status.key === 'due-today') {
        dueTodayItems.push(itemWithStatus);
        activeItems.push(itemWithStatus);
      } else if (status.key === 'due-soon') {
        dueSoonItems.push(itemWithStatus);
        activeItems.push(itemWithStatus);
      } else {
        activeItems.push(itemWithStatus);
      }
    });

    const activeCount = activeLent + activeBorrowed;
    const overdueCount = overdueLent + overdueBorrowed;
    const dueSoonCount = dueSoonLent + dueSoonBorrowed;
    const dueTodayCount = dueTodayLent + dueTodayBorrowed;
    const returnedCount = returnedLent + returnedBorrowed;

    // Sort upcoming deadlines
    const upcomingDeadlines = [...dueTodayItems, ...dueSoonItems, ...overdueItems].sort((a, b) => {
      return a.statusInfo.daysDiff - b.statusInfo.daysDiff;
    });

    // Unread and non-snoozed notifications
    const today = getTodayString();
    const activeNotifications = (notifications || []).filter(n => {
      if (!n.snoozedUntil) return true;
      return n.snoozedUntil <= today;
    });
    const unreadNotificationCount = activeNotifications.filter(n => !n.isRead).length;

    return {
      totalItems,
      activeCount,
      dueSoonCount,
      dueTodayCount,
      overdueCount,
      returnedCount,
      // Direction-specific breakdown
      totalLent,
      activeLent,
      returnedLent,
      overdueLent,
      dueSoonLent,
      dueTodayLent,
      totalBorrowed,
      activeBorrowed,
      returnedBorrowed,
      overdueBorrowed,
      dueSoonBorrowed,
      dueTodayBorrowed,
      // Grouped lists
      overdueItems,
      dueSoonItems,
      dueTodayItems,
      returnedItems,
      activeItems,
      upcomingDeadlines,
      upcomingBorrowedToReturn,
      overdueBorrowedToReturn,
      lentItemsDueFromFriends,
      activeNotifications,
      unreadNotificationCount
    };
  }, [items, notifications]);

  // ==========================================
  // FRIENDS SUMMARY ENHANCED WITH TRANSACTIONS
  // ==========================================
  const friendsSummary = useMemo(() => {
    const friendList = friends || [];
    const allItems = items || [];

    // Map existing friends
    const summaryList = friendList.map(friend => {
      // Find all items linked to this friend
      const friendItems = allItems.filter(item => {
        if (item.friendId) return item.friendId === friend.id;
        return (item.friendName || '').trim().toLowerCase() === friend.name.trim().toLowerCase();
      });

      const lentItems = [];
      const borrowedItems = [];
      let lentActive = 0;
      let lentReturned = 0;
      let lentOverdue = 0;
      let borrowedActive = 0;
      let borrowedReturned = 0;
      let borrowedOverdue = 0;

      friendItems.forEach(item => {
        const status = calculateItemStatus(item);
        const enhanced = { ...item, statusInfo: status };
        const isLent = (item.type || 'lent') === 'lent';

        if (isLent) {
          lentItems.push(enhanced);
          if (status.key === 'returned') {
            lentReturned++;
          } else {
            lentActive++;
            if (status.key === 'overdue') lentOverdue++;
          }
        } else {
          borrowedItems.push(enhanced);
          if (status.key === 'returned') {
            borrowedReturned++;
          } else {
            borrowedActive++;
            if (status.key === 'overdue') borrowedOverdue++;
          }
        }
      });

      const totalItems = friendItems.length;
      const activeCount = lentActive + borrowedActive;
      const overdueCount = lentOverdue + borrowedOverdue;
      const returnedCount = lentReturned + borrowedReturned;

      return {
        ...friend,
        items: friendItems,
        lentItems,
        borrowedItems,
        totalItems,
        lentTotal: lentItems.length,
        lentActive,
        lentReturned,
        lentOverdue,
        borrowedTotal: borrowedItems.length,
        borrowedActive,
        borrowedReturned,
        borrowedOverdue,
        activeCount,
        overdueCount,
        returnedCount,
        contact: friend.phone || friend.email || ''
      };
    });

    return summaryList;
  }, [friends, items]);

  // Quick helper to open confirm modal
  const openConfirmDialog = useCallback(({ title, message, confirmText = 'Confirm', onConfirm, isDanger = false }) => {
    setConfirmDialog({
      title,
      message,
      confirmText,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setConfirmDialog(null);
      },
      isDanger
    });
  }, []);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  // Modal open helpers
  const openAddModal = useCallback((config = {}) => {
    // config can be string 'lent'|'borrowed' or object { type, friendId }
    if (typeof config === 'string') {
      setAddModalConfig({ type: config, friendId: null });
    } else if (typeof config === 'object' && config !== null) {
      setAddModalConfig({
        type: config.type || 'lent',
        friendId: config.friendId || null
      });
    } else {
      setAddModalConfig({ type: 'lent', friendId: null });
    }
    setIsAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const openFriendModal = useCallback((friend = null) => {
    setEditingFriend(friend);
    setIsFriendModalOpen(true);
  }, []);

  const closeFriendModal = useCallback(() => {
    setIsFriendModalOpen(false);
    setEditingFriend(null);
  }, []);

  const openFriendProfile = useCallback((friend) => {
    setViewingFriend(friend);
  }, []);

  const closeFriendProfile = useCallback(() => {
    setViewingFriend(null);
  }, []);

  const value = {
    // Items
    items,
    setItems,
    addItem,
    updateItem,
    deleteItem,
    markAsReturned,
    reopenItem,
    sendReminder,
    // Friends
    friends,
    setFriends,
    addFriend,
    updateFriend,
    deleteFriend,
    friendsSummary,
    // Notifications & Activity
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    snoozeNotification,
    activities,
    logActivity,
    clearActivityHistory: () => setActivities([]),
    // Preferences & Theme
    theme,
    setTheme,
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
    userProfile,
    setUserProfile,
    // Sample Data Actions
    resetToDemoData,
    clearAllData,
    importBackupData,
    // Stats & Summaries
    dashboardStats,
    // Item Modals
    isAddModalOpen,
    addModalConfig,
    openAddModal,
    closeAddModal,
    editingItem,
    openEditModal: (item) => setEditingItem(item),
    closeEditModal: () => setEditingItem(null),
    viewingItem,
    openDetailsModal: (item) => setViewingItem(item),
    closeDetailsModal: () => setViewingItem(null),
    remindingItem,
    openReminderModal: (item) => setRemindingItem(item),
    closeReminderModal: () => setRemindingItem(null),
    // Friend Modals
    isFriendModalOpen,
    editingFriend,
    openFriendModal,
    closeFriendModal,
    viewingFriend,
    openFriendProfile,
    closeFriendProfile,
    // Confirm Dialog & Global Search
    confirmDialog,
    openConfirmDialog,
    closeConfirmDialog,
    isGlobalSearchOpen,
    openGlobalSearch: () => setIsGlobalSearchOpen(true),
    closeGlobalSearch: () => setIsGlobalSearchOpen(false),
    // Toast system
    toasts,
    showToast,
    hideToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
