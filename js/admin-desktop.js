/**
 * Admin Desktop JavaScript - Desktop Admin Panel Logic
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

  // Render table
  renderBookingsTable(filtered);

  // Show/hide empty state
  const emptyState = document.getElementById('empty-state');
  const tableWrapper = document.querySelector('.bookings-table-wrapper');

  if (filtered.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (tableWrapper) tableWrapper.style.display = 'none';
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    if (tableWrapper) tableWrapper.style.display = '';
  }
}

function renderBookingsTable(bookings) {
  const tbody = document.getElementById('bookings-table-body');
  if (!tbody) return;

  if (bookings.length === 0) {
    tbody.innerHTML = '';
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
      <tr data-id="${booking.id}">
        <td>${booking.name}</td>
        <td>${Utils.formatPhone(booking.phone)}</td>
        <td>${day ? day.name : '-'}</td>
        <td>${slot ? slot.shortLabel : '-'}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn btn-ghost btn-sm view-btn" data-id="${booking.id}">View</button>
            ${isPending ? `
              <button class="btn btn-success btn-sm approve-btn" data-id="${booking.id}">Approve</button>
              <button class="btn btn-danger btn-sm reject-btn" data-id="${booking.id}">Reject</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;

  // Add event listeners
  tbody.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => handleViewBooking(parseInt(btn.dataset.id)));
  });

  tbody.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', () => handleApproveBooking(parseInt(btn.dataset.id)));
  });

  tbody.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', () => handleRejectBooking(parseInt(btn.dataset.id)));
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

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
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
    Utils.showToast('Booking approved successfully!', 'success');
    renderBookings();
  } else {
    Utils.showToast('Failed to approve booking', 'error');
  }
}

function handleRejectBooking(bookingId) {
  const updated = Storage.updateBooking(bookingId, { status: BOOKING_STATUS.REJECTED });

  if (updated) {
    Utils.showToast('Booking rejected', 'warning');
    renderBookings();
  } else {
    Utils.showToast('Failed to reject booking', 'error');
  }
}
