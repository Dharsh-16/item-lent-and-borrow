/**
 * Realistic sample data seeded dynamically relative to today's date
 */
import { getTodayString, addDays } from './dateUtils';

export const CATEGORIES = [
  { id: 'Books', label: 'Books', color: '#6366f1', icon: 'BookOpen' },
  { id: 'Electronics', label: 'Electronics', color: '#0ea5e9', icon: 'Laptop' },
  { id: 'Clothing', label: 'Clothing', color: '#ec4899', icon: 'Shirt' },
  { id: 'Accessories', label: 'Accessories', color: '#8b5cf6', icon: 'Watch' },
  { id: 'Sports', label: 'Sports', color: '#10b981', icon: 'Trophy' },
  { id: 'Money', label: 'Money', color: '#f59e0b', icon: 'Coins' },
  { id: 'Other', label: 'Other', color: '#64748b', icon: 'Package' }
];

export const PRIORITIES = [
  { id: 'Normal', label: 'Normal', color: '#64748b' },
  { id: 'Important', label: 'Important', color: '#f59e0b' },
  { id: 'Urgent', label: 'Urgent', color: '#ef4444' }
];

export function generateSampleData() {
  const today = getTodayString();

  const friends = [
    {
      id: 'friend-101',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@example.com',
      notes: 'College classmate and study partner for CS courses.',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 86400000).toISOString()
    },
    {
      id: 'friend-102',
      name: 'Priya Patel',
      phone: '+91 98220 12345',
      email: 'priya.patel@example.com',
      notes: 'Colleague on the UI/UX design team.',
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 86400000).toISOString()
    },
    {
      id: 'friend-103',
      name: 'Meera Nair',
      phone: '+91 98111 22334',
      email: 'meera.nair@example.com',
      notes: 'Mathematics & statistics study group friend.',
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 'friend-104',
      name: 'Arjun Verma',
      phone: '+91 97654 32109',
      email: 'arjun.verma@example.com',
      notes: 'Hostel sports captain and basketball teammate.',
      createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 18 * 86400000).toISOString()
    },
    {
      id: 'friend-105',
      name: 'Karthik Rao',
      phone: '+91 99887 76655',
      email: 'karthik.rao@example.com',
      notes: 'Weekend trekking and hiking adventure buddy.',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 86400000).toISOString()
    },
    {
      id: 'friend-106',
      name: 'Ananya Sen',
      phone: '+91 98450 98450',
      email: 'ananya.sen@example.com',
      notes: 'Campus photography and media club lead.',
      createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 28 * 86400000).toISOString()
    },
    {
      id: 'friend-107',
      name: 'Vikram Joshi',
      phone: '+91 91234 56789',
      email: 'vikram.joshi@example.com',
      notes: 'Outdoor gear enthusiast and camp organiser.',
      createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 35 * 86400000).toISOString()
    }
  ];

  const items = [
    // --- ITEMS I'VE LENT (Gave to friends) ---
    {
      id: 'item-101',
      type: 'lent',
      itemName: 'Operating Systems Textbook',
      category: 'Books',
      friendId: 'friend-101',
      friendName: 'Rahul Sharma',
      contact: '+91 98765 43210',
      dateLent: addDays(today, -16),
      expectedReturnDate: addDays(today, -4), // Overdue by 4 days
      dateReturned: null,
      description: 'Hardcover 10th edition for semester exam prep. Has sticky notes inside.',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      priority: 'Urgent',
      notes: 'Rahul mentioned he needed it for CS302 lab exams.',
      remindersSentCount: 1,
      lastReminderDate: addDays(today, -2),
      createdAt: new Date(Date.now() - 16 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'item-102',
      type: 'lent',
      itemName: 'Wireless Noise-Canceling Headphones',
      category: 'Electronics',
      friendId: 'friend-102',
      friendName: 'Priya Patel',
      contact: '+91 98220 12345',
      dateLent: addDays(today, -7),
      expectedReturnDate: today, // Due Today!
      dateReturned: null,
      description: 'Sony WH-1000XM4 matte black with protective travel case and aux cable.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      priority: 'Important',
      notes: 'Borrowed for a video editing sprint over the weekend.',
      remindersSentCount: 0,
      lastReminderDate: null,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: 'item-103',
      type: 'lent',
      itemName: 'Casio Scientific Calculator',
      category: 'Electronics',
      friendId: 'friend-103',
      friendName: 'Meera Nair',
      contact: '+91 98111 22334',
      dateLent: addDays(today, -5),
      expectedReturnDate: addDays(today, 2), // Due in 2 days (Due Soon)
      dateReturned: null,
      description: 'Casio fx-991EX ClassWiz with natural textbook display.',
      imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
      priority: 'Normal',
      notes: 'Needed for statistics calculations in engineering math.',
      remindersSentCount: 0,
      lastReminderDate: null,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'item-104',
      type: 'lent',
      itemName: 'Spalding Composite Basketball',
      category: 'Sports',
      friendId: 'friend-104',
      friendName: 'Arjun Verma',
      contact: '+91 97654 32109',
      dateLent: addDays(today, -3),
      expectedReturnDate: addDays(today, 6), // Active
      dateReturned: null,
      description: 'Official size 7 indoor/outdoor ball with mini pump needle.',
      imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=600&q=80',
      priority: 'Normal',
      notes: 'Lent for the college inter-hostel tournament matches.',
      remindersSentCount: 0,
      lastReminderDate: null,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'item-105',
      type: 'lent',
      itemName: 'Anker Power Bank (20,000 mAh)',
      category: 'Electronics',
      friendId: 'friend-105',
      friendName: 'Karthik Rao',
      contact: '+91 99887 76655',
      dateLent: addDays(today, -2),
      expectedReturnDate: addDays(today, 10), // Active
      dateReturned: null,
      description: 'High capacity fast charging brick with Type-C braided cable.',
      imageUrl: 'https://images.unsplash.com/photo-1609592426804-0ee061801267?auto=format&fit=crop&w=600&q=80',
      priority: 'Important',
      notes: 'Karthik is on a weekend trekking trip to Western Ghats.',
      remindersSentCount: 0,
      lastReminderDate: null,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'item-106',
      type: 'lent',
      itemName: 'Sony 50mm f/1.8 Prime Lens',
      category: 'Electronics',
      friendId: 'friend-106',
      friendName: 'Ananya Sen',
      contact: '+91 98450 98450',
      dateLent: addDays(today, -20),
      expectedReturnDate: addDays(today, -5),
      dateReturned: addDays(today, -3), // Returned safely
      description: 'E-mount full frame prime lens with UV filter attached.',
      imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=600&q=80',
      priority: 'Important',
      notes: 'Returned in pristine condition with lens hood and cap.',
      remindersSentCount: 1,
      lastReminderDate: addDays(today, -6),
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'item-107',
      type: 'lent',
      itemName: 'Quechua 3-Person Waterproof Tent',
      category: 'Sports',
      friendId: 'friend-107',
      friendName: 'Vikram Joshi',
      contact: '+91 91234 56789',
      dateLent: addDays(today, -32),
      expectedReturnDate: addDays(today, -15),
      dateReturned: addDays(today, -14), // Returned safely
      description: 'Fresh & Black pop-up camping tent with ground pegs and rain cover.',
      imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
      priority: 'Normal',
      notes: 'Returned washed and dried after the Coorg camp.',
      remindersSentCount: 0,
      lastReminderDate: null,
      createdAt: new Date(Date.now() - 32 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 86400000).toISOString()
    },

    // --- ITEMS I'VE BORROWED (Friends gave to me) ---
    {
      id: 'item-201',
      type: 'borrowed',
      itemName: 'MacBook Pro 96W USB-C Fast Charger',
      category: 'Electronics',
      friendId: 'friend-101',
      friendName: 'Rahul Sharma',
      contact: '+91 98765 43210',
      dateLent: addDays(today, -4),
      dateBorrowed: addDays(today, -4),
      expectedReturnDate: addDays(today, 3), // Due in 3 days (Due Soon)
      dateReturned: null,
      description: 'Original Apple 96W power adapter with 2m USB-C charge cable.',
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
      priority: 'Important',
      notes: 'Borrowed while my charger was ordered from Apple store.',
      remindersSentCount: 0,
      lastReminderDate: null,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'item-202',
      type: 'borrowed',
      itemName: 'Heavy-Duty Aluminum Camera Tripod',
      category: 'Accessories',
      friendId: 'friend-106',
      friendName: 'Ananya Sen',
      contact: '+91 98450 98450',
      dateLent: addDays(today, -12),
      dateBorrowed: addDays(today, -12),
      expectedReturnDate: addDays(today, -2), // Overdue by 2 days (Need to return to Ananya!)
      dateReturned: null,
      description: 'Manfrotto tripod with fluid video head and quick-release plate.',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
      priority: 'Urgent',
      notes: 'Used for annual festival documentary shooting.',
      remindersSentCount: 0,
      lastReminderDate: null,
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'item-203',
      type: 'borrowed',
      itemName: 'Yonex Carbonex Badminton Racket Set',
      category: 'Sports',
      friendId: 'friend-104',
      friendName: 'Arjun Verma',
      contact: '+91 97654 32109',
      dateLent: addDays(today, -6),
      dateBorrowed: addDays(today, -6),
      expectedReturnDate: today, // Due today!
      dateReturned: null,
      description: 'Pair of graphite rackets with padded cover and 3 nylon shuttles.',
      imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
      priority: 'Normal',
      notes: 'Arjun needs them back for weekend practice.',
      remindersSentCount: 0,
      lastReminderDate: null,
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: 'item-204',
      type: 'borrowed',
      itemName: 'Winter Thermal Sleeping Bag (-5°C)',
      category: 'Sports',
      friendId: 'friend-107',
      friendName: 'Vikram Joshi',
      contact: '+91 91234 56789',
      dateLent: addDays(today, -24),
      dateBorrowed: addDays(today, -24),
      expectedReturnDate: addDays(today, -10),
      dateReturned: addDays(today, -9), // Safely returned
      description: 'Mummy-style insulated down bag with compression stuff sack.',
      imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
      priority: 'Normal',
      notes: 'Dry cleaned and returned with storage sack.',
      remindersSentCount: 0,
      lastReminderDate: null,
      createdAt: new Date(Date.now() - 24 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 9 * 86400000).toISOString()
    }
  ];

  const activities = [
    {
      id: 'act-1',
      type: 'item_returned',
      itemId: 'item-106',
      itemName: 'Sony 50mm f/1.8 Prime Lens',
      friendName: 'Ananya Sen',
      details: 'Marked as returned. Item received back in good condition.',
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'act-2',
      type: 'reminder_sent',
      itemId: 'item-101',
      itemName: 'Operating Systems Textbook',
      friendName: 'Rahul Sharma',
      details: 'Sent friendly reminder via WhatsApp message draft.',
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'act-3',
      type: 'item_created',
      itemId: 'item-201',
      itemName: 'MacBook Pro 96W USB-C Fast Charger',
      friendName: 'Rahul Sharma',
      details: 'Recorded borrowed item from Rahul Sharma (due in 3 days).',
      timestamp: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'act-4',
      type: 'item_created',
      itemId: 'item-105',
      itemName: 'Anker Power Bank (20,000 mAh)',
      friendName: 'Karthik Rao',
      details: 'Recorded new lent item with return date in 10 days.',
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'act-5',
      type: 'item_created',
      itemId: 'item-104',
      itemName: 'Spalding Composite Basketball',
      friendName: 'Arjun Verma',
      details: 'Recorded lent sports gear for inter-hostel matches.',
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ];

  const notifications = [
    {
      id: 'notif-1',
      itemId: 'item-101',
      type: 'overdue',
      title: 'Lent Item Overdue Alert',
      message: 'Operating Systems Textbook lent to Rahul Sharma was due 4 days ago.',
      isRead: false,
      timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
      snoozedUntil: null
    },
    {
      id: 'notif-2',
      itemId: 'item-202',
      type: 'overdue',
      title: 'Borrowed Item Overdue Alert',
      message: 'Heavy-Duty Aluminum Camera Tripod borrowed from Ananya Sen was due back 2 days ago!',
      isRead: false,
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      snoozedUntil: null
    },
    {
      id: 'notif-3',
      itemId: 'item-102',
      type: 'due_today',
      title: 'Lent Item Due Today',
      message: 'Wireless Noise-Canceling Headphones lent to Priya Patel is due today!',
      isRead: false,
      timestamp: new Date().toISOString(),
      snoozedUntil: null
    },
    {
      id: 'notif-4',
      itemId: 'item-203',
      type: 'due_today',
      title: 'Borrowed Item Due Today',
      message: 'Yonex Badminton Racket Set borrowed from Arjun Verma needs to be returned today!',
      isRead: false,
      timestamp: new Date().toISOString(),
      snoozedUntil: null
    }
  ];

  return { friends, items, activities, notifications };
}
