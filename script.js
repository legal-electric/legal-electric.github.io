document.addEventListener('DOMContentLoaded', function() {
    // Menu hamburguesa mejorado
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const body = document.body;
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });
    
    // Scroll suave mejorado con polyfill para Safari
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Usar scrollIntoView con polyfill si es necesario
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback para navegadores antiguos
                    smoothScrollTo(targetElement.offsetTop - 80, 800);
                }
            }
        });
    });
    
    // Header con mejor detección de scroll
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        
        // Solo animar si el desplazamiento es mayor a 100px
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            
            // Ocultar/mostrar header basado en dirección de scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Función de scroll suave para navegadores antiguos
    function smoothScrollTo(endY, duration) {
        const startY = window.scrollY;
        const distance = endY - startY;
        const startTime = new Date().getTime();
        
        function scroll() {
            const currentTime = new Date().getTime();
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            window.scrollTo(0, startY + (distance * progress));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(scroll);
            }
        }
        
        scroll();
    }
    
    // Detectar cambios en la orientación del dispositivo
    window.addEventListener('orientationchange', function() {
        // Forzar recálculo de dimensiones
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
    });
});