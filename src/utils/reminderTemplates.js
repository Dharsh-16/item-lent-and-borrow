/**
 * Reminder message generator and templates for Lent and Borrowed items
 */

export const REMINDER_TONES = [
  {
    id: 'polite',
    name: 'Polite & Standard',
    description: 'Professional and courteous, great for general items'
  },
  {
    id: 'friendly',
    name: 'Casual & Friendly',
    description: 'Warm and casual nudge for close friends'
  },
  {
    id: 'urgent',
    name: 'Firm & Urgent',
    description: 'Direct and time-sensitive for overdue or important items'
  }
];

export function generateReminderMessage({
  tone = 'polite',
  friendName = 'Friend',
  itemName = 'the item',
  expectedDate = '',
  status = 'active',
  daysDiff = 0,
  userName = 'I',
  type = 'lent' // 'lent' | 'borrowed'
}) {
  const isOverdue = status === 'overdue' || daysDiff < 0;
  const isDueToday = status === 'due-today' || daysDiff === 0;
  const daysOverdue = Math.abs(daysDiff);

  // --- BORROWED ITEMS (Items I borrowed from a friend that I need to return) ---
  if (type === 'borrowed') {
    if (tone === 'friendly') {
      if (isOverdue) {
        return `Hey ${friendName}! Just wanted to let you know I haven't forgotten about your ${itemName}. It was due on ${expectedDate} (${daysOverdue} days ago), sorry for the delay! When are you free so I can return it to you? 🙌`;
      }
      if (isDueToday) {
        return `Hey ${friendName}! Quick note that your ${itemName} is due back today. Let me know where and when works for you to meet up so I can hand it over! 😊`;
      }
      return `Hey ${friendName}! Thanks again for lending me the ${itemName}. Just confirming I have scheduled to return it to you by ${expectedDate}! 👍`;
    }

    if (tone === 'urgent') {
      if (isOverdue) {
        return `Reminder for you: Please return ${itemName} to ${friendName} immediately! (Expected by: ${expectedDate}, currently ${daysOverdue} days overdue).`;
      }
      if (isDueToday) {
        return `Reminder for you: Please return ${itemName} to ${friendName} today (${expectedDate}).`;
      }
      return `Reminder for you: Return ${itemName} to ${friendName} by ${expectedDate}.`;
    }

    // Default: polite
    if (isOverdue) {
      return `Reminder for you: Please return ${itemName} to ${friendName} as soon as possible. Was due on ${expectedDate} (${daysOverdue} days overdue).`;
    }
    if (isDueToday) {
      return `Reminder for you: Please return ${itemName} to ${friendName} today (${expectedDate}).`;
    }
    return `Reminder for you: Please return ${itemName} to ${friendName} by ${expectedDate}.`;
  }

  // --- LENT ITEMS (Items I gave to a friend that they need to return to me) ---
  if (tone === 'friendly') {
    if (isOverdue) {
      return `Hey ${friendName}! Hope you're doing well 😊 Just checking in about the ${itemName}. It was due back around ${expectedDate} (${daysOverdue} days ago). Whenever you're free, could you please drop it off? Thanks so much!`;
    }
    if (isDueToday) {
      return `Hey ${friendName}! Quick reminder that the ${itemName} is due back today. Let me know if you're around so we can meet up! 🙌`;
    }
    return `Hey ${friendName}! Hope you're enjoying the ${itemName}! Just wanted to gently remind you that the return date is coming up on ${expectedDate}. Let me know if that schedule still works for you! 😊`;
  }

  if (tone === 'urgent') {
    if (isOverdue) {
      return `Hi ${friendName}, this is an urgent reminder regarding the ${itemName}. It is currently overdue by ${daysOverdue} days (expected: ${expectedDate}). I need it back as soon as possible. Please let me know when we can arrange the handover today.`;
    }
    if (isDueToday) {
      return `Hi ${friendName}, reminder that the ${itemName} is due back today (${expectedDate}). Please confirm when and where we can meet to return it.`;
    }
    return `Hi ${friendName}, please note that the ${itemName} is expected back on ${expectedDate}. I will be needing it right after, so please ensure it is ready for return. Thank you.`;
  }

  // Default: polite
  if (isOverdue) {
    return `Reminder: ${friendName}, please return ${itemName} (was due on ${expectedDate}, ${daysOverdue} days overdue). Could you please let me know when it might be convenient for you to return it? Thank you!`;
  }
  if (isDueToday) {
    return `Reminder: ${friendName}, please return ${itemName} by today (${expectedDate}). Please let me know what time works best for you. Thanks!`;
  }
  return `Reminder: ${friendName}, please return ${itemName} by ${expectedDate}. Hope everything is going well! Let me know if you need an extension.`;
}

/**
 * Creates a clean WhatsApp Web / App link with encoded text
 */
export function buildWhatsAppLink(contactNumber, message) {
  if (!contactNumber) return null;
  const cleaned = contactNumber.replace(/[^0-9]/g, '');
  if (!cleaned) return null;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encodedMessage}`;
}
