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

        // Submit form (using Formspree or your backend)
        const formData = new FormData(form);

        // For demo/testing, show success message
        // In production, this would submit to your form handler
        setTimeout(() => {
            showSuccessMessage();
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Track conversion
            if (typeof Back40 !== 'undefined') {
                Back40.trackEvent('Booking', 'Form Submit', 'Reservation Request');
            }
        }, 1500);

        // Actual submission (uncomment when Formspree ID is added)
        /*
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showSuccessMessage();
                form.reset();
            } else {
                showErrorMessage();
            }
        })
        .catch(error => {
            showErrorMessage();
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
        */
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
            <h3 style="margin-bottom: 0.5rem;">Reservation Request Received!</h3>
            <p style="margin: 0;">Thank you! We'll confirm your reservation within 24 hours. Check your email for our response.</p>
        </div>
    `;

    const form = document.getElementById('bookingForm');
    form.parentElement.insertBefore(message, form);

    // Scroll to message
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove message after 10 seconds
    setTimeout(() => {
        message.remove();
    }, 10000);
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
