/**
 * Utils Module - Helper Functions
 * Schedule Management App
 */

const Utils = {
  // ========================================
  // VALIDATION
  // ========================================

  /**
   * Validate name input
   * @param {string} name - Name to validate
   * @returns {Object} { valid: boolean, error: string }
   */
  validateName(name) {
    if (!name || name.trim() === '') {
      return { valid: false, error: 'Name is required' };
    }
    if (name.trim().length < 2) {
      return { valid: false, error: 'Name must be at least 2 characters' };
    }
    if (name.trim().length > 50) {
      return { valid: false, error: 'Name must be less than 50 characters' };
    }
    return { valid: true, error: '' };
  },

  /**
   * Validate phone number
   * @param {string} phone - Phone number to validate
   * @returns {Object} { valid: boolean, error: string }
   */
  validatePhone(phone) {
    if (!phone || phone.trim() === '') {
      return { valid: false, error: 'Phone number is required' };
    }
    // Remove spaces, dashes, and parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    // Check if it's mostly digits (allow + at start)
    if (!/^\+?[0-9]{8,15}$/.test(cleaned)) {
      return { valid: false, error: 'Please enter a valid phone number' };
    }
    return { valid: true, error: '' };
  },

  /**
   * Validate booking form
   * @param {string} name - Name input
   * @param {string} phone - Phone input
   * @returns {Object} { valid: boolean, errors: { name: string, phone: string } }
   */
  validateBookingForm(name, phone) {
    const nameResult = this.validateName(name);
    const phoneResult = this.validatePhone(phone);
    return {
      valid: nameResult.valid && phoneResult.valid,
      errors: {
        name: nameResult.error,
        phone: phoneResult.error
      }
    };
  },

  // ========================================
  // SLOT & BOOKING HELPERS
  // ========================================

  /**
   * Check if a specific slot is booked (approved status)
   * @param {number} dayId - Day ID
   * @param {number} slotId - Slot ID
   * @param {Array} bookings - Array of bookings
   * @returns {boolean}
   */
  isSlotBooked(dayId, slotId, bookings) {
    return bookings.some(
      b => b.dayId === dayId &&
           b.slotId === slotId &&
           b.status === BOOKING_STATUS.APPROVED
    );
  },

  /**
   * Check if a slot has any pending booking
   * @param {number} dayId - Day ID
   * @param {number} slotId - Slot ID
   * @param {Array} bookings - Array of bookings
   * @returns {boolean}
   */
  hasSlotPending(dayId, slotId, bookings) {
    return bookings.some(
      b => b.dayId === dayId &&
           b.slotId === slotId &&
           b.status === BOOKING_STATUS.PENDING
    );
  },

  /**
   * Get the booker's name for a specific slot
   * @param {number} dayId - Day ID
   * @param {number} slotId - Slot ID
   * @param {Array} bookings - Array of bookings
   * @returns {string|null} Booker's name or null if not booked
   */
  getBookerName(dayId, slotId, bookings) {
    const booking = bookings.find(
      b => b.dayId === dayId &&
           b.slotId === slotId &&
           b.status === BOOKING_STATUS.APPROVED
    );
    return booking ? booking.name : null;
  },

  /**
   * Get booking for a specific slot
   * @param {number} dayId - Day ID
   * @param {number} slotId - Slot ID
   * @param {Array} bookings - Array of bookings
   * @returns {Object|null} Booking object or null
   */
  getSlotBooking(dayId, slotId, bookings) {
    return bookings.find(
      b => b.dayId === dayId &&
           b.slotId === slotId &&
           b.status === BOOKING_STATUS.APPROVED
    ) || null;
  },

  // ========================================
  // FILTER & COUNT HELPERS
  // ========================================

  /**
   * Filter bookings by status
   * @param {Array} bookings - Array of bookings
   * @param {string} status - Status to filter by ('all' for no filter)
   * @returns {Array} Filtered bookings
   */
  filterBookings(bookings, status) {
    if (status === 'all') return bookings;
    return bookings.filter(b => b.status === status);
  },

  /**
   * Count bookings by status
   * @param {Array} bookings - Array of bookings
   * @param {string} status - Status to count
   * @returns {number}
   */
  countByStatus(bookings, status) {
    return bookings.filter(b => b.status === status).length;
  },

  /**
   * Calculate available slots
   * @param {Array} bookings - Array of bookings
   * @returns {number} Number of available slots
   */
  countAvailableSlots(bookings) {
    const totalSlots = DAYS.length * TIME_SLOTS.length; // 7 * 6 = 42
    const bookedSlots = bookings.filter(b => b.status === BOOKING_STATUS.APPROVED).length;
    return totalSlots - bookedSlots;
  },

  /**
   * Get booking statistics
   * @param {Array} bookings - Array of bookings
   * @returns {Object} Statistics object
   */
  getBookingStats(bookings) {
    return {
      total: bookings.length,
      pending: this.countByStatus(bookings, BOOKING_STATUS.PENDING),
      approved: this.countByStatus(bookings, BOOKING_STATUS.APPROVED),
      rejected: this.countByStatus(bookings, BOOKING_STATUS.REJECTED),
      available: this.countAvailableSlots(bookings)
    };
  },

  // ========================================
  // FORMATTING HELPERS
  // ========================================

  /**
   * Format phone number for display
   * @param {string} phone - Raw phone number
   * @returns {string} Formatted phone number
   */
  formatPhone(phone) {
    if (!phone) return '';
    // Simple formatting: add dashes for Malaysian format
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  },

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Get status badge class
   * @param {string} status - Booking status
   * @returns {string} CSS class name
   */
  getStatusBadgeClass(status) {
    switch (status) {
      case BOOKING_STATUS.PENDING:
        return 'badge-warning';
      case BOOKING_STATUS.APPROVED:
        return 'badge-success';
      case BOOKING_STATUS.REJECTED:
        return 'badge-danger';
      default:
        return 'badge-gray';
    }
  },

  /**
   * Get status display text
   * @param {string} status - Booking status
   * @returns {string} Display text
   */
  getStatusText(status) {
    switch (status) {
      case BOOKING_STATUS.PENDING:
        return 'Pending';
      case BOOKING_STATUS.APPROVED:
        return 'Approved';
      case BOOKING_STATUS.REJECTED:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  },

  // ========================================
  // DOM HELPERS
  // ========================================

  /**
   * Create element with attributes and children
   * @param {string} tag - HTML tag name
   * @param {Object} attrs - Attributes to set
   * @param {Array|string} children - Child elements or text content
   * @returns {HTMLElement}
   */
  createElement(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key.startsWith('data')) {
        element.setAttribute(key.replace(/([A-Z])/g, '-$1').toLowerCase(), value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    });

    if (typeof children === 'string') {
      element.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
          element.appendChild(child);
        }
      });
    }

    return element;
  },

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - 'success', 'error', or 'warning'
   */
  showToast(message, type = 'success') {
    // Get or create toast container
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <span class="toast-close">${getIcon('x')}</span>
    `;

    // Add close handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    // Add to container
    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // ========================================
  // RESPONSIVE HELPERS
  // ========================================

  /**
   * Check if current viewport is mobile
   * @returns {boolean}
   */
  isMobile() {
    return window.innerWidth < 768;
  },

  /**
   * Check if current viewport is desktop
   * @returns {boolean}
   */
  isDesktop() {
    return window.innerWidth >= 768;
  }
};
