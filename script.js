document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const mainElement = document.querySelector('main');

    // 1. Initial Page Load Fade-In
    if (mainElement) {
        mainElement.classList.add('is-loading');
        setTimeout(() => {
            mainElement.classList.remove('is-loading');
        }, 50);
    }

    // 2. Page Navigation Fade-Out/Fade-In
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if the link is external
            if (this.hostname !== window.location.hostname) {
                return; // Let browser handle external links (target="_blank" usually handles new tab)
            }

            // Check if it's a hash link for the current page path
            const isSamePagePath = this.pathname === window.location.pathname;
            if (this.hash && isSamePagePath) {
                // If it's a hash link on the same page, let smooth scroll below handle it.
                // No preventDefault here to allow smooth scroll to function if it also matches a[href^="#"]
                return;
            }

            // If it's a link to the exact same page (no hash change, or hash already handled)
            if (this.href === window.location.href) {
                e.preventDefault(); // Prevent reload/navigation
                return;
            }

            // Internal page navigation to a different page
            e.preventDefault();
            if (mainElement) {
                mainElement.classList.add('is-loading'); // Fade out current page
            }
            setTimeout(() => {
                window.location.href = href;
            }, 500); // Corresponds to --transition-slow (0.5s)
        });
    });

    // Smooth scroll for anchor links (Modified to be more specific)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Ensure it's a hash link on the current page path and the element exists
            if (targetId.startsWith('#') && this.pathname === window.location.pathname) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (targetId === '#') {
                    e.preventDefault(); // Prevent jump to top for empty hash
                }
            }
            // If not a valid on-page hash link, the general nav link listener above will handle it or it's an unhandled case.
        });
    });

    // 3. Intersection Observer for Section Animations
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slideUpSmooth'); // Use new class
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        // section.classList.add('section-hidden'); // Removed
        sectionObserver.observe(section);
    });

    // 4. Inline Style Injection - REMOVED
    // 5. Portfolio Overlay JavaScript - REMOVED

    // Navigation bar scroll effect (existing code)
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // 6. Old .animate-on-scroll Logic - REMOVED
});
