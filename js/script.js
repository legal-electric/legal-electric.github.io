// Optimized JavaScript - Carga de imágenes y funcionalidad
(function() {
    'use strict';
    
    // Cache DOM elements
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menuToggle');
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Carga optimizada de imágenes
    function loadLazyImages() {
        const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src || lazyImage.src;
                        lazyImage.classList.add('loaded');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            }, {
                rootMargin: '200px'
            });

            lazyImages.forEach((lazyImage) => {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // Fallback para navegadores antiguos
            lazyImages.forEach((img) => {
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
            });
        }
    }

    // Menu toggle functionality
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    // Close menu when clicking nav links
    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Smooth scroll with performance optimization
    function smoothScroll(e) {
        e.preventDefault();
        const target = e.currentTarget.getAttribute('href');
        const element = document.querySelector(target);
        if (!element) return;

        const offsetTop = element.offsetTop - 70; // Header height
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        // Close menu if mobile
        if (window.innerWidth <= 768) {
            closeMenu();
        }
    }

    // Throttled scroll handler for header
    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }

    // Event listeners
    function init() {
        // Carga de imágenes
        loadLazyImages();
        
        // Menu toggle
        menuToggle.addEventListener('click', toggleMenu);
        
        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', smoothScroll);
        });
        
        // Scroll event with throttling
        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
        
        // Initial header state
        updateHeader();

        // Precargar imágenes importantes
        if ('link' in document.createElement('link')) {
            const preloadLinks = [
                { href: 'img/logo.webp', as: 'image', type: 'image/webp' },
                { href: 'img/instalaciones.webp', as: 'image', type: 'image/webp' }
            ];
            
            preloadLinks.forEach(link => {
                const el = document.createElement('link');
                el.rel = 'preload';
                el.href = link.href;
                el.as = link.as;
                if (link.type) el.type = link.type;
                document.head.appendChild(el);
            });
        }
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();