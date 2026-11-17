// The in-page half of preview-on-live, shared by the console snippet (preview-on-live.mjs)
// and the bookmarklet (index.html). Plain ES2017, no dependencies: it runs on vpm.org.
//
// Swaps the live element that matches the paste for the paste itself. Returns a message;
// it starts with "Swapped" on success.
function previewOnLive(html, selector) {
  var t = document.createElement('template');
  t.innerHTML = html;
  var frag = t.content;
  var first = Array.prototype.find.call(frag.children, function (n) { return !/^(STYLE|SCRIPT|LINK)$/.test(n.tagName); });
  if (!selector) {
    if (!first || !first.classList.length) return 'The paste has no classed top-level element to match on this page.';
    selector = '.' + Array.prototype.map.call(first.classList, function (c) { return CSS.escape(c); }).join('.');
  }
  var old = document.querySelector(selector);
  if (!old) return 'Nothing on this page matches ' + selector + '. Is this the right page, and is the right paste on your clipboard?';
  // A rerun replaces the last preview, not just the root: drop the extra nodes it added.
  document.querySelectorAll('[data-preview-on-live]').forEach(function (n) { if (n !== old) n.remove(); });
  // Parsed scripts never run; swap each for a fresh one, which runs once it's in the page.
  frag.querySelectorAll('script').forEach(function (s) {
    var n = document.createElement('script');
    Array.prototype.forEach.call(s.attributes, function (a) { n.setAttribute(a.name, a.value); });
    n.textContent = s.textContent;
    s.replaceWith(n);
  });
  Array.prototype.forEach.call(frag.children, function (n) { n.setAttribute('data-preview-on-live', ''); });
  old.replaceWith(frag);
  if (document.title.indexOf('[PREVIEW] ') !== 0) document.title = '[PREVIEW] ' + document.title;
  return 'Swapped ' + selector + '. Only you see this; refresh to get the live page back.';
}
