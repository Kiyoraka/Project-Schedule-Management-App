/**
 * Storage Module - localStorage Persistence Layer
 * Schedule Management App
 */

const Storage = {
  // ========================================
  // BOOKINGS
  // ========================================

  /**
   * Save bookings to localStorage
   * @param {Array} bookings - Array of booking objects
   */
  saveBookings(bookings) {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      return true;
    } catch (error) {
      console.error('Error saving bookings:', error);
      return false;
    }
  },

  /**
   * Load bookings from localStorage
   * Returns initial demo data if no saved data exists
   * @returns {Array} Array of booking objects
   */
  loadBookings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (saved) {
        return JSON.parse(saved);
      }
      // Return initial demo data and save it
      this.saveBookings(INITIAL_BOOKINGS);
      return [...INITIAL_BOOKINGS];
    } catch (error) {
      console.error('Error loading bookings:', error);
      return [...INITIAL_BOOKINGS];
    }
  },

  /**
   * Add a new booking
   * @param {Object} booking - Booking object (without id)
   * @returns {Object} The created booking with id
   */
  addBooking(booking) {
    const bookings = this.loadBookings();
    const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
    const newBooking = {
      ...booking,
      id: newId,
      status: BOOKING_STATUS.PENDING,
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  },

  /**
   * Update a booking by ID
   * @param {number} id - Booking ID
   * @param {Object} updates - Fields to update
   * @returns {Object|null} Updated booking or null if not found
   */
  updateBooking(id, updates) {
    const bookings = this.loadBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return null;

    bookings[index] = { ...bookings[index], ...updates };
    this.saveBookings(bookings);
    return bookings[index];
  },

  /**
   * Get a single booking by ID
   * @param {number} id - Booking ID
   * @returns {Object|null} Booking object or null
   */
  getBooking(id) {
    const bookings = this.loadBookings();
    return bookings.find(b => b.id === id) || null;
  },

  /**
   * Delete a booking by ID
   * @param {number} id - Booking ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteBooking(id) {
    const bookings = this.loadBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return false;

    bookings.splice(index, 1);
    this.saveBookings(bookings);
    return true;
  },

  // ========================================
  // AUTHENTICATION
  // ========================================

  /**
   * Save authentication state
   * @param {boolean} isLoggedIn - Whether admin is logged in
   */
  saveAuth(isLoggedIn) {
    try {
      if (isLoggedIn) {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
      }
      return true;
    } catch (error) {
      console.error('Error saving auth state:', error);
      return false;
    }
  },

  /**
   * Check if admin is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch (error) {
      return false;
    }
  },

  /**
   * Clear authentication (logout)
   */
  clearAuth() {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      return true;
    } catch (error) {
      console.error('Error clearing auth:', error);
      return false;
    }
  },

  // ========================================
  // UTILITY
  // ========================================

  /**
   * Reset all data to initial state
   * Useful for demo/testing purposes
   */
  resetData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      this.saveBookings(INITIAL_BOOKINGS);
      return true;
    } catch (error) {
      console.error('Error resetting data:', error);
      return false;
    }
  },

  /**
   * Clear all app data from localStorage
   */
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
};
