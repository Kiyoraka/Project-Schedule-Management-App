/**
 * Landing Page JavaScript - Timetable & Booking Logic
 * Schedule Management App
 */

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
  // Desktop timetable
  timetableBody: document.getElementById('timetable-body'),

  // Mobile timetable
  dayTabs: document.getElementById('day-tabs'),
  slotCards: document.getElementById('slot-cards'),

  // Booking modal
  modalOverlay: document.getElementById('booking-modal'),
  modalClose: document.getElementById('modal-close'),
  modalCancel: document.getElementById('modal-cancel'),
  modalSubmit: document.getElementById('modal-submit'),
  bookingForm: document.getElementById('booking-form'),

  // Form fields
  bookingDayId: document.getElementById('booking-day-id'),
  bookingSlotId: document.getElementById('booking-slot-id'),
  bookingDay: document.getElementById('booking-day'),
  bookingTime: document.getElementById('booking-time'),
  bookingName: document.getElementById('booking-name'),
  bookingPhone: document.getElementById('booking-phone'),
  nameError: document.getElementById('name-error'),
  phoneError: document.getElementById('phone-error')
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  // Load bookings from storage
  appState.bookings = Storage.loadBookings();

  // Render timetables
  renderDesktopTimetable();
  renderMobileTimetable();

  // Setup event listeners
  setupEventListeners();
}

// ========================================
// DESKTOP TIMETABLE RENDERING
// ========================================
function renderDesktopTimetable() {
  if (!elements.timetableBody) return;

  const bookings = appState.bookings;
  let html = '';

  TIME_SLOTS.forEach(slot => {
    html += '<tr>';

    // Time cell
    html += `<td class="time-cell">${slot.label}</td>`;

    // Day cells
    DAYS.forEach(day => {
      const isBooked = Utils.isSlotBooked(day.id, slot.id, bookings);
      const bookerName = Utils.getBookerName(day.id, slot.id, bookings);

      if (isBooked) {
        html += `
          <td class="slot-cell booked" data-day="${day.id}" data-slot="${slot.id}">
            <span class="booker-name">${bookerName}</span>
          </td>
        `;
      } else {
        html += `
          <td class="slot-cell available" data-day="${day.id}" data-slot="${slot.id}"></td>
        `;
      }
    });

    html += '</tr>';
  });

  elements.timetableBody.innerHTML = html;

  // Add click listeners to available slots
  elements.timetableBody.querySelectorAll('.slot-cell.available').forEach(cell => {
    cell.addEventListener('click', handleSlotClick);
  });
}

// ========================================
// MOBILE TIMETABLE RENDERING
// ========================================
function renderMobileTimetable() {
  if (!elements.dayTabs || !elements.slotCards) return;

  renderDayTabs();
  renderSlotCards(appState.selectedDay);
}

function renderDayTabs() {
  let html = '';

  DAYS.forEach(day => {
    const isActive = day.id === appState.selectedDay;
    html += `
      <button class="day-tab ${isActive ? 'active' : ''}" data-day="${day.id}">
        <span class="day-tab-short">${day.shortName}</span>
      </button>
    `;
  });

  elements.dayTabs.innerHTML = html;

  // Add click listeners to day tabs
  elements.dayTabs.querySelectorAll('.day-tab').forEach(tab => {
    tab.addEventListener('click', handleDayTabClick);
  });
}

function renderSlotCards(dayId) {
  const bookings = appState.bookings;
  const day = getDayById(dayId);
  let html = '';

  TIME_SLOTS.forEach(slot => {
    const isBooked = Utils.isSlotBooked(dayId, slot.id, bookings);
    const bookerName = Utils.getBookerName(dayId, slot.id, bookings);

    if (isBooked) {
      html += `
        <div class="slot-card booked" data-day="${dayId}" data-slot="${slot.id}">
          <div class="slot-card-info">
            <span class="slot-card-time">${slot.label}</span>
            <span class="slot-card-name">${bookerName}</span>
          </div>
          <div class="slot-card-status">
            <span class="slot-card-badge">Booked</span>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="slot-card available" data-day="${dayId}" data-slot="${slot.id}">
          <span class="slot-card-time">${slot.label}</span>
          <div class="slot-card-status">
            <span class="slot-card-badge">Available</span>
          </div>
        </div>
      `;
    }
  });

  elements.slotCards.innerHTML = html;

  // Add click listeners to available slot cards
  elements.slotCards.querySelectorAll('.slot-card.available').forEach(card => {
    card.addEventListener('click', handleSlotClick);
  });
}

// ========================================
// EVENT HANDLERS
// ========================================
function setupEventListeners() {
  // Modal close button
  if (elements.modalClose) {
    elements.modalClose.addEventListener('click', closeModal);
  }

  // Modal cancel button
  if (elements.modalCancel) {
    elements.modalCancel.addEventListener('click', closeModal);
  }

  // Modal submit button
  if (elements.modalSubmit) {
    elements.modalSubmit.addEventListener('click', handleBookingSubmit);
  }

  // Modal overlay click (close on background click)
  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) {
        closeModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Form input validation on blur
  if (elements.bookingName) {
    elements.bookingName.addEventListener('blur', () => validateNameField());
    elements.bookingName.addEventListener('input', () => clearFieldError('name'));
  }

  if (elements.bookingPhone) {
    elements.bookingPhone.addEventListener('blur', () => validatePhoneField());
    elements.bookingPhone.addEventListener('input', () => clearFieldError('phone'));
  }
}

function handleDayTabClick(e) {
  const dayId = parseInt(e.currentTarget.dataset.day);
  appState.selectedDay = dayId;

  // Update tab active state
  elements.dayTabs.querySelectorAll('.day-tab').forEach(tab => {
    tab.classList.toggle('active', parseInt(tab.dataset.day) === dayId);
  });

  // Re-render slot cards for selected day
  renderSlotCards(dayId);
}

function handleSlotClick(e) {
  const target = e.currentTarget;
  const dayId = parseInt(target.dataset.day);
  const slotId = parseInt(target.dataset.slot);

  // Double-check slot is still available
  const bookings = Storage.loadBookings();
  if (Utils.isSlotBooked(dayId, slotId, bookings)) {
    Utils.showToast('This slot has already been booked', 'error');
    // Refresh the timetable
    appState.bookings = bookings;
    renderDesktopTimetable();
    renderSlotCards(appState.selectedDay);
    return;
  }

  openBookingModal(dayId, slotId);
}

// ========================================
// BOOKING MODAL
// ========================================
function openBookingModal(dayId, slotId) {
  const day = getDayById(dayId);
  const slot = getSlotById(slotId);

  if (!day || !slot) return;

  // Populate modal
  elements.bookingDayId.value = dayId;
  elements.bookingSlotId.value = slotId;
  elements.bookingDay.textContent = day.name;
  elements.bookingTime.textContent = slot.label;

  // Clear form
  elements.bookingName.value = '';
  elements.bookingPhone.value = '';
  clearAllErrors();

  // Show modal
  elements.modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus on name input
  setTimeout(() => {
    elements.bookingName.focus();
  }, 100);
}

function closeModal() {
  elements.modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  clearAllErrors();
}

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================
function validateNameField() {
  const name = elements.bookingName.value;
  const result = Utils.validateName(name);

  if (!result.valid) {
    showFieldError('name', result.error);
    return false;
  }

  clearFieldError('name');
  return true;
}

function validatePhoneField() {
  const phone = elements.bookingPhone.value;
  const result = Utils.validatePhone(phone);

  if (!result.valid) {
    showFieldError('phone', result.error);
    return false;
  }

  clearFieldError('phone');
  return true;
}

function showFieldError(field, message) {
  const input = field === 'name' ? elements.bookingName : elements.bookingPhone;
  const error = field === 'name' ? elements.nameError : elements.phoneError;

  input.classList.add('error');
  error.textContent = message;
  error.classList.add('visible');
}

function clearFieldError(field) {
  const input = field === 'name' ? elements.bookingName : elements.bookingPhone;
  const error = field === 'name' ? elements.nameError : elements.phoneError;

  input.classList.remove('error');
  error.textContent = '';
  error.classList.remove('visible');
}

function clearAllErrors() {
  clearFieldError('name');
  clearFieldError('phone');
}

function handleBookingSubmit(e) {
  e.preventDefault();

  const name = elements.bookingName.value.trim();
  const phone = elements.bookingPhone.value.trim();
  const dayId = parseInt(elements.bookingDayId.value);
  const slotId = parseInt(elements.bookingSlotId.value);

  // Validate form
  const validation = Utils.validateBookingForm(name, phone);

  if (!validation.valid) {
    if (validation.errors.name) {
      showFieldError('name', validation.errors.name);
    }
    if (validation.errors.phone) {
      showFieldError('phone', validation.errors.phone);
    }
    return;
  }

  // Double-check slot availability before saving
  const currentBookings = Storage.loadBookings();
  if (Utils.isSlotBooked(dayId, slotId, currentBookings)) {
    Utils.showToast('Sorry, this slot was just booked by someone else', 'error');
    closeModal();
    // Refresh timetable
    appState.bookings = currentBookings;
    renderDesktopTimetable();
    renderSlotCards(appState.selectedDay);
    return;
  }

  // Create booking
  const newBooking = Storage.addBooking({
    name: name,
    phone: phone,
    dayId: dayId,
    slotId: slotId
  });

  if (newBooking) {
    // Update local state
    appState.bookings = Storage.loadBookings();

    // Close modal
    closeModal();

    // Show success message
    const day = getDayById(dayId);
    const slot = getSlotById(slotId);
    Utils.showToast(`Booking submitted for ${day.name}, ${slot.label}. Awaiting approval.`, 'success');

    // Refresh timetable
    renderDesktopTimetable();
    renderSlotCards(appState.selectedDay);
  } else {
    Utils.showToast('Failed to create booking. Please try again.', 'error');
  }
}

// ========================================
// UTILITY: Refresh Timetable
// ========================================
function refreshTimetable() {
  appState.bookings = Storage.loadBookings();
  renderDesktopTimetable();
  renderSlotCards(appState.selectedDay);
}

// Make refresh function globally accessible for admin updates
window.refreshTimetable = refreshTimetable;
