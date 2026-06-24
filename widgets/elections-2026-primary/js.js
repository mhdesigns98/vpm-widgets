/* ================================================
   VPM 2026 Elections Promo Banner — JS block
   ACF field: JavaScript
   Scoped via IIFE; touches only vpmElec26* IDs
   and .vpm-elec26-* elements.
   ================================================ */

(function () {
  'use strict';

  /* ── Carousel ── */
  var track    = document.getElementById('vpmElec26Track');
  var prevBtn  = document.getElementById('vpmElec26Prev');
  var nextBtn  = document.getElementById('vpmElec26Next');
  var page     = 0;

  function getVisible() {
    var wrap = document.querySelector('.vpm-elec26-track-wrap');
    if (!wrap) return 4;
    var w = wrap.offsetWidth;
    if (w < 481) return 1;
    if (w < 721) return 2;
    return 4;
  }

  function totalItems() {
    return track ? track.querySelectorAll('.vpm-elec26-vid').length : 0;
  }

  function updateCarousel() {
    if (!track) return;
    var vis    = getVisible();
    var total  = totalItems();
    var maxP   = Math.max(0, Math.ceil(total / vis) - 1);
    page       = Math.min(Math.max(page, 0), maxP);

    var items  = track.querySelectorAll('.vpm-elec26-vid');
    if (!items.length) return;

    var itemW  = items[0].offsetWidth;
    var gap    = 12; /* matches CSS gap: 0.75rem */
    track.style.transform = 'translateX(-' + (page * vis * (itemW + gap)) + 'px)';

    prevBtn.disabled = page === 0;
    nextBtn.disabled = page >= maxP;
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () { page--; updateCarousel(); });
    nextBtn.addEventListener('click', function () { page++; updateCarousel(); });
  }

  /* Recalculate on resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { page = 0; updateCarousel(); }, 150);
  });

  /* ── Modal / video lightbox ── */
  var modal   = document.getElementById('vpmElec26Modal');
  var frame   = document.getElementById('vpmElec26Frame');
  var closeBtn = document.getElementById('vpmElec26ModalClose');

  function openModal(videoId) {
    if (!modal || !frame) return;
    frame.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    if (!modal || !frame) return;
    frame.src = '';
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  /* Wire up video buttons */
  if (track) {
    track.addEventListener('click', function (e) {
      var btn = e.target.closest('.vpm-elec26-vid');
      if (btn) openModal(btn.dataset.vid);
    });
  }

  /* Close on backdrop click */
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  /* Close button */
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) closeModal();
  });

})();
