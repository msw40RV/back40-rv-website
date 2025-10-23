/**
 * FAQ Accordion Functionality
 * Back40 RV Park
 */

document.addEventListener('DOMContentLoaded', function() {
    initFAQAccordion();
});

/**
 * Initialize FAQ Accordion
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // Set initial state
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';

        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.paddingTop = '0';
                    otherAnswer.style.paddingBottom = '0';
                }
            });

            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
            } else {
                item.classList.add('active');
                answer.style.paddingTop = '1rem';
                answer.style.paddingBottom = '1rem';
                // Use a large maxHeight or calculate after padding is applied
                setTimeout(() => {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }, 10);
            }
        });
    });

    // Check for hash in URL to open specific question
    if (window.location.hash) {
        const targetQuestion = document.querySelector(window.location.hash);
        if (targetQuestion && targetQuestion.classList.contains('faq-item')) {
            setTimeout(() => {
                targetQuestion.querySelector('.faq-question').click();
                targetQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
}

/**
 * Search FAQ (optional enhancement)
 */
function searchFAQ(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchLower = searchTerm.toLowerCase();

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

        if (question.includes(searchLower) || answer.includes(searchLower)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
