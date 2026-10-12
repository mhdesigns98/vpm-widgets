(function () {
  'use strict';

  // One delegated listener per page, however many signup blocks (or brands) are on it, and
  // however late the CMS hydrates them: a block injected or re-injected after this runs is
  // handled without re-binding, and pasting the JS field twice doesn't double-submit.
  if (window.__vpmNlsSignup) return;
  window.__vpmNlsSignup = true;

  var CONFIRM = "You're all set! Thank you for subscribing. You'll start receiving your selected VPM newsletter soon.";
  var GENERIC_ERR = "Sorry, we couldn't complete your subscription. Please try again.";
  var TIMEOUT_MS = 20000; // generous: a cold cross-origin first hit can be slow
  var seq = 0;

  // Strips Mailchimp's markup and its "0 - " / "1 - " field-index prefix out of msg.
  function cleanMessage(msg) {
    var text = String(msg || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    text = text.replace(/^\d+\s*-\s*/, '');
    return text || GENERIC_ERR;
  }

  function jsonp(url, done) {
    var name = 'vpmNlsSignup' + (++seq) + '_' + String(Math.random()).slice(2);
    var script = document.createElement('script');
    var timer;
    var settled = false;

    function settle(err, data) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      // Mailchimp sometimes invokes the callback twice in one response, so leave a no-op
      // behind rather than deleting it — a missing global would throw in the page.
      window[name] = function () {};
      setTimeout(function () { try { delete window[name]; } catch (e) {} }, 1000);
      if (script.parentNode) script.parentNode.removeChild(script);
      done(err, data);
    }

    window[name] = function (data) { settle(null, data); };
    script.onerror = function () { settle(new Error('network')); };
    // A successful callback runs while the script is evaluated, i.e. before onload. So if
    // onload fires and nothing settled, the response was unusable — Mailchimp's rate-limit
    // reply, for one, invokes the callback twice in a row, which is a SyntaxError and never
    // runs. Fall back straight away rather than sitting on the timeout.
    script.onload = function () {
      setTimeout(function () { settle(new Error('no-callback')); }, 0);
    };
    timer = setTimeout(function () { settle(new Error('timeout')); }, TIMEOUT_MS);
    script.src = url + '&c=' + name;
    document.body.appendChild(script);
  }

  // Same endpoint as the form's action, swapped to the JSONP variant, with every named
  // input (EMAIL plus the honeypot) carried over as a query param.
  function requestUrl(form) {
    var action = form.getAttribute('action').replace('/subscribe/post?', '/subscribe/post-json?');
    var params = [];
    Array.prototype.forEach.call(form.querySelectorAll('input[name]'), function (input) {
      params.push(encodeURIComponent(input.name) + '=' + encodeURIComponent(input.value));
    });
    return action + '&' + params.join('&');
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || !form.hasAttribute || !form.hasAttribute('data-nls-form')) return;
    event.preventDefault();
    if (form.getAttribute('data-nls-busy')) return;

    // The status box is generated as the form's next sibling, so each block finds its own.
    var statusEl = form.nextElementSibling;
    if (statusEl && !statusEl.hasAttribute('data-nls-status')) statusEl = null;
    var emailInput = form.querySelector('input[type="email"]');
    var button = form.querySelector('button[type="submit"]');

    function show(message, isError) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.className = 'vpm-nls__status' + (isError ? ' vpm-nls__status--err' : '');
      statusEl.hidden = false;
    }

    // The form carries novalidate, so browser validation has to be asked for explicitly.
    if (emailInput && !emailInput.checkValidity()) {
      show('Please enter a valid email address.', true);
      emailInput.focus();
      return;
    }

    form.setAttribute('data-nls-busy', '1');
    if (button) button.disabled = true;
    show('Submitting…', false);

    jsonp(requestUrl(form), function (err, data) {
      form.removeAttribute('data-nls-busy');
      if (button) button.disabled = false;

      if (err) {
        // Never strand the subscriber — hand off to the native POST we left intact.
        // form.submit() doesn't fire a submit event, so this listener won't intercept it.
        form.submit();
        show('Opening a secure Mailchimp window to finish your signup…', false);
        return;
      }

      if (data && data.result === 'success') {
        form.hidden = true;
        show(CONFIRM, false);
        return;
      }

      show(cleanMessage(data && data.msg), true);
    });
  });
})();
