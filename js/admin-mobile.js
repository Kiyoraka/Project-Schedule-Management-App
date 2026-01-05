/**
 * Admin Mobile JavaScript - Mobile Admin Panel Logic (App-like)
 * Schedule Management App
 */

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Auth guard - redirect to login if not authenticated
  if (!Storage.isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  // Determine current page and initialize
  const currentPage = getCurrentPage();

  if (currentPage === 'dashboard') {
    initDashboard();
  } else if (currentPage === 'bookings') {
    initBookings();
  }

  // Setup logout handler
  setupLogout();
});

function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('dashboard')) return 'dashboard';
  if (path.includes('bookings')) return 'bookings';
  return 'unknown';
}

// ========================================
// LOGOUT HANDLING
// ========================================
function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Storage.clearAuth();
      window.location.href = 'index.html';
    });
  }
}

// ========================================
// DASHBOARD
// ========================================
function initDashboard() {
  renderStats();
}

function renderStats() {
  const bookings = Storage.loadBookings();
  const stats = Utils.getBookingStats(bookings);

  // Update stat card values
  const statTotal = document.getElementById('stat-total');
  const statPending = document.getElementById('stat-pending');
  const statApproved = document.getElementById('stat-approved');
  const statAvailable = document.getElementById('stat-available');

  if (statTotal) statTotal.textContent = stats.total;
  if (statPending) statPending.textContent = stats.pending;
  if (statApproved) statApproved.textContent = stats.approved;
  if (statAvailable) statAvailable.textContent = stats.available;
}

// ========================================
// BOOKINGS PAGE
// ========================================
let currentFilter = 'all';

function initBookings() {
  // Load bookings into app state
  appState.bookings = Storage.loadBookings();

  // Initial render
  renderBookings();

  // Setup filter tabs
  setupFilterTabs();

  // Setup view modal
  setupViewModal();
}

function setupFilterTabs() {
  const filterTabs = document.getElementById('filter-tabs');
  if (!filterTabs) return;

  filterTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;

    const filter = tab.dataset.filter;
    currentFilter = filter;

    // Update active tab
    filterTabs.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.filter === filter);
    });

    // Re-render bookings
    renderBookings();
  });
}

function renderBookings() {
  const bookings = Storage.loadBookings();
  const filtered = Utils.filterBookings(bookings, currentFilter);

  // Render cards (mobile view)
  renderBookingsCards(filtered);

  // Show/hide empty state
  const emptyState = document.getElementById('empty-state');
  const cardsWrapper = document.getElementById('bookings-cards');

  if (filtered.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (cardsWrapper) cardsWrapper.style.display = 'none';
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    if (cardsWrapper) cardsWrapper.style.display = '';
  }
}

function renderBookingsCards(bookings) {
  const container = document.getElementById('bookings-cards');
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  bookings.forEach(booking => {
    const day = getDayById(booking.dayId);
    const slot = getSlotById(booking.slotId);
    const statusClass = Utils.getStatusBadgeClass(booking.status);
    const statusText = Utils.getStatusText(booking.status);
    const isPending = booking.status === BOOKING_STATUS.PENDING;

    html += `
      <div class="booking-card" data-id="${booking.id}">
        <div class="booking-card-header">
          <span class="booking-card-name">${booking.name}</span>
          <span class="badge ${statusClass}">${statusText}</span>
        </div>
        <div class="booking-card-info">
          <div class="booking-card-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <span>${Utils.formatPhone(booking.phone)}</span>
          </div>
          <div class="booking-card-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>${day ? day.name : '-'}, ${slot ? slot.shortLabel : '-'}</span>
          </div>
        </div>
        <div class="booking-card-actions">
          <button class="btn btn-secondary btn-sm view-btn" data-id="${booking.id}">View</button>
          ${isPending ? `
            <button class="btn btn-success btn-sm approve-btn" data-id="${booking.id}">Approve</button>
            <button class="btn btn-danger btn-sm reject-btn" data-id="${booking.id}">Reject</button>
          ` : ''}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Add event listeners with touch-friendly handling
  container.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleViewBooking(parseInt(btn.dataset.id));
    });
  });

  container.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleApproveBooking(parseInt(btn.dataset.id));
    });
  });

  container.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleRejectBooking(parseInt(btn.dataset.id));
    });
  });
}

// ========================================
// VIEW MODAL
// ========================================
function setupViewModal() {
  const modalOverlay = document.getElementById('view-modal');
  const closeBtn = document.getElementById('view-modal-close');
  const cancelBtn = document.getElementById('view-modal-cancel');

  if (!modalOverlay) return;

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Close on overlay tap
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Close on swipe down (mobile gesture)
  let startY = 0;
  const modal = modalOverlay.querySelector('.modal');

  if (modal) {
    modal.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    modal.addEventListener('touchmove', (e) => {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      // If swiping down more than 100px, close the modal
      if (diff > 100) {
        closeModal();
      }
    }, { passive: true });
  }
}

function handleViewBooking(bookingId) {
  const booking = Storage.getBooking(bookingId);
  if (!booking) return;

  const day = getDayById(booking.dayId);
  const slot = getSlotById(booking.slotId);

  // Populate modal
  document.getElementById('view-name').textContent = booking.name;
  document.getElementById('view-phone').textContent = Utils.formatPhone(booking.phone);
  document.getElementById('view-day').textContent = day ? day.name : '-';
  document.getElementById('view-slot').textContent = slot ? slot.label : '-';
  document.getElementById('view-date').textContent = Utils.formatDate(booking.createdAt);

  // Status with badge
  const statusEl = document.getElementById('view-status');
  const statusClass = Utils.getStatusBadgeClass(booking.status);
  const statusText = Utils.getStatusText(booking.status);
  statusEl.innerHTML = `<span class="badge ${statusClass}">${statusText}</span>`;

  // Show modal
  const modalOverlay = document.getElementById('view-modal');
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ========================================
// APPROVE / REJECT ACTIONS
// ========================================
function handleApproveBooking(bookingId) {
  const updated = Storage.updateBooking(bookingId, { status: BOOKING_STATUS.APPROVED });

  if (updated) {
    Utils.showToast('Booking approved!', 'success');
    renderBookings();
  } else {
    Utils.showToast('Failed to approve', 'error');
  }
}

function handleRejectBooking(bookingId) {
  const updated = Storage.updateBooking(bookingId, { status: BOOKING_STATUS.REJECTED });

  if (updated) {
    Utils.showToast('Booking rejected', 'warning');
    renderBookings();
  } else {
    Utils.showToast('Failed to reject', 'error');
  }
}
