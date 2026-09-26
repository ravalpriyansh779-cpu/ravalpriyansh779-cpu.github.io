/* ============ Cursor + Particles + Core ============ */

// Custom cursor with trailing
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top = my + 'px';
});

// Hover effect on interactive elements
document.querySelectorAll('a, button, .project-card, .skill-category, .metric-card, .badge').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

(function animCursor() {
  cx += (mx - cx) * 0.15;
  cy += (my - cy) * 0.15;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(animCursor);
})();

// Particles with connected lines
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H;
const pts = Array.from({ length: 60 }, () => ({
  x: Math.random() * 1920,
  y: Math.random() * 1080,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.3,
  r: Math.random() * 1.3 + 0.4,
  a: Math.random()
}));

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

(function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 172, 193, ${p.a * 0.6})`;
    ctx.fill();
  });
  // Connect nearby particles
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(0, 172, 193, ${0.08 * (1 - d / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
})();

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// Terminal clock (hero preview)
function tickHeroClock() {
  const el = document.getElementById('termClock');
  if (el) el.textContent = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
}
tickHeroClock();
setInterval(tickHeroClock, 1000);

/* ============ HACKER MODE TERMINAL ============ */

const termOverlay = document.getElementById('terminalOverlay');
const termHistory = document.getElementById('termHistory');
const termInput = document.getElementById('termInput');

function toggleTerminal() {
  termOverlay.classList.toggle('active');
  if (termOverlay.classList.contains('active')) {
    setTimeout(() => termInput.focus(), 100);
    if (termHistory.children.length === 0) {
      typeLine(`<span class="output-line">Welcome to <span style="color:var(--primary)">priyansh.dev</span> interactive shell.</span>`);
      typeLine(`<span class="output-line">Type <span style="color:var(--accent)">'help'</span> for commands. Press ESC to exit.</span>`);
    }
  }
}
window.toggleTerminal = toggleTerminal;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && termOverlay.classList.contains('active')) toggleTerminal();
});

function typeLine(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  termHistory.appendChild(div);
  termHistory.parentElement.scrollTop = termHistory.parentElement.scrollHeight;
}

const commands = {
  help: () => `
    <h4>Available commands:</h4>
    <div class="output-line">• <span style="color:var(--accent)">about</span>      → whoami</div>
    <div class="output-line">• <span style="color:var(--accent)">projects</span>   → case studies</div>
    <div class="output-line">• <span style="color:var(--accent)">experience</span> → SITESEW internship</div>
    <div class="output-line">• <span style="color:var(--accent)">skills</span>     → tech stack</div>
    <div class="output-line">• <span style="color:var(--accent)">contact</span>    → get in touch</div>
    <div class="output-line">• <span style="color:var(--accent)">clear</span>      → clear terminal</div>
  `,
  about: () => `
    <h4>$ whoami</h4>
    <div class="output-line">Priyansh Raval — Full-Stack Engineer @ PDEU '27</div>
    <div class="output-line">I own features end-to-end: whiteboard → design → ship → measure.</div>
    <div class="output-line">Built real-time collab systems, multi-tenant RAG, and secure AI dashboards.</div>
    <div class="output-line">Published ML researcher (ICAWTM-26). Seeking SWE roles.</div>
  `,
  projects: () => `
    <h4>$ ls projects/</h4>
    <div class="output-line"><span style="color:var(--accent)">PulseBoard/</span>   → Real-time Kanban, WebSocket LWW conflict resolution</div>
    <div class="output-line"><span style="color:var(--accent)">TaskForge/</span>    → RBAC dashboard, AI permission boundaries</div>
    <div class="output-line"><span style="color:var(--accent)">CampusLens/</span>   → Multi-tenant RAG, Pinecone namespace isolation</div>
  `,
  experience: () => `
    <h4>$ cat experience.log</h4>
    <div class="output-line"><span style="color:var(--accent)">SITESEW</span> · SDE Intern · May-Jul 2026</div>
    <div class="output-line success">→ 40% p95 latency reduction (indexing + pooling)</div>
    <div class="output-line success">→ 77% deploy time saved (45 → 10 min) via GitHub Actions</div>
    <div class="output-line">→ Owned REST APIs (FastAPI + PostgreSQL) end-to-end</div>
  `,
  skills: () => `
    <h4>$ cat skills.json</h4>
    <div class="output-line"><span style="color:var(--accent)">Languages:</span>  TypeScript, JavaScript, Python, SQL</div>
    <div class="output-line"><span style="color:var(--accent)">Frontend:</span>   React, Vite, UI Components, Tailwind</div>
    <div class="output-line"><span style="color:var(--accent)">Backend:</span>    Node.js, FastAPI, REST APIs, WebSockets</div>
    <div class="output-line"><span style="color:var(--accent)">Data:</span>       PostgreSQL, Pinecone, Redis</div>
    <div class="output-line"><span style="color:var(--accent)">Ship:</span>       Docker, GitHub Actions, CI/CD, Git</div>
  `,
  contact: () => `
    <h4>$ cat contact.yaml</h4>
    <div class="output-line">📧 23bit084@sot.pdpu.ac.in</div>
    <div class="output-line">🐙 <a href="https://github.com/ravalpriyansh779-cpu" target="_blank" style="color:var(--accent)">github.com/ravalpriyansh779-cpu</a></div>
    <div class="output-line">💼 <a href="https://www.linkedin.com/in/priyansh-raval-3a98b7366/" target="_blank" style="color:var(--accent)">linkedin.com/in/priyansh-raval-3a98b7366</a></div>
  `,
  clear: () => { termHistory.innerHTML = ''; return ''; }
};

termInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = termInput.value.trim().toLowerCase();
    if (!cmd) return;
    typeLine(`<div class="cmd-line">priyansh@portfolio:~ ❯ ${cmd}</div>`);
    if (commands[cmd]) {
      const output = commands[cmd]();
      if (output) typeLine(output);
    } else {
      typeLine(`<div class="output-line" style="color:#ff5566">command not found: ${cmd}. Try 'help'.</div>`);
    }
    termInput.value = '';
  }
});

// Console easter egg for recruiters
console.log('%cHey recruiter! 👋', 'font-size:20px;color:#00ACC1;font-weight:bold');
console.log('%cYou opened devtools — good instinct.\nThis site: hand-coded HTML + CSS + vanilla JS.\nZero frameworks, zero build step.\n— Priyansh Raval', 'font-size:12px;color:#8B949E');
