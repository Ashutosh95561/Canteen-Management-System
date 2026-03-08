/**
 * static/js/cart.js
 * Client-side cart helpers for the Canteen Management System.
 * - Quantity increment/decrement controls
 * - Auto-dismiss flash alerts
 * - Confirm dialogs for destructive actions
 * - Search/filter keyboard shortcut
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Auto-dismiss flash alerts after 4 seconds ─────────────────────────────
  const alerts = document.querySelectorAll('.flash-container .alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      bsAlert.close();
    }, 4000);
  });

  // ── Quantity +/- buttons ──────────────────────────────────────────────────
  // Expects a wrapper with class 'qty-wrapper' containing:
  //   [data-action="decrement"] button, an <input type="number">, [data-action="increment"] button
  document.querySelectorAll('.qty-wrapper').forEach(wrapper => {
    const input = wrapper.querySelector('input[type="number"]');
    const min   = parseInt(input.min) || 0;
    const max   = parseInt(input.max) || 9999;

    wrapper.querySelector('[data-action="decrement"]')?.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      if (val > min) {
        input.value = val - 1;
        input.dispatchEvent(new Event('change'));
      }
    });

    wrapper.querySelector('[data-action="increment"]')?.addEventListener('click', () => {
      const val = parseInt(input.value) || 0;
      if (val < max) {
        input.value = val + 1;
        input.dispatchEvent(new Event('change'));
      }
    });
  });

  // ── Confirm delete / destructive actions ─────────────────────────────────
  document.querySelectorAll('[data-confirm]').forEach(el => {
    el.addEventListener('click', e => {
      const msg = el.dataset.confirm || 'Are you sure?';
      if (!confirm(msg)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  // ── Search input focus shortcut (pressing "/" focuses the search bar) ─────
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT'
                      && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const searchInput = document.querySelector('#searchInput');
      if (searchInput) searchInput.focus();
    }
  });

  // ── Category filter pills: add 'active' class on click ───────────────────
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // ── Animate KPI numbers on page load ─────────────────────────────────────
  document.querySelectorAll('[data-count-up]').forEach(el => {
    const target  = parseFloat(el.dataset.countUp.replace(/,/g, '')) || 0;
    const isFloat = el.dataset.countUp.includes('.');
    const duration = 900;
    const step = 16;
    const steps  = duration / step;
    let current  = 0;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isFloat
        ? '₹' + current.toFixed(2)
        : Math.round(current).toLocaleString();
    }, step);
  });

});
