/**
 * Export and Import utilities for CSV & JSON
 */
import { calculateItemStatus } from './dateUtils';

export function exportItemsToCSV(items) {
  if (!items || items.length === 0) return;

  const headers = [
    'ID',
    'Direction',
    'Item Name',
    'Category',
    'Friend / Owner Name',
    'Contact',
    'Date Recorded',
    'Expected Return Date',
    'Date Returned',
    'Status',
    'Priority',
    'Reminders Sent',
    'Description',
    'Notes'
  ];

  const rows = items.map(item => {
    const statusObj = calculateItemStatus(item);
    const direction = item.type === 'borrowed' ? "I've Borrowed" : "I've Lent";
    const dateStart = item.type === 'borrowed' ? (item.dateBorrowed || item.dateLent || '') : (item.dateLent || '');

    return [
      item.id,
      `"${direction}"`,
      `"${(item.itemName || '').replace(/"/g, '""')}"`,
      `"${item.category || ''}"`,
      `"${(item.friendName || '').replace(/"/g, '""')}"`,
      `"${item.contact || ''}"`,
      dateStart,
      item.expectedReturnDate || '',
      item.dateReturned || '',
      statusObj.label,
      item.priority || 'Normal',
      item.remindersSentCount || 0,
      `"${(item.description || '').replace(/"/g, '""')}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ReturnReminder_All_Items_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportBackupJSON(data) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ReturnReminder_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
