document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const mainElement = document.querySelector('main');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    const searchInput = document.getElementById('search-input');
    const newsletterForm = document.getElementById('newsletter-form');

    // Search functionality
    if (searchInput) {
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchInput.parentNode.appendChild(searchResults);

        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }

            searchTimeout = setTimeout(() => {
                // Simulate search results (replace with actual search logic)
                const results = [
                    { title: 'Project 1', category: 'game-dev', url: '#' },
                    { title: 'Project 2', category: 'web-dev', url: '#' },
                    { title: 'About Me', category: 'page', url: 'about.html' }
                ].filter(item => 
                    item.title.toLowerCase().includes(query.toLowerCase())
                );

                if (results.length > 0) {
                    searchResults.innerHTML = results.map(result => `
                        <div class="search-result-item" data-url="${result.url}">
                            <div class="result-title">${result.title}</div>
                            <div class="result-category">${result.category}</div>
                        </div>
                    `).join('');
                    searchResults.classList.add('active');
                } else {
                    searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
                    searchResults.classList.add('active');
                }
            }, 300);
        });

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });

        // Handle search result clicks
        searchResults.addEventListener('click', function(e) {
            const resultItem = e.target.closest('.search-result-item');
            if (resultItem && resultItem.dataset.url) {
                window.location.href = resultItem.dataset.url;
            }
        });
    }

    // Newsletter form handling
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            const messageDiv = this.querySelector('.form-message');
            
            if (!emailInput.value) return;

            submitButton.classList.add('loading');
            messageDiv.textContent = '';

            try {
                // Simulate API call (replace with actual newsletter subscription logic)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                messageDiv.textContent = 'Thank you for subscribing!';
                messageDiv.className = 'form-message success';
                emailInput.value = '';
            } catch (error) {
                messageDiv.textContent = 'An error occurred. Please try again.';
                messageDiv.className = 'form-message error';
            } finally {
                submitButton.classList.remove('loading');
            }
        });
    }

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

    // Page transitions
    if (mainElement) {
        mainElement.classList.add('is-loading');
        setTimeout(() => {
            mainElement.classList.remove('is-loading');
        }, 50);
    }

    // Navigation handling
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (this.hostname !== window.location.hostname) {
                return;
            }

            const isSamePagePath = this.pathname === window.location.pathname;
            if (this.hash && isSamePagePath) {
                return;
            }

            if (this.href === window.location.href) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            if (mainElement) {
                mainElement.classList.add('is-loading');
            }
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && this.pathname === window.location.pathname) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    // Intersection Observer for animations
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

    // Navigation scroll effect
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

    // Share functionality
    document.querySelectorAll('.share-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl;

            if (this.classList.contains('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            } else if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            } else if (this.classList.contains('linkedin')) {
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // Set active page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.setAttribute('aria-current', 'page');
        }
    });
});

// Disable right-click
document.addEventListener('contextmenu', e => e.preventDefault());

// Disable common dev tool shortcuts
document.addEventListener('keydown', function(e) {
  // Disable F12
  if (e.key === "F12") {
    e.preventDefault();
  }

  // Disable Ctrl+U, Ctrl+S, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
  if (
    (e.ctrlKey && e.key.toLowerCase() === 'u') ||
    (e.ctrlKey && e.key.toLowerCase() === 's') ||
    (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
  ) {
    e.preventDefault();
  }
});

