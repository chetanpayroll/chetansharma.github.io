    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
      document.documentElement.style.colorScheme = 'dark';
    }

    // CUSTOM CURSOR
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('cursor-dot');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (Math.random() > 0.7) {
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

    document.querySelectorAll('a, button, .toc li, code, .cta-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    document.addEventListener('mousedown', (e) => {
      document.body.classList.add('cursor-click');
      createParticleExplosion(e.clientX, e.clientY);
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
      
      setTimeout(() => particle.remove(), 1000);
    }

    function createParticleExplosion(x, y) {
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-explosion';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        particle.style.setProperty('--ex', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ey', Math.sin(angle) * distance + 'px');
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 600);
      }
    }

    // READING PROGRESS
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

    // THREE.JS
    let scene, camera, renderer, particles, connections;
    let scrollY = 0;
    let animationId;

    function initThreeBackground() {
      if (prefersReducedMotion || typeof THREE === 'undefined') return;

      const canvas = document.getElementById('three-background');
      if (!canvas) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 60;

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

      const particleCount = 300;
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

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
        color: prefersDark ? 0x00f3ff : 0x0d47a1,
        size: 1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: prefersDark ? 0xbf00ff : 0x6a1b9a,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });

      connections = [];

      let targetXParallax = 0, targetYParallax = 0;

      document.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion) return;
        const mouseXParallax = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseYParallax = -(e.clientY / window.innerHeight) * 2 + 1;
        targetXParallax = mouseXParallax * 10;
        targetYParallax = mouseYParallax * 10;
      });

      function animate() {
        if (prefersReducedMotion) return;
        animationId = requestAnimationFrame(animate);

        camera.position.x += (targetXParallax - camera.position.x) * 0.03;
        camera.position.y += (targetYParallax - camera.position.y) * 0.03;

        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          if (Math.abs(positions[i]) > 60) velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 60) velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 60) velocities[i + 2] *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        const linePositions = [];
        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < 20) {
              linePositions.push(
                positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
              );
            }
          }
        }

        connections.forEach(line => scene.remove(line));
        connections.length = 0;
        
        if (linePositions.length > 0) {
          const lineGeometry = new THREE.BufferGeometry();
          lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
          const line = new THREE.LineSegments(lineGeometry, lineMaterial);
          scene.add(line);
          connections.push(line);
        }

        renderer.render(scene, camera);
      }

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      animate();
      
      setTimeout(() => {
        canvas.classList.add('loaded');
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
          loadingIndicator.classList.add('hidden');
        }
      }, 800);
    }

    // SCROLL REVEAL
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    function initScrollReveal() {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));

      const h2Elements = document.querySelectorAll('.article-content h2');
      h2Elements.forEach(el => observer.observe(el));
    }

    // FLOATING TOC
    function updateActiveTocSection() {
      const sections = document.querySelectorAll('h2[id]');
      const tocLinks = document.querySelectorAll('.floating-toc a');
      
      let currentSection = '';
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 0) {
          currentSection = section.id;
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }

    let scrollThrottle;
    window.addEventListener('scroll', () => {
      if (scrollThrottle) return;
      scrollThrottle = setTimeout(() => {
        scrollY = window.scrollY;
        
        const nav = document.querySelector('nav');
        if (nav) {
          if (scrollY > 100) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
        }

        const floatingToc = document.querySelector('.floating-toc');
        if (floatingToc) {
          if (scrollY > 500) {
            floatingToc.classList.add('visible');
          } else {
            floatingToc.classList.remove('visible');
          }
        }

        updateActiveTocSection();
        
        scrollThrottle = null;
      }, 16);
    }, { passive: true });

    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // RIPPLE EFFECT
    document.querySelectorAll('.cta-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.width = ripple.style.height = '10px';
        ripple.style.left = e.offsetX + 'px';
        ripple.style.top = e.offsetY + 'px';
        ripple.style.animation = 'ripple 0.6s ease-out';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // INITIALIZATION
    function init() {
      if (!prefersReducedMotion) {
        setTimeout(() => {
          initThreeBackground();
        }, 100);
      } else {
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
          setTimeout(() => loadingIndicator.classList.add('hidden'), 500);
        }
      }

      initScrollReveal();
      updateActiveTocSection();
      updateReadingProgress();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && animationId) {
        cancelAnimationFrame(animationId);
      } else if (!prefersReducedMotion && scene) {
        animate();
      }
    });
