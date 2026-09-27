/* ==========================================================================
   PRIYANSH RAVAL // CYBERPUNK HUD PORTFOLIO
   IIFE → STATE → EVENT BUS → BOOT → TELEMETRY → INTERACTIONS → STATUS → CANVAS → INIT
   ========================================================================== */

(function () {
    'use strict';

    /* ======================================================================
       CONSTANTS & STATE
       ====================================================================== */
    const STATES = {
        BOOT: 'BOOT',
        BROWSE: 'BROWSE',
        CASE_FOCUS: 'CASE_FOCUS',
        CONTACT: 'CONTACT'
    };

    const state = {
        current: STATES.BOOT,
        bootComplete: false,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isMobile: window.innerWidth <= 860
    };

    /* ======================================================================
       EVENT BUS — tiny pub/sub for decoupled modules
       ====================================================================== */
    const eventBus = {
        events: Object.create(null),
        on(event, callback) {
            if (!this.events[event]) this.events[event] = [];
            this.events[event].push(callback);
            return () => this.off(event, callback);
        },
        off(event, callback) {
            if (!this.events[event]) return;
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        },
        emit(event, data) {
            if (!this.events[event]) return;
            this.events[event].forEach(callback => {
                try { callback(data); }
                catch (err) { console.error(`[EventBus] Error in "${event}" handler:`, err); }
            });
        }
    };

    /* ======================================================================
       UTILITIES
       ====================================================================== */
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    function onReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    /* ======================================================================
       BOOT SEQUENCE
       ====================================================================== */
    const BootSequence = (() => {
        const overlay = $('#boot-overlay');
        const log = $('#boot-log');

        const lines = [
            '> INITIALIZING OPERATOR SHELL...',
            '> LOADING CASE FILES...',
            '> ESTABLISHING SECURE CONNECTION...',
            '> INTEGRITY CHECK: 98.7%',
            '> SYSTEM READY.'
        ];

        let timer = null;
        let finished = false;

        function type() {
            if (!log) return;

            if (state.prefersReducedMotion) {
                log.textContent = lines.join('\n');
                finish();
                return;
            }

            let lineIdx = 0;
            let charIdx = 0;
            let buffer = '';

            function tick() {
                if (lineIdx >= lines.length) {
                    setTimeout(finish, 600);
                    return;
                }

                const line = lines[lineIdx];

                if (charIdx < line.length) {
                    buffer += line[charIdx++];
                    log.textContent = buffer + '█';
                    timer = setTimeout(tick, 28);
                } else {
                    buffer += '\n';
                    log.textContent = buffer + '█';
                    lineIdx++;
                    charIdx = 0;
                    timer = setTimeout(tick, 350);
                }
            }

            tick();
        }

        function finish() {
            if (finished) return;
            finished = true;
            clearTimeout(timer);

            if (overlay) {
                overlay.classList.add('hidden');
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 600);
            }

            state.bootComplete = true;
            transitionTo(STATES.BROWSE);
        }

        function skip() {
            if (!state.bootComplete) finish();
        }

        function init() {
            if (!overlay) return;

            // Always hide on reduced motion
            if (state.prefersReducedMotion) {
                overlay.style.display = 'none';
                state.bootComplete = true;
                transitionTo(STATES.BROWSE);
                return;
            }

            overlay.addEventListener('click', skip, { once: true });
            document.addEventListener('keydown', skip, { once: true });

            // Also listen for scroll to skip
            window.addEventListener('wheel', skip, { passive: true, once: true });
            window.addEventListener('touchstart', skip, { passive: true, once: true });

            type();
        }

        return { init, finish };
    })();

    /* ======================================================================
       STATE MACHINE
       ====================================================================== */
    function transitionTo(newState) {
        if (state.current === newState) return;
        const prev = state.current;
        state.current = newState;
        eventBus.emit('state:change', { from: prev, to: newState });
    }

    /* ======================================================================
       TELEMETRY COUNTERS
       ====================================================================== */
    const Telemetry = (() => {
        function animateValue(el, target, duration = 1400) {
            if (!el) return;

            const startTime = performance.now();
            el.classList.add('counting');

            function frame(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(eased * target);

                el.textContent = value;

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    el.textContent = target;
                    el.classList.remove('counting');
                }
            }

            requestAnimationFrame(frame);
        }

        function init() {
            const values = $$('.telem-value');
            if (!values.length) return;

            if (state.prefersReducedMotion) {
                values.forEach(el => {
                    el.textContent = el.dataset.target || '0';
                });
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10) || 0;
                    animateValue(el, target);
                    observer.unobserve(el);
                });
            }, { threshold: 0.4, rootMargin: '0px 0px -50px 0px' });

            values.forEach(el => observer.observe(el));
        }

        return { init };
    })();

    /* ======================================================================
       SMOOTH SCROLL
       ====================================================================== */
    const SmoothScroll = (() => {
        function init() {
            $$('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (!href || href === '#') return;

                    const target = document.querySelector(href);
                    if (!target) return;

                    e.preventDefault();

                    const headerOffset = 80;
                    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: targetTop,
                        behavior: state.prefersReducedMotion ? 'auto' : 'smooth'
                    });

                    // Update state based on section
                    const id = href.slice(1);
                    if (id === 'contact') transitionTo(STATES.CONTACT);
                    else if (id === 'case-files' || id.startsWith('case-')) transitionTo(STATES.CASE_FOCUS);

                    // Move focus for accessibility
                    target.setAttribute('tabindex', '-1');
                    setTimeout(() => target.focus({ preventScroll: true }), 400);
                });
            });
        }

        return { init };
    })();

    /* ======================================================================
       CASE FILE INTERACTIONS
       ====================================================================== */
    const CaseFiles = (() => {
        function init() {
            const files = $$('.case-file');
            if (!files.length) return;

            files.forEach(file => {
                // Ensure keyboard accessibility
                if (!file.hasAttribute('tabindex')) file.setAttribute('tabindex', '0');
                file.setAttribute('role', 'article');

                file.addEventListener('click', (e) => {
                    // Don't trigger if user clicked a link or button
                    if (e.target.closest('a, button')) return;
                    transitionTo(STATES.CASE_FOCUS);
                    eventBus.emit('case:focus', { id: file.id });
                });

                file.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        file.click();
                    }
                });
            });
        }

        return { init };
    })();

    /* ======================================================================
       BANNER CTA
       ====================================================================== */
    const Banner = (() => {
        function init() {
            const cta = $('#banner-cta');
            const banner = $('#incident-banner');
            if (!cta || !banner) return;

            cta.addEventListener('click', () => {
                const target = $('#case-files');
                if (!target) return;

                const headerOffset = 80;
                const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: targetTop,
                    behavior: state.prefersReducedMotion ? 'auto' : 'smooth'
                });

                transitionTo(STATES.CASE_FOCUS);
            });
        }

        return { init };
    })();

    /* ======================================================================
       STATUS BAR — CLOCK + SCROLL PROGRESS
       ====================================================================== */
    const StatusBar = (() => {
        let clockEl = null;
        let progressEl = null;
        let clockTimer = null;
        let scrollRaf = null;

        function updateClock() {
            if (!clockEl) return;
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            clockEl.textContent = `SYS_TIME: ${h}:${m}:${s}`;
        }

        function updateProgress() {
            if (!progressEl) return;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(Math.round((scrollTop / docHeight) * 100), 100) : 0;
            progressEl.textContent = `SCROLL: ${progress}%`;
            scrollRaf = null;
        }

        function onScroll() {
            if (scrollRaf !== null) return;
            scrollRaf = requestAnimationFrame(updateProgress);
        }

        function init() {
            clockEl = $('#live-clock');
            progressEl = $('#scroll-progress');

            if (clockEl) {
                updateClock();
                clockTimer = setInterval(updateClock, 1000);
            }

            if (progressEl) {
                updateProgress();
                window.addEventListener('scroll', onScroll, { passive: true });
            }

            // Pause clock when tab hidden (performance)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    if (clockTimer) clearInterval(clockTimer);
                    clockTimer = null;
                } else {
                    if (!clockTimer && clockEl) {
                        updateClock();
                        clockTimer = setInterval(updateClock, 1000);
                    }
                }
            });
        }

        return { init };
    })();

    /* ======================================================================
       PARTICLE CANVAS — lightweight, DPR-aware, paused when hidden
       ====================================================================== */
    const ParticleField = (() => {
        let canvas = null;
        let ctx = null;
        let particles = [];
        let rafId = null;
        let running = false;
        let resizeTimer = null;

        const CONFIG = {
            maxParticles: 40,
            particleDensity: 30,      // 1 particle per N px of width
            maxConnectionDist: 120,
            speed: 0.4,
            minRadius: 0.5,
            maxRadius: 2,
            particleColor: 'rgba(0, 172, 193, 0.35)',
            lineColor: 'rgba(0, 172, 193, 0.12)'
        };

        function resize() {
            if (!canvas || !ctx) return;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = window.innerWidth;
            const h = window.innerHeight;

            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            const count = Math.min(
                CONFIG.maxParticles,
                Math.floor(w / CONFIG.particleDensity)
            );

            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * CONFIG.speed * 2,
                vy: (Math.random() - 0.5) * CONFIG.speed * 2,
                r: CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius)
            }));
        }

        function draw() {
            if (!ctx || !canvas) return;

            const w = window.innerWidth;
            const h = window.innerHeight;

            ctx.clearRect(0, 0, w, h);

            // Update + draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                // Bounce on edges
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                // Clamp inside
                p.x = Math.max(0, Math.min(w, p.x));
                p.y = Math.max(0, Math.min(h, p.y));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = CONFIG.particleColor;
                ctx.fill();
            }

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distSq = dx * dx + dy * dy;
                    const maxSq = CONFIG.maxConnectionDist * CONFIG.maxConnectionDist;

                    if (distSq < maxSq) {
                        const dist = Math.sqrt(distSq);
                        const alpha = 0.12 * (1 - dist / CONFIG.maxConnectionDist);
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(0, 172, 193, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            if (running) rafId = requestAnimationFrame(draw);
        }

        function start() {
            if (running || !canvas) return;
            running = true;
            rafId = requestAnimationFrame(draw);
        }

        function stop() {
            running = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        function onResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resize();
            }, 150);
        }

        function onVisibility() {
            if (document.hidden) stop();
            else if (!state.prefersReducedMotion && !state.isMobile) start();
        }

        function init() {
            canvas = $('#particle-canvas');

            // Bail on unsupported / disabled environments
            if (!canvas) return;
            if (state.prefersReducedMotion) {
                canvas.style.display = 'none';
                return;
            }
            if (state.isMobile) {
                canvas.style.display = 'none';
                return;
            }

            ctx = canvas.getContext('2d');
            if (!ctx) {
                canvas.style.display = 'none';
                return;
            }

            resize();
            start();

            window.addEventListener('resize', onResize, { passive: true });
            document.addEventListener('visibilitychange', onVisibility);
        }

        function destroy() {
            stop();
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibility);
        }

        return { init, destroy };
    })();

    /* ======================================================================
       ACTIVE SECTION HIGHLIGHT (Optional — highlights nav link)
       ====================================================================== */
    const ActiveNav = (() => {
        function init() {
            const navLinks = $$('.nav-links a');
            if (!navLinks.length) return;

            const sections = navLinks
                .map(link => {
                    const id = link.getAttribute('href');
                    if (!id || id === '#') return null;
                    const el = document.querySelector(id);
                    return el ? { link, section: el } : null;
                })
                .filter(Boolean);

            if (!sections.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const match = sections.find(s => s.section === entry.target);
                    if (!match) return;

                    if (entry.isIntersecting) {
                        navLinks.forEach(l => l.style.color = '');
                        match.link.style.color = 'var(--cyan)';
                    }
                });
            }, {
                rootMargin: '-40% 0px -40% 0px',
                threshold: 0
            });

            sections.forEach(s => observer.observe(s.section));
        }

        return { init };
    })();

    /* ======================================================================
       GLOBAL ERROR HANDLER — never crash silently
       ====================================================================== */
    window.addEventListener('error', (e) => {
        console.error('[Portfolio Error]', e.message, e.filename, e.lineno);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('[Unhandled Promise]', e.reason);
    });

    /* ======================================================================
       BOOTSTRAP
       ====================================================================== */
    onReady(() => {
        // Init modules in order
        BootSequence.init();
        Telemetry.init();
        SmoothScroll.init();
        CaseFiles.init();
        Banner.init();
        StatusBar.init();
        ParticleField.init();
        ActiveNav.init();

        // Fire ready event for potential extensions
        eventBus.emit('app:ready', { state });

        // Log state changes (useful for debugging)
        eventBus.on('state:change', ({ from, to }) => {
            // Uncomment for debugging:
            // console.log(`[State] ${from} → ${to}`);
        });
    });

    /* ======================================================================
       HANDLE ORIENTATION / BREAKPOINT CHANGES
       ====================================================================== */
    window.addEventListener('resize', () => {
        const nowMobile = window.innerWidth <= 860;
        if (nowMobile !== state.isMobile) {
            state.isMobile = nowMobile;

            const canvas = $('#particle-canvas');
            if (nowMobile) {
                ParticleField.destroy();
                if (canvas) canvas.style.display = 'none';
            } else if (!state.prefersReducedMotion) {
                if (canvas) canvas.style.display = 'block';
                ParticleField.init();
            }
        }
    }, { passive: true });

})();
