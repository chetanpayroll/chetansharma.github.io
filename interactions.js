document.addEventListener('DOMContentLoaded', () => {
    // 1. MAGNETIC BUTTONS & CARDS
    const magneticElements = document.querySelectorAll('.btn, .nav-links a, .stat-card, .skill-chip');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle magnetic pull
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            // Re-apply hover scale if needed via CSS, here we just reset translation
            // CSS hover states will handle scale
            setTimeout(() => {
                 el.style.transform = '';
            }, 200);
        });
    });

    // 2. TIME-BASED THEMING (Subtle tint overlay)
    const hour = new Date().getHours();
    const root = document.documentElement;
    
    // Create an ambient overlay
    const ambient = document.createElement('div');
    ambient.style.position = 'fixed';
    ambient.style.top = '0';
    ambient.style.left = '0';
    ambient.style.width = '100%';
    ambient.style.height = '100%';
    ambient.style.pointerEvents = 'none';
    ambient.style.zIndex = '9999';
    ambient.style.mixBlendMode = 'overlay';
    ambient.style.opacity = '0.1';
    
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
        ambient.style.opacity = '0.2';
    }
    
    document.body.appendChild(ambient);
    
    // 3. ENHANCED PARALLAX (Multi-speed)
    // Existing script handles basic parallax. We add more depth.
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Target background shapes if possible (if we had them in HTML)
        // Adjust hero content
        const heroContent = document.querySelector('.hero-content');
        if(heroContent) {
           heroContent.style.transform = `translateY(${scrolled * 0.1}px)`; 
        }
        
        const heroBg = document.querySelector('.hero::before'); // Pseudo-elements can't be styled via JS directly easily
        
        // Parallax for sections
        const sections = document.querySelectorAll('section');
        sections.forEach((sec, index) => {
            const speed = 0.05 * (index % 2 === 0 ? 1 : -1);
            // Too invasive to move sections, stick to internal elements
        });
    });
});
