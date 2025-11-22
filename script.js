    // ============================================================================
    // PAGE LOADER
    // ============================================================================
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('page-loader').classList.add('hidden');
      }, 1500);
    });

    // ============================================================================
    // CUSTOM CURSOR & CURSOR PARTICLES
    // ============================================================================
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('cursor-dot');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Create cursor particle trail
      if (Math.random() > 0.8) {
        createCursorParticle(mouseX, mouseY);
      }
    });

    function animateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      cursorX += dx * 0.15;
      cursorY += dy * 0.15;
      
      const dx2 = mouseX - dotX;
      const dy2 = mouseY - dotY;
      dotX += dx2 * 0.3;
      dotY += dy2 * 0.3;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';
      
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover effects
    document.querySelectorAll('a, button, .stat-card, .project-card, .skill-chip').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    // Add click effect
    document.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-click');
    });

    function createCursorParticle(x, y) {
      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.setProperty('--tx', (Math.random() - 0.5) * 50 + 'px');
      particle.style.setProperty('--ty', (Math.random() - 0.5) * 50 + 'px');
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 800);
    }

    // ============================================================================
    // MOTION CONTROL & ACCESSIBILITY
    // ============================================================================
    let motionEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let threeScene = null;
    let animationFrameId = null;

    const motionToggle = document.getElementById('motionToggle');
    
    function updateMotionState(enabled) {
      motionEnabled = enabled;
      motionToggle.textContent = enabled ? '🎬' : '⏸️';
      motionToggle.setAttribute('aria-label', enabled ? 'Disable animations' : 'Enable animations');
      
      const canvas = document.getElementById('three-background');
      if (enabled) {
        initThreeJS();
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        canvas.style.opacity = '0';
      }
      
      localStorage.setItem('motionEnabled', enabled ? 'true' : 'false');
    }

    motionToggle.addEventListener('click', () => {
      updateMotionState(!motionEnabled);
    });

    const savedMotion = localStorage.getItem('motionEnabled');
    if (savedMotion !== null) {
      motionEnabled = savedMotion === 'true';
      motionToggle.textContent = motionEnabled ? '🎬' : '⏸️';
    }

    // ============================================================================
    // ADVANCED THREE.JS 3D BACKGROUND - Neural network particles
    // ============================================================================
    function initThreeJS() {
      if (!motionEnabled || !window.THREE) return;
      
      const canvas = document.getElementById('three-background');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ 
          canvas: canvas, 
          alpha: true, 
          antialias: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      } catch (e) {
        console.log('WebGL not supported');
        return;
      }

      camera.position.z = 60;

      // Neural network particle system
      const particleCount = 200;
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const connections = [];

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 120;
        positions[i + 1] = (Math.random() - 0.5) * 120;
        positions[i + 2] = (Math.random() - 0.5) * 120;
        
        velocities[i] = (Math.random() - 0.5) * 0.03;
        velocities[i + 1] = (Math.random() - 0.5) * 0.03;
        velocities[i + 2] = (Math.random() - 0.5) * 0.03;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0x0d47a1,
        size: 0.8,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Create connection lines
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x6a1b9a,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
      });

      // Floating geometric shapes
      const geometries = [
        new THREE.OctahedronGeometry(4, 0),
        new THREE.TetrahedronGeometry(5, 0),
        new THREE.IcosahedronGeometry(3, 0)
      ];

      const shapeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff416c,
        transparent: true,
        opacity: 0.08,
        wireframe: true
      });

      const shapes = [];
      for (let i = 0; i < 4; i++) {
        const shape = new THREE.Mesh(
          geometries[i % geometries.length],
          shapeMaterial
        );
        shape.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40
        );
        shapes.push(shape);
        scene.add(shape);
      }

      // Mouse parallax
      let mouseXParallax = 0;
      let mouseYParallax = 0;
      let targetXParallax = 0;
      let targetYParallax = 0;

      document.addEventListener('mousemove', (e) => {
        if (!motionEnabled) return;
        mouseXParallax = (e.clientX / window.innerWidth) * 2 - 1;
        mouseYParallax = -(e.clientY / window.innerHeight) * 2 + 1;
      });

      // Animation loop
      function animate() {
        if (!motionEnabled) return;
        
        animationFrameId = requestAnimationFrame(animate);

        // Smooth camera parallax
        targetXParallax = mouseXParallax * 8;
        targetYParallax = mouseYParallax * 8;
        camera.position.x += (targetXParallax - camera.position.x) * 0.03;
        camera.position.y += (targetYParallax - camera.position.y) * 0.03;

        // Animate particles
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Boundary wrapping with smooth transition
          if (Math.abs(positions[i]) > 60) velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 60) velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 60) velocities[i + 2] *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Draw connection lines between close particles
        const linePositions = [];
        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < 15) {
              linePositions.push(
                positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
              );
            }
          }
        }

        // Update lines
        connections.forEach(line => scene.remove(line));
        connections.length = 0;
        
        if (linePositions.length > 0) {
          const lineGeometry = new THREE.BufferGeometry();
          lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
          const line = new THREE.LineSegments(lineGeometry, lineMaterial);
          scene.add(line);
          connections.push(line);
        }

        // Rotate shapes
        shapes.forEach((shape, index) => {
          shape.rotation.x += 0.002 * (index + 1);
          shape.rotation.y += 0.003 * (index + 1);
          shape.rotation.z += 0.001 * (index + 1);
          
          // Float up and down
          shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        });

        renderer.render(scene, camera);
      }

      // Handle resize
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }, 100);
      });

      animate();
      canvas.classList.add('loaded');
      threeScene = { scene, camera, renderer, particles, shapes };
    }

    // Lazy load Three.js
    if (motionEnabled) {
      if (document.readyState === 'complete') {
        setTimeout(initThreeJS, 100);
      } else {
        window.addEventListener('load', () => setTimeout(initThreeJS, 100));
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else if (motionEnabled) {
        initThreeJS();
      }
    });

    // ============================================================================
    // READING PROGRESS BAR
    // ============================================================================
    const progressBar = document.getElementById('reading-progress');
    
    function updateReadingProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.pageYOffset;
      const progress = (scrolled / documentHeight) * 100;
      
      progressBar.style.width = `${Math.min(progress, 100)}%`;
      progressBar.setAttribute('aria-valuenow', Math.round(progress));
    }

    window.addEventListener('scroll', updateReadingProgress, { passive: true });

    // ============================================================================
    // SCROLL-TRIGGERED REVEAL ANIMATIONS
    // ============================================================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================================================
    // PARALLAX EFFECT
    // ============================================================================
    const parallaxElements = document.querySelectorAll('.parallax-layer');
    let ticking = false;

    function updateParallax() {
      if (!motionEnabled) return;
      
      const scrollY = window.pageYOffset;
      parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.05;
        const yPos = -(scrollY * speed);
        el.style.transform = `translateY(${yPos}px) translateZ(${index * 2}px)`;
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!motionEnabled) return;
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    // ============================================================================
    // 3D CARD TILT EFFECT
    // ============================================================================
    const tiltCards = document.querySelectorAll('.project-card, .stat-card, .skill-category');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (!motionEnabled) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) translateZ(20px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // ============================================================================
    // NAVIGATION SCROLL EFFECT
    // ============================================================================
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });

    // ============================================================================
    // THEME TOGGLE
    // ============================================================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    function initTheme() {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme) {
        htmlElement.style.colorScheme = savedTheme;
        updateThemeButton(savedTheme);
      } else if (prefersDark) {
        htmlElement.style.colorScheme = 'dark';
        updateThemeButton('dark');
      }
    }

    function updateThemeButton(theme) {
      themeToggle.querySelector('span').textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.style.colorScheme || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.style.colorScheme = newTheme;
      localStorage.setItem('theme', newTheme);
      updateThemeButton(newTheme);
    });

    // ============================================================================
    // DOWNLOAD BUTTONS
    // ============================================================================
    document.getElementById('downloadPDF').addEventListener('click', () => {
      window.print();
    });

    document.getElementById('downloadVCard').addEventListener('click', () => {
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Chetan Sharma
N:Sharma;Chetan;;;
TITLE:Payroll Implementation Manager
EMAIL:chetanpayroll@gmail.com
TEL:+918611949558
URL:https://www.gmppayroll.com
URL:https://www.linkedin.com/in/chetansharma-gp
ADR;;Gurgaon;Haryana;;India
END:VCARD`;
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(vcard));
      element.setAttribute('download', 'chetan-sharma.vcf');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });

    // ============================================================================
    // LIGHTBOX FUNCTIONALITY
    // ============================================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentImageIndex = 0;
    let galleryImages = [];

    function initGallery() {
      galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
      
      galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
          openLightbox(index);
        });
        
        img.setAttribute('tabindex', '0');
        img.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(index);
          }
        });
      });
    }

    function openLightbox(index) {
      currentImageIndex = index;
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightboxImage() {
      if (galleryImages.length === 0) return;
      
      const img = galleryImages[currentImageIndex];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt || '';
      
      lightboxPrev.disabled = currentImageIndex === 0;
      lightboxNext.disabled = currentImageIndex === galleryImages.length - 1;
    }

    function showPrevImage() {
      if (currentImageIndex > 0) {
        currentImageIndex--;
        updateLightboxImage();
      }
    }

    function showNextImage() {
      if (currentImageIndex < galleryImages.length - 1) {
        currentImageIndex++;
        updateLightboxImage();
      }
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    });

    initGallery();

    // ============================================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // ============================================================================
    // RIPPLE EFFECT ON CLICKS
    // ============================================================================
    document.querySelectorAll('.btn, .contact-link').forEach(el => {
      el.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    initTheme();
    document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
  </script>

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  });
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        'event_category': 'Button',
        'event_label': this.textContent.trim()
      });
    }
  });
});

// Track scroll depth
let scrollDepth = 0;
window.addEventListener('scroll', () => {
  const winHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset;
  const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
  
  if (scrollPercent > scrollDepth + 25) {
    scrollDepth = Math.floor(scrollPercent / 25) * 25;
    if (typeof gtag !== 'undefined') {
      gtag('event', 'scroll', {
        'event_category': 'Engagement',
        'event_label': scrollDepth + '%'
      });
    }
  }
});

// Conditional Three.js loading - only on desktop
function shouldLoadThreeJS() {
  return window.innerWidth > 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Modify the initThreeJS function call to be conditional
const originalInitThreeJS = initThreeJS;
initThreeJS = function() {
  if (shouldLoadThreeJS()) {
    return originalInitThreeJS();
  } else {
    const canvas = document.getElementById('three-background');
    if (canvas) canvas.style.display = 'none';
  }
};
