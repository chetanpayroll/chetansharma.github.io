document.addEventListener('DOMContentLoaded', () => {
    // 1. ULTRA-SUBTLE MAGNETIC INTERACTION
    // Reduces visual noise, adds "weight"
    const magneticElements = document.querySelectorAll('.btn, .nav-links a, .stat-card, .skill-chip');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Ultra-strong dampening for mass feeling (was 0.15)
            // Heavier elements move less
            const mass = el.classList.contains('stat-card') ? 0.02 : 0.05;

            el.style.transform = `translate(${x * mass}px, ${y * mass}px)`;
        });

        el.addEventListener('mouseleave', () => {
            // Let CSS transition handle the smooth return
            el.style.transform = '';
        });
    });

    // 2. ATMOSPHERIC AMBIENCE
    // Extremely low opacity for subconscious tinting only
    const hour = new Date().getHours();

    const ambient = document.createElement('div');
    Object.assign(ambient.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '9999',
        mixBlendMode: 'soft-light',
        transition: 'opacity 2s ease'
    });

    // Opacity reduced to <5% for "feeling" rather than "seeing"
    if (hour >= 5 && hour < 12) {
        ambient.style.background = 'linear-gradient(180deg, rgba(219, 234, 254, 0.05), transparent)'; // Morning
    } else if (hour >= 17 && hour < 20) {
        ambient.style.background = 'linear-gradient(180deg, rgba(255, 237, 213, 0.05), transparent)'; // Golden Hour
    } else if (hour >= 20 || hour < 5) {
        ambient.style.background = 'linear-gradient(180deg, rgba(30, 27, 75, 0.05), transparent)'; // Night
    } else {
        ambient.style.background = 'transparent';
    }

    document.body.appendChild(ambient);

    // 3. PHYSICAL PARALLAX
    // Heavier, smoother scrolling
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax(lastScrollY);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    function updateParallax(scrollY) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            // Very subtle fade/slide for hero to convey depth
            // Use 3d transform for GPU
            const opacity = 1 - (scrollY / 700);
            if (opacity > 0) {
                heroContent.style.opacity = opacity;
                heroContent.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
            }
        }
    }
});
