/* beforeubereats.com — the only script on the site.
   No analytics, no tracking, no network requests. Theme preference only. */
(function () {
  'use strict';

  var KEY = 'bue-theme';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(v) {
    try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch (e) { /* private mode */ }
  }

  var saved = stored();
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  function current() {
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.theme-toggle') : null;
    if (!btn) return;
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    remember(next);
    btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });

  /* Highlight the reference a citation points at, so the jump is obvious. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a.cite') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id.charAt(0) !== '#') return;
    var target = document.getElementById(id.slice(1));
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    setTimeout(function () { target.focus({ preventScroll: true }); }, 60);
  });
})();
