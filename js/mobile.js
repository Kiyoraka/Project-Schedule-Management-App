/**
 * Mobile Landing Page JavaScript (App-like)
 * Schedule Management App
 */

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
  // Day tabs
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

  // Render day tabs and slot cards
  renderDayTabs();
  renderSlotCards(appState.selectedDay);

  // Setup event listeners
  setupEventListeners();
}

// ========================================
// DAY TABS RENDERING
// ========================================
function renderDayTabs() {
  if (!elements.dayTabs) return;

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

// ========================================
// SLOT CARDS RENDERING
// ========================================
function renderSlotCards(dayId) {
  if (!elements.slotCards) return;

  const bookings = appState.bookings;
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
    appState.bookings = bookings;
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

  // Focus on name input (with delay for animation)
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
// FORM VALIDATION
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

// ========================================
// FORM SUBMISSION
// ========================================
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

  // Double-check slot availability
  const currentBookings = Storage.loadBookings();
  if (Utils.isSlotBooked(dayId, slotId, currentBookings)) {
    Utils.showToast('Sorry, this slot was just booked by someone else', 'error');
    closeModal();
    appState.bookings = currentBookings;
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
    appState.bookings = Storage.loadBookings();
    closeModal();

    const day = getDayById(dayId);
    const slot = getSlotById(slotId);
    Utils.showToast(`Booking submitted for ${day.name}, ${slot.label}. Awaiting approval.`, 'success');

    renderSlotCards(appState.selectedDay);
  } else {
    Utils.showToast('Failed to create booking. Please try again.', 'error');
  }
}

// ========================================
// REFRESH FUNCTION
// ========================================
function refreshSlots() {
  appState.bookings = Storage.loadBookings();
  renderSlotCards(appState.selectedDay);
}

window.refreshSlots = refreshSlots;
