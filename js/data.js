/**
 * Data Module - Hardcoded Data & Constants
 * Schedule Management App
 */

// ========================================
// ADMIN CREDENTIALS
// ========================================
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'demo123'
};

// ========================================
// TIME SLOTS DEFINITION
// ========================================
const TIME_SLOTS = [
  { id: 1, label: '8:00 AM - 10:00 AM', shortLabel: '8-10 AM', start: '08:00', end: '10:00' },
  { id: 2, label: '10:00 AM - 12:00 PM', shortLabel: '10-12 PM', start: '10:00', end: '12:00' },
  { id: 3, label: '12:00 PM - 2:00 PM', shortLabel: '12-2 PM', start: '12:00', end: '14:00' },
  { id: 4, label: '2:00 PM - 4:00 PM', shortLabel: '2-4 PM', start: '14:00', end: '16:00' },
  { id: 5, label: '4:00 PM - 6:00 PM', shortLabel: '4-6 PM', start: '16:00', end: '18:00' },
  { id: 6, label: '6:00 PM - 8:00 PM', shortLabel: '6-8 PM', start: '18:00', end: '20:00' }
];

// ========================================
// DAYS OF THE WEEK
// ========================================
const DAYS = [
  { id: 1, name: 'Monday', shortName: 'Mon' },
  { id: 2, name: 'Tuesday', shortName: 'Tue' },
  { id: 3, name: 'Wednesday', shortName: 'Wed' },
  { id: 4, name: 'Thursday', shortName: 'Thu' },
  { id: 5, name: 'Friday', shortName: 'Fri' },
  { id: 6, name: 'Saturday', shortName: 'Sat' },
  { id: 7, name: 'Sunday', shortName: 'Sun' }
];

// ========================================
// BOOKING STATUS ENUM
// ========================================
const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// ========================================
// INITIAL DEMO BOOKINGS
// ========================================
const INITIAL_BOOKINGS = [
  {
    id: 1,
    name: 'John Doe',
    phone: '0123456789',
    dayId: 1, // Monday
    slotId: 2, // 10:00 AM - 12:00 PM
    status: BOOKING_STATUS.APPROVED,
    createdAt: '2026-01-04T10:30:00'
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '0112345678',
    dayId: 3, // Wednesday
    slotId: 4, // 2:00 PM - 4:00 PM
    status: BOOKING_STATUS.APPROVED,
    createdAt: '2026-01-04T11:15:00'
  },
  {
    id: 3,
    name: 'Bob Wilson',
    phone: '0198765432',
    dayId: 5, // Friday
    slotId: 1, // 8:00 AM - 10:00 AM
    status: BOOKING_STATUS.PENDING,
    createdAt: '2026-01-05T09:00:00'
  },
  {
    id: 4,
    name: 'Alice Johnson',
    phone: '0167891234',
    dayId: 2, // Tuesday
    slotId: 5, // 4:00 PM - 6:00 PM
    status: BOOKING_STATUS.PENDING,
    createdAt: '2026-01-05T14:30:00'
  },
  {
    id: 5,
    name: 'Charlie Brown',
    phone: '0145678901',
    dayId: 4, // Thursday
    slotId: 3, // 12:00 PM - 2:00 PM
    status: BOOKING_STATUS.REJECTED,
    createdAt: '2026-01-03T16:45:00'
  },
  {
    id: 6,
    name: 'Diana Prince',
    phone: '0134567890',
    dayId: 6, // Saturday
    slotId: 2, // 10:00 AM - 12:00 PM
    status: BOOKING_STATUS.APPROVED,
    createdAt: '2026-01-04T08:20:00'
  },
  {
    id: 7,
    name: 'Edward Norton',
    phone: '0187654321',
    dayId: 7, // Sunday
    slotId: 6, // 6:00 PM - 8:00 PM
    status: BOOKING_STATUS.PENDING,
    createdAt: '2026-01-05T18:10:00'
  }
];

// ========================================
// APPLICATION STATE
// ========================================
let appState = {
  bookings: [],
  currentFilter: 'all',
  selectedDay: 1, // For mobile view (Monday by default)
  isAuthenticated: false
};

// ========================================
// STORAGE KEYS
// ========================================
const STORAGE_KEYS = {
  BOOKINGS: 'scheduleApp_bookings',
  AUTH: 'scheduleApp_auth'
};

// ========================================
// SVG ICONS (Inline for simplicity)
// ========================================
const ICONS = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>`,

  calendar: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>`,

  clipboard: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>`,

  logout: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>`,

  check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
  </svg>`,

  x: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>`,

  eye: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>`,

  phone: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>`,

  clock: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,

  user: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>`,

  users: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>`,

  chartBar: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>`,

  chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
  </svg>`,

  menu: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>`
};

// ========================================
// HELPER: Get Icon HTML
// ========================================
function getIcon(name) {
  return ICONS[name] || '';
}

// ========================================
// HELPER: Get Slot by ID
// ========================================
function getSlotById(slotId) {
  return TIME_SLOTS.find(slot => slot.id === slotId);
}

// ========================================
// HELPER: Get Day by ID
// ========================================
function getDayById(dayId) {
  return DAYS.find(day => day.id === dayId);
}

// ========================================
// HELPER: Get Slot Label
// ========================================
function getSlotLabel(slotId, short = false) {
  const slot = getSlotById(slotId);
  return slot ? (short ? slot.shortLabel : slot.label) : '';
}

// ========================================
// HELPER: Get Day Name
// ========================================
function getDayName(dayId, short = false) {
  const day = getDayById(dayId);
  return day ? (short ? day.shortName : day.name) : '';
}
