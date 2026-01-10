document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Reveal on Scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add scroll animation classes to elements
    const fadeElements = document.querySelectorAll('.step-card, .feature-card, .section-title, .themes-content, .themes-image-container, .dev-note-container');

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Inject visible class styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Scroll Physics
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;
    let scrollVelocity = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        scrollSpeed = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        // Add velocity based on scroll direction (inverted for parallax feel or direct for drag)
        // "move like they are in jelly as i scroll" -> Particles should probably be dragged along or pushed back?
        // Let's make them drag along slightly but with a lag (viscosity)
        scrollVelocity += scrollSpeed * 0.5;
    });

    // Particle Effect
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    // window.addEventListener('resize', resizeCanvas); // This is replaced by debounced version
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseVx = (Math.random() - 0.5) * 0.2;
            this.baseVy = (Math.random() - 0.5) * 0.2;
            this.vx = this.baseVx;
            this.vy = this.baseVy;
            this.size = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.3 + 0.1;
            this.life = Math.random() * 100;
            this.dragFactor = Math.random() * 0.05 + 0.02; // How much this particle is affected by "jelly"
        }

        update() {
            // Apply jelly physics
            // Scroll velocity decays over time (friction)
            scrollVelocity *= 0.90;

            // Apply scroll force to particle velocity (viscosity)
            // We want them to "squish" or move with scroll but lag behind
            // Let's add the scrollVelocity to the particle's y position directly for "drag" feel
            // effectively shifting them relative to viewport movement

            this.y -= scrollVelocity * this.dragFactor;

            this.x += this.vx;
            this.y += this.vy;

            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;

            // For Y wrap, we need to be careful with scroll shifting
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;

            // Pulse size subtly
            this.life += 0.01;
            this.currentAlpha = this.alpha + Math.sin(this.life) * 0.05;
        }

        draw() {
            ctx.fillStyle = `rgba(59, 130, 246, ${Math.max(0, this.currentAlpha)})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        // Clear array first in case of re-init
        particles = [];
        const particleCount = Math.min(window.innerWidth * 0.08, 150); // Increased density slightly
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Debounce resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initParticles();
        }, 200);
    });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Add a subtle "fog" layer if desired, or just particles
        // ctx.fillStyle = 'rgba(13, 13, 14, 0.1)'; 
        // ctx.fillRect(0,0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
});
