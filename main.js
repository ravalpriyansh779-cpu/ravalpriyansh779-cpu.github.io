/* ============================================================
   PHOSPHOR WORKBENCH — Priyansh Raval Portfolio
   Vanilla JS. Zero dependencies. No build step.
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       CONFIG & STATE
       ============================================================ */
    const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const STORAGE_KEY = 'pr-theme';

    const state = {
        prefersReducedMotion: PREFERS_REDUCED_MOTION,
        isMobile: window.innerWidth <= 900
    };

    /* ============================================================
       UTILITIES
       ============================================================ */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const onReady = (fn) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
            fn();
        }
    };

    /* ============================================================
       THEME TOGGLE
       ============================================================ */
    const Theme = (() => {
        const root = document.documentElement;
        const toggle = $('#theme-toggle');

        function apply(theme) {
            root.setAttribute('data-theme', theme);
            const metaTheme = document.querySelector('meta[name="theme-color"]');
            if (metaTheme) {
                metaTheme.setAttribute('content', theme === 'dark' ? '#0f1419' : '#f7f6f3');
            }
            try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
        }

        function getInitial() {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved === 'light' || saved === 'dark') return saved;
            } catch (e) {}
            return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }

        function toggleTheme() {
            const current = root.getAttribute('data-theme') || 'dark';
            apply(current === 'dark' ? 'light' : 'dark');
        }

        function init() {
            apply(getInitial());
            if (toggle) {
                toggle.addEventListener('click', toggleTheme);
            }
        }

        return { init };
    })();

    /* ============================================================
       COUNT-UP METRICS
       ============================================================ */
    const Counters = (() => {
        function animate(el, target, duration = 1400) {
            if (!el) return;
            const start = performance.now();

            function frame(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                const value = Math.floor(eased * target);

                el.textContent = value;

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    el.textContent = target;
                }
            }
            requestAnimationFrame(frame);
        }

        function init() {
            const counters = $$('.count');
            if (!counters.length) return;

            if (state.prefersReducedMotion) {
                counters.forEach(el => { el.textContent = el.dataset.target || '0'; });
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10) || 0;
                    animate(el, target);
                    observer.unobserve(el);
                });
            }, { threshold: 0.4, rootMargin: '0px 0px -40px 0px' });

            counters.forEach(el => observer.observe(el));
        }

        return { init };
    })();

    /* ============================================================
       SMOOTH SCROLL (anchor links, respects header offset)
       ============================================================ */
    const SmoothScroll = (() => {
        function init() {
            const headerEl = $('.site-header');
            const headerOffset = headerEl ? headerEl.offsetHeight + 20 : 80;

            $$('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (!href || href === '#' || href === '#top') {
                        if (href === '#top') {
                            e.preventDefault();
                            window.scrollTo({
                                top: 0,
                                behavior: state.prefersReducedMotion ? 'auto' : 'smooth'
                            });
                        }
                        return;
                    }

                    const target = document.querySelector(href);
                    if (!target) return;

                    e.preventDefault();
                    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top,
                        behavior: state.prefersReducedMotion ? 'auto' : 'smooth'
                    });
                });
            });
        }

        return { init };
    })();

    /* ============================================================
       ACTIVE NAV HIGHLIGHT
       ============================================================ */
    const ActiveNav = (() => {
        function init() {
            const navLinks = $$('.primary-nav a');
            if (!navLinks.length) return;

            const pairs = navLinks
                .map(link => {
                    const id = link.getAttribute('href');
                    if (!id || id === '#top' || id.length < 2) return null;
                    const section = document.querySelector(id);
                    return section ? { link, section } : null;
                })
                .filter(Boolean);

            if (!pairs.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const match = pairs.find(p => p.section === entry.target);
                    if (!match) return;
                    navLinks.forEach(l => l.style.color = '');
                    match.link.style.color = 'var(--text-primary)';
                });
            }, {
                rootMargin: '-45% 0px -45% 0px',
                threshold: 0
            });

            pairs.forEach(p => observer.observe(p.section));
        }

        return { init };
    })();

    /* ============================================================
       PARTICLE FIELD — subtle, DPR-aware, paused when hidden
       ============================================================ */
    const ParticleField = (() => {
        let canvas, ctx;
        let particles = [];
        let rafId = null;
        let running = false;

        const CONFIG = {
            maxCount: 32,
            density: 34000,       // 1 particle per N px² of viewport
            maxDistance: 130,
            speed: 0.28,
            minRadius: 0.6,
            maxRadius: 1.7,
            dotColor: 'rgba(212, 169, 74, 0.28)',
            lineColor: 'rgba(212, 169, 74, 0.10)'
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

            const count = Math.min(CONFIG.maxCount, Math.floor((w * h) / CONFIG.density));

            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * CONFIG.speed * 2,
                vy: (Math.random() - 0.5) * CONFIG.speed * 2,
                r: CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius)
            }));
        }

        function draw() {
            if (!ctx) return;
            const w = window.innerWidth;
            const h = window.innerHeight;

            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                p.x = Math.max(0, Math.min(w, p.x));
                p.y = Math.max(0, Math.min(h, p.y));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = CONFIG.dotColor;
                ctx.fill();
            }

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    const maxD2 = CONFIG.maxDistance * CONFIG.maxDistance;

                    if (d2 < maxD2) {
                        const dist = Math.sqrt(d2);
                        const alpha = 0.10 * (1 - dist / CONFIG.maxDistance);
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(212, 169, 74, ${alpha})`;
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
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        }

        let resizeTimer = null;
        function onResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        }

        function onVisibility() {
            if (document.hidden) stop();
            else if (!state.prefersReducedMotion && !state.isMobile) start();
        }

        function init() {
            canvas = $('#particle-canvas');
            if (!canvas) return;

            if (state.prefersReducedMotion || state.isMobile) {
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

    /* ============================================================
       FOOTER YEAR
       ============================================================ */
    function setYear() {
        const el = $('#footer-year');
        if (el) el.textContent = String(new Date().getFullYear());
    }

    /* ============================================================
       GLOBAL ERROR GUARD
       ============================================================ */
    window.addEventListener('error', (e) => {
        console.error('[Portfolio] Runtime error:', e.message);
    });
    window.addEventListener('unhandledrejection', (e) => {
        console.error('[Portfolio] Unhandled promise:', e.reason);
    });

    /* ============================================================
       BOOTSTRAP
       ============================================================ */
    onReady(() => {
        Theme.init();
        Counters.init();
        SmoothScroll.init();
        ActiveNav.init();
        ParticleField.init();
        setYear();
    });

    /* ============================================================
       BREAKPOINT / ORIENTATION HANDLING
       ============================================================ */
    let resizeRaf = null;
    window.addEventListener('resize', () => {
        if (resizeRaf !== null) return;
        resizeRaf = requestAnimationFrame(() => {
            const nowMobile = window.innerWidth <= 900;
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
            resizeRaf = null;
        });
    }, { passive: true });

})();
