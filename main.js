(function() {
    'use strict';

    // ==========================================================================
    // CONSTANTS & STATE
    // ==========================================================================
    const STATES = {
        BOOT: 'BOOT',
        BROWSE: 'BROWSE',
        CASE_FOCUS: 'CASE_FOCUS',
        CONTACT: 'CONTACT'
    };

    let currentState = STATES.BOOT;

    // ==========================================================================
    // EVENT BUS
    // ==========================================================================
    const eventBus = {
        events: {},
        on(event, callback) {
            if (!this.events[event]) this.events[event] = [];
            this.events[event].push(callback);
        },
        emit(event, data) {
            if (this.events[event]) {
                this.events[event].forEach(callback => callback(data));
            }
        }
    };

    // ==========================================================================
    // BOOT SEQUENCE
    // ==========================================================================
    const bootOverlay = document.getElementById('boot-overlay');
    const bootLog = document.getElementById('boot-log');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const bootLines = [
        'INITIALIZING OPERATOR SHELL...',
        'LOADING CASE FILES...',
        'ESTABLISHING SECURE CONNECTION...',
        'INTEGRITY CHECK: 98.7%',
        'SYSTEM READY.'
    ];

    function typeBootSequence() {
        if (prefersReducedMotion) {
            endBootSequence();
            return;
        }

        let lineIndex = 0;
        let charIndex = 0;
        let currentText = '';

        function typeChar() {
            if (lineIndex >= bootLines.length) {
                setTimeout(endBootSequence, 500);
                return;
            }

            const line = bootLines[lineIndex];
            if (charIndex < line.length) {
                currentText += line[charIndex];
                bootLog.textContent = currentText + '█';
                charIndex++;
                setTimeout(typeChar, 30);
            } else {
                currentText += '\n';
                bootLog.textContent = currentText + '█';
                lineIndex++;
                charIndex = 0;
                setTimeout(typeChar, 400);
            }
        }

        typeChar();
    }

    function endBootSequence() {
        bootOverlay.classList.add('hidden');
        currentState = STATES.BROWSE;
        eventBus.emit('stateChange', currentState);
    }

    function skipBoot() {
        if (currentState === STATES.BOOT) {
            endBootSequence();
        }
    }

    // Boot event listeners
    bootOverlay.addEventListener('click', skipBoot);
    document.addEventListener('keydown', skipBoot);

    // Start boot sequence
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', typeBootSequence);
    } else {
        typeBootSequence();
    }

    // ==========================================================================
    // TELEMETRY / COUNTERS
    // ==========================================================================
    const telemValues = document.querySelectorAll('.telem-value');

    function animateValue(el, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            el.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const telemetryObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                animateValue(el, 0, target, 1500);
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    telemValues.forEach(el => telemetryObserver.observe(el));

    // ==========================================================================
    // CASE FILE INTERACTIONS
    // ==========================================================================
    const caseFiles = document.querySelectorAll('.case-file');

    caseFiles.forEach(file => {
        file.addEventListener('click', () => {
            currentState = STATES.CASE_FOCUS;
            eventBus.emit('stateChange', currentState);
        });
        
        // Keyboard accessibility
        file.setAttribute('tabindex', '0');
        file.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                file.click();
            }
        });
    });

    // Banner CTA
    document.getElementById('banner-cta').addEventListener('click', () => {
        document.getElementById('case-files').scrollIntoView({ behavior: 'smooth' });
        currentState = STATES.CASE_FOCUS;
        eventBus.emit('stateChange', currentState);
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================================================================
    // STATUS BAR / CLOCK / SCROLL PROGRESS
    // ==========================================================================
    const clockEl = document.getElementById('live-clock');
    const progressEl = document.getElementById('scroll-progress');

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-GB', { hour12: false });
        clockEl.textContent = `SYS_TIME: ${timeString}`;
    }

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
        progressEl.textContent = `SCROLL: ${progress}%`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // ==========================================================================
    // PARTICLE CANVAS (LIGHTWEIGHT)
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let isPaused = false;

    function initCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        const particleCount = Math.min(40, Math.floor(window.innerWidth / 30));
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
            if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 172, 193, 0.3)';
            ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 172, 193, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        if (!isPaused) {
            animationFrameId = requestAnimationFrame(drawParticles);
        }
    }

    function handleVisibilityChange() {
        if (document.hidden) {
            isPaused = true;
            cancelAnimationFrame(animationFrameId);
        } else {
            isPaused = false;
            drawParticles();
        }
    }

    function handleResize() {
        initCanvas();
    }

    if (!prefersReducedMotion && window.innerWidth > 860) {
        initCanvas();
        drawParticles();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('resize', handleResize);
    }

    // ==========================================================================
    // INIT
    // ==========================================================================
    eventBus.on('stateChange', (newState) => {
        console.log(`State transitioned to: ${newState}`);
    });

})();
