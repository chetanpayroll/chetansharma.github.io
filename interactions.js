document.addEventListener('DOMContentLoaded', () => {
    // PHASE-6: PERFORMANCE HARDENING & ACCESSIBILITY GUARDRAILS

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check for mobile/touch devices to conserve battery/performance
    const isMobile = window.innerWidth <= 1024 || window.matchMedia('(hover: none)').matches;

    // 1. MAGNETIC BUTTONS & CARDS (Desktop Only + Motion Safe)
    if (!prefersReducedMotion && !isMobile) {
        const magneticElements = document.querySelectorAll('.btn, .nav-links a, .stat-card, .skill-chip');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Subtle magnetic pull (Performance optimized: using transform directly)
                requestAnimationFrame(() => {
                    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                });
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
                setTimeout(() => {
                    el.style.transform = '';
                }, 200);
            });
        });
    }

    // 2. TIME-BASED THEMING (Static overlay for performance)
    const hour = new Date().getHours();

    // Create an ambient overlay
    const ambient = document.createElement('div');
    ambient.style.position = 'fixed';
    ambient.style.top = '0';
    ambient.style.left = '0';
    ambient.style.width = '100%';
    ambient.style.height = '100%';
    ambient.style.pointerEvents = 'none'; // CRITICAL: Governance Rule - No blocking
    ambient.style.zIndex = '-1'; // CRITICAL: Governance Rule - Behind content
    ambient.style.mixBlendMode = 'overlay';
    ambient.style.opacity = '0.05'; // Reduced for subtle luxury

    if (hour >= 5 && hour < 12) {
        // Morning: Cool Blue Tint
        ambient.style.background = 'linear-gradient(to bottom, #dbeafe, transparent)';
    } else if (hour >= 12 && hour < 17) {
        // Afternoon: Neutral/Sunny
        ambient.style.background = 'transparent';
    } else if (hour >= 17 && hour < 20) {
        // Evening: Warm Golden Tint
        ambient.style.background = 'linear-gradient(to bottom, #ffedd5, transparent)';
    } else {
        // Night: Deep Blue Tint
        ambient.style.background = 'linear-gradient(to bottom, #1e1b4b, transparent)';
        ambient.style.opacity = '0.15';
    }

    document.body.appendChild(ambient);

    // 3. ENHANCED PARALLAX (Performance Gated)
    if (!prefersReducedMotion && !isMobile) {
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
        }, { passive: true }); // Passive listener for scroll performance

        function updateParallax(scrollY) {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translate3d(0, ${scrollY * 0.1}px, 0)`; // Force GPU
            }
        }
    }
});
