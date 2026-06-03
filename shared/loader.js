/* ════════════════════════════════════════════════════════════════════
   SKC fragment loader + init orchestrator

   In the original single-file demo every screen was in the DOM by the
   time any script ran, so DOMContentLoaded handlers in core.js etc.
   could find and bind to sidebar/screen elements.

   Now that screens are fetched async, we must:
     1) inject fragments BEFORE the shared scripts load (so the scripts
        execute against a fully populated DOM, and the readyState-loading
        else-branch initializers see real elements);
     2) intercept DOMContentLoaded handlers registered by those scripts
        and re-fire them ourselves after everything is in place (the
        native DOMContentLoaded already fired during initial shell
        parsing, so any new listener attached afterwards would never
        run otherwise).

   Index.html should reference ONLY this script. Loader injects the
   other shared/*.js script tags dynamically once the DOM has been
   populated with components and screens.
   ════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Cache-buster: python -m http.server sends no Cache-Control, so browsers
  // heuristically cache core.js/styles.css/fragments and serve them stale during
  // review. Appending a per-load token forces every fragment + script to load
  // fresh. Harmless to the spec; the engineer's Next.js build handles caching.
  const BUST = '?v=' + Date.now();

  const COMPONENTS = [
    ['components/sidebar.html',   'sidebar',          'replace'],
    ['components/topbar.html',    'topbar',           'replace'],
    ['components/ask-panel.html', 'layout-ask-panel', 'replace'],
    ['components/drawers.html',   'layout-drawers',   'replace'],
  ];

  // 14 screens — note that screen-config (the "Settings/workspace" page)
  // is genuinely nested inside screen-settings (the "Data Quality" page)
  // in the source HTML, so it ships as part of screens/settings.html and
  // doesn't get its own fragment. home-dashboard.html holds screen-dashboard,
  // the Home landing surface (distinct from screen-home, which is Today).
  const SCREENS = [
    'home-dashboard', 'today', 'profit-recovery', 'actions', 'action-detail',
    'recovery-detail', 'labor-efficiency', 'roi-proof', 'reports',
    'operating-system', 'settings', 'menu-optimization',
    'kitchen-speed', 'table-turns',
  ];

  const SCRIPTS = [
    'shared/data.js',
    'shared/core.js',
    'shared/controllers.js',
    'shared/server-coaching.js',
    'shared/tooltips.js',
  ];

  async function fetchInto(url, targetId, mode) {
    try {
      const res = await fetch(url + BUST);
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
      if (mode === 'append') el.insertAdjacentHTML('beforeend', html);
      else el.innerHTML = html;
    } catch (err) {
      console.warn('[loader] error loading', url, err);
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      const s = document.createElement('script');
      s.src = src + BUST;
      s.async = false; // preserve order across multiple appended scripts
      s.onload = resolve;
      s.onerror = function () {
        console.warn('[loader] script failed:', src);
        resolve();
      };
      document.body.appendChild(s);
    });
  }

  async function boot() {
    // 1) Inject all components and screens into the shell.
    for (const [url, id, mode] of COMPONENTS) {
      await fetchInto(url, id, mode);
    }
    for (const name of SCREENS) {
      await fetchInto(`screens/${name}.html`, 'screen-container', 'append');
    }

    // 2) Intercept DOMContentLoaded handlers registered by the shared
    //    scripts that are about to load. The real DOMContentLoaded has
    //    already fired (during initial shell parsing), so any handler
    //    attached after that would never run on its own.
    const dclQueue = [];
    const origAdd = Document.prototype.addEventListener;
    Document.prototype.addEventListener = function (type, fn, opts) {
      if (type === 'DOMContentLoaded') { dclQueue.push(fn); return; }
      return origAdd.call(this, type, fn, opts);
    };

    // 3) Load the shared scripts in order. With the DOM already populated,
    //    readyState-loading else-branches will see real elements.
    for (const src of SCRIPTS) {
      await loadScript(src);
    }

    // 4) Restore the native addEventListener and fire queued handlers in
    //    registration order, mirroring what the native event would have done.
    Document.prototype.addEventListener = origAdd;
    for (const fn of dclQueue) {
      try {
        fn(new Event('DOMContentLoaded'));
      } catch (err) {
        console.warn('[init] DOMContentLoaded handler threw:', err);
      }
    }

    // 5) Route to the last-visited view (refresh-resume), falling back to the
    //    Home dashboard. saveLastView/loadLastView live in core.js; the four
    //    subpage screens replay through their own controller so the correct
    //    child subpage and nav highlight are restored, not just the parent.
    if (typeof showScreen === 'function') {
      const last = (typeof loadLastView === 'function') ? loadLastView() : null;
      const SUBPAGE_FNS = {
        'menu':             'showMenuSubpage',
        'actions':          'showActionsSubpage',
        'labor-efficiency': 'showLaborSubpage',
        'table-turns':      'showTtSubpage',
      };
      try {
        if (last && last.screen && document.getElementById('screen-' + last.screen)) {
          const subFn = SUBPAGE_FNS[last.screen];
          if (last.sub && subFn && typeof window[subFn] === 'function') {
            window[subFn](last.sub);
          } else {
            showScreen(last.screen, null, last.title);
          }
        } else {
          showScreen('dashboard', null, 'Home');
        }
      } catch (err) {
        console.warn('[loader] restore failed, defaulting to Home:', err);
        try { showScreen('dashboard', null, 'Home'); } catch (e2) {}
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
