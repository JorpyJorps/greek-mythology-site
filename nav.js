// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ── Konami code → Minotaur Maze bypass ───────────────────
// ↑ ↑ ↓ ↓ ← → ← → B A Enter  (works from any page)
(function () {
  const CODE = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a','Enter'
  ];
  let pos = 0;
  document.addEventListener('keydown', function (e) {
    if (e.key === CODE[pos]) {
      pos++;
      if (pos === CODE.length) {
        pos = 0;
        localStorage.setItem('secret-maze-easter-egg', 'true');
        window.location.href = '/secret-challenge.html';
      }
    } else {
      pos = (e.key === CODE[0]) ? 1 : 0;
    }
  });
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
