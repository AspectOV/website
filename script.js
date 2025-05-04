document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const modeToggle = document.getElementById('modeToggle');
    const icon = modeToggle?.querySelector('i');

    // Dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
        icon?.classList.replace('fa-moon', 'fa-sun');
    }

    modeToggle?.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            icon?.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('darkMode', 'true');
        } else {
            icon?.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('darkMode', 'false');
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Section fade-in animation
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });

    // CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .section-hidden {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        nav.scrolled {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            background-color: rgba(255, 255, 255, 0.9);
            transition: background-color 0.3s, box-shadow 0.3s;
        }
        .animate-slideUp {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
        }
    `;
    document.head.appendChild(style);

    // Portfolio image overlay effect
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.querySelector('.portfolio-overlay').style.transform = 'translateY(0)';
        });
        item.addEventListener('mouseleave', function () {
            this.querySelector('.portfolio-overlay').style.transform = 'translateY(100%)';
        });
    });

    // Navigation bar scroll effect
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

    // Animate elements with .animate-on-scroll
    const animateOnScroll = () => {
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            const top = element.getBoundingClientRect().top;
            const visible = 150;
            if (top < window.innerHeight - visible) {
                element.classList.add('animate-slideUp');
            }
        });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial run
});
