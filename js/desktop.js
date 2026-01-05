/**
 * Desktop Landing Page JavaScript
 * Schedule Management App
 */

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
  // Timetable
  timetableBody: document.getElementById('timetable-body'),

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

  // Render timetable
  renderTimetable();

  // Setup event listeners
  setupEventListeners();
}

// ========================================
// TIMETABLE RENDERING
// ========================================
function renderTimetable() {
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

function handleSlotClick(e) {
  const target = e.currentTarget;
  const dayId = parseInt(target.dataset.day);
  const slotId = parseInt(target.dataset.slot);

  // Double-check slot is still available
  const bookings = Storage.loadBookings();
  if (Utils.isSlotBooked(dayId, slotId, bookings)) {
    Utils.showToast('This slot has already been booked', 'error');
    appState.bookings = bookings;
    renderTimetable();
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
    renderTimetable();
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

    renderTimetable();
  } else {
    Utils.showToast('Failed to create booking. Please try again.', 'error');
  }
}

// ========================================
// REFRESH FUNCTION
// ========================================
function refreshTimetable() {
  appState.bookings = Storage.loadBookings();
  renderTimetable();
}

window.refreshTimetable = refreshTimetable;
