/* ════════════════════════════════════════════════════════════════════
   SKC v30b floating tooltip controller
   Extracted IIFE from script 3 of skc-demo-v30b-tooltips-floating.html
   ════════════════════════════════════════════════════════════════════ */

// ── from source lines 24524-24588 (__IIFE__) ──
(function() {
  let tipEl = null;
  function ensureTip() {
    if (tipEl) return tipEl;
    tipEl = document.createElement('div');
    tipEl.id = 'skc-tip';
    tipEl.setAttribute('role', 'tooltip');
    document.body.appendChild(tipEl);
    return tipEl;
  }
  function showTip(target) {
    const text = target.getAttribute('data-tip');
    if (!text) return;
    const tip = ensureTip();
    tip.textContent = text;
    tip.classList.remove('visible', 'below');
    // Position: above the target by default; flip below if too close to top.
    const rect = target.getBoundingClientRect();
    // Force a reflow so we can measure tip width
    tip.style.left = '0px'; tip.style.top = '0px';
    tip.classList.add('visible');
    const tipRect = tip.getBoundingClientRect();
    const margin = 8;
    let top = rect.top - tipRect.height - margin;
    let below = false;
    if (top < 4) {
      top = rect.bottom + margin;
      below = true;
      tip.classList.add('below');
    }
    let left = rect.left + (rect.width / 2) - (tipRect.width / 2);
    // Keep within viewport
    const maxLeft = window.innerWidth - tipRect.width - 6;
    if (left < 6) left = 6;
    if (left > maxLeft) left = maxLeft;
    // Arrow position relative to tip
    const arrowX = rect.left + (rect.width / 2) - left;
    tip.style.setProperty('--tip-arrow', arrowX + 'px');
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
  }
  function hideTip() {
    if (tipEl) tipEl.classList.remove('visible', 'below');
  }
  // Delegate via document to catch dynamically-rendered cells too.
  document.addEventListener('mouseover', function(e) {
    const t = e.target.closest('#menu-subpage-items [data-tip]');
    if (t) showTip(t);
  });
  document.addEventListener('mouseout', function(e) {
    const t = e.target.closest('#menu-subpage-items [data-tip]');
    if (t) hideTip();
  });
  document.addEventListener('focusin', function(e) {
    const t = e.target.closest('#menu-subpage-items [data-tip]');
    if (t) showTip(t);
  });
  document.addEventListener('focusout', function(e) {
    const t = e.target.closest('#menu-subpage-items [data-tip]');
    if (t) hideTip();
  });
  // Hide on scroll inside the table body (otherwise tooltip floats over moved row)
  document.addEventListener('scroll', function() { hideTip(); }, true);
})();


