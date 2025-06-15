document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const mainElement = document.querySelector('main');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');

    // Mobile menu functionality
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            nav.querySelector('ul').classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && nav.querySelector('ul').classList.contains('active')) {
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                nav.querySelector('ul').classList.remove('active');
            }
        });
    }

    // 1. Initial Page Load Fade-In
    if (mainElement) {
        mainElement.classList.add('is-loading');
        setTimeout(() => {
            mainElement.classList.remove('is-loading');
        }, 50);
    }

    // 2. Page Navigation Fade-Out/Fade-In
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if the link is external
            if (this.hostname !== window.location.hostname) {
                return;
            }

            // Check if it's a hash link for the current page path
            const isSamePagePath = this.pathname === window.location.pathname;
            if (this.hash && isSamePagePath) {
                return;
            }

            // If it's a link to the exact same page
            if (this.href === window.location.href) {
                e.preventDefault();
                return;
            }

            // Internal page navigation
            e.preventDefault();
            if (mainElement) {
                mainElement.classList.add('is-loading');
            }
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && this.pathname === window.location.pathname) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Close mobile menu if open
                    if (nav.querySelector('ul').classList.contains('active')) {
                        mobileMenuButton.setAttribute('aria-expanded', 'false');
                        nav.querySelector('ul').classList.remove('active');
                    }
                } else if (targetId === '#') {
                    e.preventDefault();
                }
            }
        });
    });

    // 3. Intersection Observer for Section Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slideUpSmooth');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Navigation bar scroll effect
    if (nav) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
                if (currentScroll > lastScroll) {
                    nav.style.transform = 'translateY(-100%)';
                } else {
                    nav.style.transform = 'translateY(0)';
                }
            } else {
                nav.classList.remove('scrolled');
                nav.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // Add loading states to buttons
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('loading')) return;
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        });
    });

    // Handle form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) submitButton.classList.add('loading');
            
            try {
                // Handle form submission
                // Add your form submission logic here
            } catch (error) {
                console.error('Form submission failed:', error);
                // Show error message to user
            } finally {
                if (submitButton) submitButton.classList.remove('loading');
            }
        });
    });
});
