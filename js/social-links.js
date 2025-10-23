// Social Media Links Manager
// This file reads social media links from localStorage and displays them

(function() {
    'use strict';

    // Get social links from localStorage
    function getSocialLinks() {
        const stored = localStorage.getItem('back40_social_links');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing social links:', e);
                return getDefaultLinks();
            }
        }
        return getDefaultLinks();
    }

    // Default social links (empty - configured in admin)
    function getDefaultLinks() {
        return {
            facebook: '',
            instagram: '',
            youtube: '',
            twitter: '',
            tiktok: ''
        };
    }

    // Social media platform config
    const socialPlatforms = {
        facebook: {
            name: 'Facebook',
            icon: 'fab fa-facebook',
            color: '#1877f2',
            baseUrl: 'https://facebook.com/'
        },
        instagram: {
            name: 'Instagram',
            icon: 'fab fa-instagram',
            color: '#e4405f',
            baseUrl: 'https://instagram.com/'
        },
        youtube: {
            name: 'YouTube',
            icon: 'fab fa-youtube',
            color: '#ff0000',
            baseUrl: 'https://youtube.com/'
        },
        twitter: {
            name: 'Twitter/X',
            icon: 'fab fa-x-twitter',
            color: '#000000',
            baseUrl: 'https://twitter.com/'
        },
        tiktok: {
            name: 'TikTok',
            icon: 'fab fa-tiktok',
            color: '#000000',
            baseUrl: 'https://tiktok.com/@'
        }
    };

    // Display social links in footer
    function displaySocialLinks() {
        const container = document.getElementById('footerSocial');
        if (!container) return;

        const links = getSocialLinks();
        const hasLinks = Object.values(links).some(link => link && link.trim() !== '');

        if (!hasLinks) {
            container.style.display = 'none';
            return;
        }

        let html = '<div class="social-links">';

        Object.keys(links).forEach(platform => {
            const link = links[platform];
            if (link && link.trim() !== '') {
                const config = socialPlatforms[platform];
                if (config) {
                    // Format URL - add base URL if just username provided
                    let fullUrl = link;
                    if (!link.startsWith('http')) {
                        fullUrl = config.baseUrl + link.replace('@', '');
                    }

                    html += `
                        <a href="${fullUrl}"
                           target="_blank"
                           rel="noopener noreferrer"
                           class="social-link"
                           aria-label="${config.name}"
                           title="Follow us on ${config.name}">
                            <i class="${config.icon}"></i>
                        </a>
                    `;
                }
            }
        });

        html += '</div>';
        container.innerHTML = html;
        container.style.display = 'block';
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', displaySocialLinks);
    } else {
        displaySocialLinks();
    }

    // Listen for storage changes (when updated from admin)
    window.addEventListener('storage', function(e) {
        if (e.key === 'back40_social_links') {
            displaySocialLinks();
        }
    });

})();
