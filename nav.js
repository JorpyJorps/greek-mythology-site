// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ── Konami code → Minotaur Maze bypass ───────────────────
// Keyboard: ↑ ↑ ↓ ↓ ← → ← → B A Enter  (any page)
// Touch:    swipe ↑ ↑ ↓ ↓ ← → ← → tap tap  (any page)
(function () {
  const CODE = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a','Enter'
  ];
  const TOUCH_CODE = [
    'up','up','down','down',
    'left','right','left','right',
    'tap','tap'
  ];

  function activate() {
    localStorage.setItem('secret-maze-easter-egg', 'true');
    window.location.href = '/secret-challenge.html';
  }

  // ── Keyboard ──
  let kPos = 0;
  document.addEventListener('keydown', function (e) {
    if (e.key === CODE[kPos]) {
      kPos++;
      if (kPos === CODE.length) { kPos = 0; activate(); }
    } else {
      kPos = (e.key === CODE[0]) ? 1 : 0;
    }
  });

  // ── Touch swipes (home screen only) ──
  const onHomePage = ['/', '/index.html'].includes(location.pathname)
    || location.pathname.endsWith('/index.html');

  if (onHomePage) {
    let tPos = 0;
    let tStartX = 0, tStartY = 0;
    const MIN_SWIPE = 30; // px

    document.addEventListener('touchstart', function (e) {
      tStartX = e.touches[0].clientX;
      tStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].clientX - tStartX;
      const dy = e.changedTouches[0].clientY - tStartY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let gesture;

      if (dist < 12) {
        gesture = 'tap';
      } else if (dist >= MIN_SWIPE) {
        if (Math.abs(dx) > Math.abs(dy)) {
          gesture = dx > 0 ? 'right' : 'left';
        } else {
          gesture = dy > 0 ? 'down' : 'up';
        }
      } else {
        return; // too short, ignore
      }

      if (gesture === TOUCH_CODE[tPos]) {
        tPos++;
        if (tPos === TOUCH_CODE.length) { tPos = 0; activate(); }
      } else {
        tPos = (gesture === TOUCH_CODE[0]) ? 1 : 0;
      }
    }, { passive: true });
  }
})();

// Inject bottom mobile nav
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';

  const links = [
    { href: '/index.html',  label: 'Home',  icon: '🏛️' },
    { href: '/games.html',  label: 'Games', icon: '⚔️' },
    { href: '/math.html',   label: 'Math',  icon: '⚡' },
    { href: '/quest.html',  label: 'Quest', icon: '📜' },
    { href: '/stats.html',  label: 'Stats', icon: '📊' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';
  nav.setAttribute('aria-label', 'Main navigation');

  nav.innerHTML = links.map(l => {
    const active = page === l.href.slice(1) ? ' aria-current="page"' : '';
    return `<a href="${l.href}" class="mobile-nav-item"${active}>
      <span class="mobile-nav-icon" aria-hidden="true">${l.icon}</span>
      <span class="mobile-nav-label">${l.label}</span>
    </a>`;
  }).join('');

  document.body.appendChild(nav);
})();
