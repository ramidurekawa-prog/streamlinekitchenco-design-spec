/* ════════════════════════════════════════════════════════════════════
   SKC fragment loader
   Composes the demo at runtime from /components/*.html and /screens/*.html.
   ════════════════════════════════════════════════════════════════════ */

async function loadFragmentInto(url, targetId, mode = 'replace') {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('[loader] missing', url, res.status);
      return;
    }
    const html = await res.text();
    const el = document.getElementById(targetId);
    if (!el) {
      console.warn('[loader] target not found:', targetId);
      return;
    }
    if (mode === 'append') {
      el.insertAdjacentHTML('beforeend', html);
    } else {
      el.innerHTML = html;
    }
  } catch (err) {
    console.warn('[loader] error loading', url, err);
  }
}

async function loadAllScreens() {
  // Components first — sidebar, topbar, ask panel, drawers
  await loadFragmentInto('components/sidebar.html',   'sidebar');
  await loadFragmentInto('components/topbar.html',    'topbar');
  await loadFragmentInto('components/ask-panel.html', 'layout-ask-panel');
  await loadFragmentInto('components/drawers.html',   'layout-drawers');

  // Screens — appended in order into the screen container
  const screens = [
    'today', 'profit-recovery', 'actions', 'action-detail',
    'recovery-detail', 'labor-efficiency', 'roi-proof', 'reports',
    'operating-system', 'settings', 'config', 'menu-optimization',
    'kitchen-speed', 'table-turns'
  ];
  for (const name of screens) {
    await loadFragmentInto(`screens/${name}.html`, 'screen-container', 'append');
  }

  // After all screens are present, route to the default view.
  if (typeof showScreen === 'function') {
    try { showScreen('home'); } catch (err) { console.warn('[loader] showScreen(home) threw:', err); }
  }
}

document.addEventListener('DOMContentLoaded', loadAllScreens);
