const BOLT_KEY   = 'miles-bolts';
const SCROLL_KEY = 'miles-scrolls';

// Currency display
const boltEl   = document.getElementById('bolt-count');
const scrollEl = document.getElementById('scroll-count');
if (boltEl)   boltEl.textContent   = localStorage.getItem(BOLT_KEY)   || '0';
if (scrollEl) scrollEl.textContent = localStorage.getItem(SCROLL_KEY) || '0';

// Lightning flash on menu selection
const flash = document.getElementById('title-flash');
document.querySelectorAll('.title-menu-item').forEach(link => {
  link.addEventListener('click', () => {
    if (!flash) return;
    flash.classList.remove('is-active');
    requestAnimationFrame(() => flash.classList.add('is-active'));
  });
});

// Animated star field
const canvas = document.getElementById('star-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 140 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.3 + 0.2,
    base: Math.random() * 0.6 + 0.2,
    speed: Math.random() * 0.6 + 0.2,
    phase: Math.random() * Math.PI * 2,
  }));

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.02;
    for (const s of stars) {
      const o = s.base * (0.55 + 0.45 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 243, 200, ${o})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}
