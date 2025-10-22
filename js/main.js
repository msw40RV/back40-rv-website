// ========================================
// Back40 RV Park - JavaScript
// Designed by: Brett for Mark Swart
// ========================================

'use strict';

// === Initialize on DOMContentLoaded ===
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileNav();
    initBackToTop();
    initPriceCalculator();
    initSmoothScroll();
    initStickyHeader();
    initActiveNavLinks();
});

// === Mobile Navigation ===
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            nav.classList.add('active');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    }

    // Close nav when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
            nav.classList.remove('active');
        }
    });
}

// === Back to Top Button ===
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    if (!backToTop) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // Scroll to top when clicked
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// === Price Calculator ===
function initPriceCalculator() {
    const nightsInput = document.getElementById('nights');
    const calcTotal = document.getElementById('calcTotal');

    if (!nightsInput || !calcTotal) return;

    function calculatePrice() {
        const nights = parseInt(nightsInput.value) || 1;
        let total;

        if (nights >= 7) {
            // Calculate weekly rate
            const weeks = Math.floor(nights / 7);
            const remainingNights = nights % 7;
            total = (weeks * 300) + (remainingNights * 50);
        } else {
            // Nightly rate
            total = nights * 50;
        }

        calcTotal.textContent = `$${total}`;
    }

    // Calculate on input change
    nightsInput.addEventListener('input', calculatePrice);

    // Initial calculation
    calculatePrice();
}

// === Smooth Scroll ===
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === Sticky Header ===
function initStickyHeader() {
    const header = document.getElementById('header');

    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 0) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }

        lastScroll = currentScroll;
    });
}

// === Active Nav Links ===
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// === Form Validation (for contact/booking forms) ===
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    // Email validation
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailRegex.test(input.value)) {
            isValid = false;
            input.classList.add('error');
        }
    });

    // Phone validation
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        if (input.value && !phoneRegex.test(input.value)) {
            isValid = false;
            input.classList.add('error');
        }
    });

    return isValid;
}

// === Image Lazy Loading (if not using loading="lazy" attribute) ===
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// === Accordion (for FAQ page) ===
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const accordionBody = accordionItem.querySelector('.accordion-body');
            const isActive = accordionItem.classList.contains('active');

            // Close all accordions
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-body').style.maxHeight = null;
            });

            // Open clicked accordion if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
                accordionBody.style.maxHeight = accordionBody.scrollHeight + 'px';
            }
        });
    });
}

// === Gallery Lightbox ===
function initGalleryLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-image');

    if (galleryImages.length === 0) return;

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            const lightbox = createLightbox(this.src, this.alt);
            document.body.appendChild(lightbox);
        });
    });
}

function createLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <img src="${src}" alt="${alt}">
        </div>
    `;

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            lightbox.remove();
        }
    });

    return lightbox;
}

// === Scroll Animations ===
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => animationObserver.observe(el));
}

// === Weather Widget (Optional - requires API key) ===
async function initWeatherWidget() {
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) return;

    try {
        // Example using OpenWeatherMap API (requires API key)
        // const apiKey = 'YOUR_API_KEY';
        // const lat = 36.5951;
        // const lon = -94.3849;
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
        // const data = await response.json();

        // For now, show placeholder
        weatherWidget.innerHTML = `
            <div class="weather-placeholder">
                <i class="fas fa-cloud-sun"></i>
                <span>Check local weather</span>
            </div>
        `;
    } catch (error) {
        console.error('Weather widget error:', error);
    }
}

// === Trail Conditions Indicator ===
function initTrailConditions() {
    const trailStatus = document.getElementById('trailStatus');
    if (!trailStatus) return;

    // This would ideally pull from a CMS or manual update
    // For now, showing static "Good" status
    const status = 'good'; // Options: 'good', 'fair', 'poor'
    const statusColors = {
        good: '#28a745',
        fair: '#ffc107',
        poor: '#dc3545'
    };
    const statusText = {
        good: 'Trail Conditions: Excellent',
        fair: 'Trail Conditions: Fair (Some mud)',
        poor: 'Trail Conditions: Poor (Check before riding)'
    };

    trailStatus.style.background = statusColors[status];
    trailStatus.textContent = statusText[status];
}

// === Google Analytics Event Tracking ===
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track phone clicks
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('Contact', 'Phone Click', 'Mobile');
    });
});

// Track email clicks
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('Contact', 'Email Click', 'Email');
    });
});

// Track external links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
        link.addEventListener('click', () => {
            trackEvent('Outbound Link', 'Click', link.href);
        });
    }
});

// === Export functions for use in other pages ===
window.Back40 = {
    validateForm,
    initAccordion,
    initGalleryLightbox,
    initScrollAnimations,
    trackEvent
};
