// Admin Dashboard JavaScript

// Authentication check
if (sessionStorage.getItem('back40_auth') !== 'true') {
    window.location.href = 'login.html';
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('back40_auth');
        window.location.href = 'login.html';
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.querySelector('.sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');

if (mobileMenuToggle && sidebar && mobileOverlay) {
    // Toggle menu
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('mobile-active');
        mobileOverlay.classList.toggle('active');
    });

    // Close sidebar when clicking a nav item on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-active');
                mobileOverlay.classList.remove('active');
            }
        });
    });

    // Close sidebar when clicking overlay
    mobileOverlay.addEventListener('click', function() {
        sidebar.classList.remove('mobile-active');
        mobileOverlay.classList.remove('active');
    });
}

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');

const sectionTitles = {
    'overview': 'SEO Dashboard Overview',
    'checklist': 'SEO Implementation Checklist',
    'directories': 'Directory Submissions',
    'templates': 'Copy-Paste Templates',
    'guides': 'Step-by-Step Guides',
    'settings': 'Site Settings & Updates'
};

function switchSection(sectionName) {
    // Update nav items
    navItems.forEach(item => {
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update sections
    sections.forEach(section => {
        if (section.id === sectionName + '-section') {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Update page title
    if (sectionTitles[sectionName]) {
        pageTitle.textContent = sectionTitles[sectionName];
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.dataset.section;
        switchSection(section);

        // Update URL hash
        window.location.hash = section;
    });
});

// Handle URL hash on page load
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash && sectionTitles[hash]) {
        switchSection(hash);
    }
});

// Checklist functionality
const LOCAL_STORAGE_KEY = 'back40_checklist_progress';

// Load saved progress
function loadProgress() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            Object.keys(progress).forEach(taskId => {
                const checkbox = document.getElementById('task-' + taskId);
                if (checkbox) {
                    checkbox.checked = progress[taskId];
                    updateTaskState(checkbox);
                }
            });
        } catch (e) {
            console.error('Error loading progress:', e);
        }
    }
    updateStats();
}

// Save progress
function saveProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progress = {};

    checkboxes.forEach(checkbox => {
        const taskId = checkbox.id.replace('task-', '');
        progress[taskId] = checkbox.checked;
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    updateStats();
}

// Update task visual state
function updateTaskState(checkbox) {
    const item = checkbox.closest('.checklist-item');
    if (checkbox.checked) {
        item.classList.add('completed');
    } else {
        item.classList.remove('completed');
    }
}

// Update statistics
function updateStats() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const total = checkboxes.length;
    const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBar').style.width = percent + '%';

    let progressText = 'Complete the checklist to boost your SEO rankings';
    if (percent >= 100) {
        progressText = '🎉 Congratulations! You\'ve completed all tasks!';
    } else if (percent >= 75) {
        progressText = 'Great progress! You\'re almost there!';
    } else if (percent >= 50) {
        progressText = 'Halfway there! Keep up the good work!';
    } else if (percent >= 25) {
        progressText = 'Good start! Continue working through the checklist.';
    }

    document.getElementById('progressText').textContent = progressText;
}

// Attach checkbox listeners
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateTaskState(this);
            saveProgress();
        });
    });

    // Load saved progress
    loadProgress();

    // Expand/collapse task details - attach to the entire checklist item
    const checklistItems = document.querySelectorAll('.checklist-item');
    checklistItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // If clicking checkbox or label for checkbox, let it handle check/uncheck only
            if (e.target.type === 'checkbox' || e.target.tagName === 'LABEL') {
                return;
            }

            // Otherwise, toggle the details
            const details = item.querySelector('.task-details');
            const checkbox = item.querySelector('input[type="checkbox"]');

            // Show details regardless of completion status
            if (details) {
                if (details.style.display === 'block') {
                    details.style.display = 'none';
                } else {
                    // Close all other details first
                    document.querySelectorAll('.task-details').forEach(d => {
                        d.style.display = 'none';
                    });
                    details.style.display = 'block';
                }
            }
        });
    });
});

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showCopyNotification('Copied to clipboard!');
    } catch (err) {
        showCopyNotification('Copy failed. Please copy manually.');
    }
    document.body.removeChild(textarea);
}

// Show copy notification
function showCopyNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.copy-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Template copy functions
const templates = {
    'nap': `Business Name: Back40 RV Park
Address: 1373 Hickory Lane, Pineville, MO 64856
Phone: (479) 721-5630
Website: https://back40-rv.com
Email: back40rvpark@gmail.com`,

    'short-desc': `Quiet RV park in Bella Vista, AR with direct access to 100+ miles of mountain bike and hiking trails. Full hookups. $50/night.`,

    'full-desc': `Back40 RV Park is a quiet, cozy RV park in the heart of the Ozarks with full hookups (50/30/20 amp), dump station access, and direct access to hundreds of miles of hiking and cycling trails in Bella Vista, Arkansas and Pineville, Missouri.

Located just steps from the famous Back 40 Trail System (40+ miles of flowing XC singletrack), our RV park offers unmatched trail access for mountain biking and hiking enthusiasts. No trailer needed—walk or ride directly from your site onto world-class trails.

We're a self-contained RV park designed for peace and privacy. Each site includes electrical hookups, with our dump station 30-100 feet away and water fill within 50 feet of all sites.

Rates: $50/night, $300/week. By appointment. Call 479-721-5630 to book.`,

    'categories': `Primary Category: RV Park
Secondary Categories: Campground, Lodging, Mountain Bike Trail, Hiking Area
Keywords: RV park, campground, trail access, mountain biking, Bella Vista, Bentonville, Ozarks`,

    'amenities': `✓ 50 amp electrical hookup
✓ 30 amp electrical hookup
✓ 20 amp electrical hookup
✓ RV dump station (30-100 ft from sites)
✓ Fresh water fill station (within 50 ft)
✓ Direct trail access
✓ Mountain bike trails
✓ Hiking trails
✓ Gravel riding routes
✓ Pet friendly
✓ Quiet, wooded setting
✓ Level gravel pads`,

    'pricing': `Nightly Rate: $50/night
Weekly Rate: $300/week (Save $50!)
Check-in: After 1:00 PM
Check-out: By 11:00 AM
Flexible arrival times available by appointment`,

    'geo': `Latitude: 36.5951
Longitude: -94.3849
State: Missouri (MO)
City: Pineville
Nearby Cities: Bella Vista AR (12 mi), Bentonville AR (22 mi), Pea Ridge AR (10 mi)
Region: Northwest Arkansas / Southwest Missouri / Ozarks`,

    'review-email': `Subject: Thanks for staying at Back40 RV Park!

Hi [Guest Name],

Thanks so much for staying with us at Back40 RV Park! We hope you enjoyed the trails and had a great time in the Ozarks.

Would you mind taking a minute to leave us a review on Google? Your feedback helps other RVers find us and supports our small business.

[INSERT YOUR GOOGLE REVIEW LINK HERE AFTER GBP IS SET UP]

Thanks again, and we'd love to see you back anytime!

Mark
Back40 RV Park
479-721-5630`
};

function copyTemplate(templateId) {
    if (templates[templateId]) {
        copyToClipboard(templates[templateId]);
    }
}

// Export functions for use in HTML onclick handlers
window.copyToClipboard = copyToClipboard;
window.copyTemplate = copyTemplate;
window.switchSection = switchSection;

// Print functionality (optional future enhancement)
function printChecklist() {
    window.print();
}

// Export data (optional future enhancement)
function exportProgress() {
    const progress = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (progress) {
        const blob = new Blob([progress], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'back40-seo-progress.json';
        a.click();
        URL.revokeObjectURL(url);
        showCopyNotification('Progress exported!');
    }
}

// Mobile menu toggle (for responsive design)
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search (future feature)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Search functionality placeholder
    }
});

console.log('Back40 RV Park Admin Dashboard loaded successfully');
console.log('Version: 1.0.0');
console.log('Built for Mark Swart by Brett');

// ===== Social Media Manager =====

// Load social links into form
function loadSocialLinksToForm() {
    const stored = localStorage.getItem('back40_social_links');
    if (stored) {
        try {
            const links = JSON.parse(stored);
            Object.keys(links).forEach(platform => {
                const input = document.getElementById(platform);
                if (input && links[platform]) {
                    input.value = links[platform];
                }
            });
            updateSocialPreview();
        } catch (e) {
            console.error('Error loading social links:', e);
        }
    }
}

// Save social links
document.addEventListener('DOMContentLoaded', function() {
    const socialForm = document.getElementById('socialMediaForm');
    if (socialForm) {
        socialForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const links = {
                facebook: document.getElementById('facebook').value.trim(),
                instagram: document.getElementById('instagram').value.trim(),
                youtube: document.getElementById('youtube').value.trim(),
                twitter: document.getElementById('twitter').value.trim(),
                tiktok: document.getElementById('tiktok').value.trim()
            };

            // Save to localStorage
            localStorage.setItem('back40_social_links', JSON.stringify(links));

            // Show success message
            const successMsg = document.getElementById('socialSaveSuccess');
            successMsg.style.display = 'flex';

            // Update preview
            updateSocialPreview();

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 5000);

            showCopyNotification('Social links saved successfully!');
        });

        // Clear button
        const clearBtn = document.getElementById('clearSocialBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear all social media links?')) {
                    // Clear form
                    document.getElementById('facebook').value = '';
                    document.getElementById('instagram').value = '';
                    document.getElementById('youtube').value = '';
                    document.getElementById('twitter').value = '';
                    document.getElementById('tiktok').value = '';

                    // Clear localStorage
                    localStorage.removeItem('back40_social_links');

                    // Update preview
                    updateSocialPreview();

                    showCopyNotification('Social links cleared');
                }
            });
        }

        // Load existing links
        loadSocialLinksToForm();

        // Update preview on input
        ['facebook', 'instagram', 'youtube', 'twitter', 'tiktok'].forEach(platform => {
            const input = document.getElementById(platform);
            if (input) {
                input.addEventListener('input', updateSocialPreview);
            }
        });
    }
});

// Update social preview
function updateSocialPreview() {
    const preview = document.getElementById('socialPreview');
    if (!preview) return;

    const links = {
        facebook: document.getElementById('facebook')?.value.trim() || '',
        instagram: document.getElementById('instagram')?.value.trim() || '',
        youtube: document.getElementById('youtube')?.value.trim() || '',
        twitter: document.getElementById('twitter')?.value.trim() || '',
        tiktok: document.getElementById('tiktok')?.value.trim() || ''
    };

    const socialPlatforms = {
        facebook: { icon: 'fab fa-facebook', color: '#1877f2' },
        instagram: { icon: 'fab fa-instagram', color: '#e4405f' },
        youtube: { icon: 'fab fa-youtube', color: '#ff0000' },
        twitter: { icon: 'fab fa-x-twitter', color: '#000000' },
        tiktok: { icon: 'fab fa-tiktok', color: '#000000' }
    };

    const hasLinks = Object.values(links).some(link => link !== '');

    if (!hasLinks) {
        preview.innerHTML = '<div class="social-links"><span class="preview-placeholder">Add social links above to see preview</span></div>';
        return;
    }

    let html = '<div class="social-links">';

    Object.keys(links).forEach(platform => {
        const link = links[platform];
        if (link) {
            const config = socialPlatforms[platform];
            html += `
                <a href="#" class="social-link" style="pointer-events: none;">
                    <i class="${config.icon}"></i>
                </a>
            `;
        }
    });

    html += '</div>';
    preview.innerHTML = html;
}

console.log('Social Media Manager loaded');
