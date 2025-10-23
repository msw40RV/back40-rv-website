// Contact Page Specific JavaScript
'use strict';

document.addEventListener('DOMContentLoaded', function() {
    initBookingForm();
    initDateRestrictions();
});

// Booking Form Validation & Submission
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        if (!validateBookingForm()) {
            return false;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Submit form via SMS
        const formData = new FormData(form);

        // Format booking info for SMS
        const name = formData.get('name');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const arrival = formData.get('arrival');
        const nights = formData.get('nights');
        const rvLength = formData.get('rvLength');
        const ampService = formData.get('ampService');
        const guests = formData.get('guests');
        const pets = formData.get('pets');
        const message = formData.get('message');

        // Create SMS message text
        let smsText = `BOOKING REQUEST from Back40-RV.com\n\n`;
        smsText += `Name: ${name}\n`;
        smsText += `Phone: ${phone}\n`;
        smsText += `Email: ${email}\n`;
        smsText += `Arrival: ${arrival}\n`;
        smsText += `Nights: ${nights}\n`;
        smsText += `RV Length: ${rvLength}ft\n`;
        smsText += `Amp Service: ${ampService}\n`;
        smsText += `Guests: ${guests}\n`;
        smsText += `Pets: ${pets}\n`;
        if (message) {
            smsText += `\nMessage: ${message}`;
        }

        // Detect if mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (isMobile) {
            // Mobile: Open SMS app with pre-filled message
            const encodedMessage = encodeURIComponent(smsText);
            const smsLink = `sms:4797215630&body=${encodedMessage}`;
            window.location.href = smsLink;

            setTimeout(() => {
                showSuccessMessage();
                form.reset();

                // Track conversion
                if (typeof Back40 !== 'undefined') {
                    Back40.trackEvent('Booking', 'Form Submit', 'Reservation Request - Mobile SMS');
                }
            }, 500);
        } else {
            // Desktop: Show modal with booking info
            showDesktopBookingModal(smsText, name, phone);
            form.reset();

            // Track conversion
            if (typeof Back40 !== 'undefined') {
                Back40.trackEvent('Booking', 'Form Submit', 'Reservation Request - Desktop');
            }
        }
    });
}

// Validate Booking Form
function validateBookingForm() {
    const form = document.getElementById('bookingForm');
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    removeErrorMessages();

    // Required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim() && field.type !== 'checkbox') {
            field.classList.add('error');
            isValid = false;
        }

        // Checkbox validation
        if (field.type === 'checkbox' && !field.checked) {
            field.classList.add('error');
            isValid = false;
        }
    });

    // Email validation
    const emailField = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        emailField.classList.add('error');
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }

    // Phone validation
    const phoneField = document.getElementById('phone');
    const phoneRegex = /^[\d\s\-\(\)]{10,}$/;
    if (phoneField.value && !phoneRegex.test(phoneField.value)) {
        phoneField.classList.add('error');
        showFieldError(phoneField, 'Please enter a valid phone number');
        isValid = false;
    }

    // Date validation (must be future date)
    const arrivalField = document.getElementById('arrival');
    if (arrivalField.value) {
        const selectedDate = new Date(arrivalField.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            arrivalField.classList.add('error');
            showFieldError(arrivalField, 'Arrival date must be in the future');
            isValid = false;
        }
    }

    // RV length validation
    const rvLengthField = document.getElementById('rvLength');
    if (rvLengthField.value) {
        const length = parseInt(rvLengthField.value);
        if (length < 10 || length > 50) {
            rvLengthField.classList.add('error');
            showFieldError(rvLengthField, 'RV length must be between 10 and 50 feet');
            isValid = false;
        }
    }

    if (!isValid) {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid;
}

// Show field-specific error
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.25rem';

    field.parentElement.appendChild(errorDiv);
}

// Remove all error messages
function removeErrorMessages() {
    document.querySelectorAll('.field-error').forEach(el => el.remove());
}

// Success Message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.innerHTML = `
        <div style="background: #28a745; color: white; padding: 1.5rem; border-radius: 5px; margin-bottom: 1rem; text-align: center;">
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
            <h3 style="margin-bottom: 0.5rem;">Form Ready to Send!</h3>
            <p style="margin: 0;">Your messaging app should open with a pre-filled text message. Just hit send to complete your booking request!</p>
            <p style="margin-top: 0.5rem; font-size: 0.9rem;">If your messages app didn't open, <a href="sms:4797215630" style="color: white; text-decoration: underline;">click here</a> or call <a href="tel:4797215630" style="color: white; text-decoration: underline;">479-721-5630</a></p>
        </div>
    `;

    const form = document.getElementById('bookingForm');
    form.parentElement.insertBefore(message, form);

    // Scroll to message
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove message after 15 seconds
    setTimeout(() => {
        message.remove();
    }, 15000);
}

// Error Message
function showErrorMessage() {
    const message = document.createElement('div');
    message.className = 'form-message error';
    message.innerHTML = `
        <div style="background: #dc3545; color: white; padding: 1.5rem; border-radius: 5px; margin-bottom: 1rem; text-align: center;">
            <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
            <h3 style="margin-bottom: 0.5rem;">Oops! Something went wrong.</h3>
            <p style="margin: 0;">Please try again or call us at <a href="tel:4797215630" style="color: white; text-decoration: underline;">479-721-5630</a></p>
        </div>
    `;

    const form = document.getElementById('bookingForm');
    form.parentElement.insertBefore(message, form);

    // Scroll to message
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Desktop Booking Modal
function showDesktopBookingModal(bookingInfo, customerName, customerPhone) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 10px;
        padding: 2rem;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    `;

    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <i class="fas fa-check-circle" style="color: #28a745; font-size: 3rem; margin-bottom: 1rem;"></i>
            <h2 style="color: #333; margin-bottom: 0.5rem;">Booking Request Ready!</h2>
            <p style="color: #666;">Please call or text Mark with your booking details below</p>
        </div>

        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <h3 style="color: #333; margin-bottom: 1rem; font-size: 1.1rem;">Your Booking Information:</h3>
            <pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.9rem; color: #333; line-height: 1.6; margin: 0;">${bookingInfo}</pre>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
            <a href="tel:4797215630"
               style="flex: 1; min-width: 200px; background: #28a745; color: white; padding: 1rem; text-align: center; text-decoration: none; border-radius: 5px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <i class="fas fa-phone"></i>
                Call Mark: 479-721-5630
            </a>
            <a href="sms:4797215630"
               style="flex: 1; min-width: 200px; background: #007bff; color: white; padding: 1rem; text-align: center; text-decoration: none; border-radius: 5px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <i class="fas fa-sms"></i>
                Text Mark
            </a>
        </div>

        <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
            <p style="margin: 0; color: #856404; font-size: 0.9rem;">
                <i class="fas fa-info-circle"></i>
                <strong>Tip:</strong> You can copy the booking info above and paste it into your text message or tell Mark during the call.
            </p>
        </div>

        <button onclick="this.closest('.booking-modal').remove()"
                style="width: 100%; padding: 0.75rem; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
            Close
        </button>
    `;

    modal.className = 'booking-modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close modal on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Set minimum date to today for arrival date picker
function initDateRestrictions() {
    const arrivalInput = document.getElementById('arrival');
    if (!arrivalInput) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Set min date to tomorrow (give them time to plan)
    const minDate = tomorrow.toISOString().split('T')[0];
    arrivalInput.setAttribute('min', minDate);

    // Set max date to 1 year from now
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    arrivalInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
}

// Calculate total price (if you want to show estimated cost on contact page)
function calculateEstimatedCost() {
    const nightsInput = document.getElementById('nights');
    if (!nightsInput) return;

    nightsInput.addEventListener('input', function() {
        const nights = parseInt(this.value) || 1;
        let total;

        if (nights >= 7) {
            const weeks = Math.floor(nights / 7);
            const remainingNights = nights % 7;
            total = (weeks * 300) + (remainingNights * 50);
        } else {
            total = nights * 50;
        }

        // You could display this estimate somewhere on the form
        console.log(`Estimated cost for ${nights} nights: $${total}`);
    });
}
