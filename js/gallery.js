/**
 * Gallery Functionality
 * Back40 RV Park
 */

document.addEventListener('DOMContentLoaded', function() {
    initGalleryFilters();
    initLightbox();
});

/**
 * Gallery Filter Functionality
 */
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    // Trigger fade-in animation
                    item.style.animation = 'none';
                    setTimeout(() => {
                        item.style.animation = 'fadeIn 0.5s ease-in';
                    }, 10);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

/**
 * Lightbox Functionality
 */
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentIndex = 0;
    let visibleItems = Array.from(galleryItems);

    // Open lightbox on item click
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Previous image
    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        showPrevImage();
    });

    // Next image
    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        showNextImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });

    function openLightbox(index) {
        // Get only visible items
        visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
        currentIndex = visibleItems.indexOf(galleryItems[index]);

        if (currentIndex === -1) currentIndex = 0;

        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightboxContent();
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightboxContent();
    }

    function updateLightboxContent() {
        const currentItem = visibleItems[currentIndex];
        const img = currentItem.querySelector('img');
        const overlay = currentItem.querySelector('.gallery-overlay');

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = overlay.querySelector('h4').textContent;
        lightboxDescription.textContent = overlay.querySelector('p').textContent;
    }
}

/**
 * Lazy Loading Enhancement (optional)
 */
function initLazyLoading() {
    const images = document.querySelectorAll('.gallery-item img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading if needed
initLazyLoading();
