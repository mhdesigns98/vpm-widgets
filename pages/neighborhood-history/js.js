/* ================================================
   Neighborhood History — JS block
   ACF field: JavaScript
   Resizes the Weekly Update signup iframe to its content height. Copied from
   the live page's newsletter Code Block; the guard flag is the same one that
   block used, so a second copy anywhere on the page never double-binds.
   ================================================ */

(function () {
  if (window._vpmNlResizeListener) { return; }
  window._vpmNlResizeListener = true;
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://newsletter-signup-8kv.pages.dev') { return; }
    if (!e.data || e.data.type !== 'vpm-nl-resize') { return; }
    document.querySelectorAll('iframe').forEach(function (f) {
      if (f.contentWindow === e.source) { f.style.height = e.data.height + 'px'; }
    });
  });
})();
