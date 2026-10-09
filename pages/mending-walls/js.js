/* ================================================================
   Mending Walls — JS block
   ACF field: JS  (Code Block section)
   Drives the mural-photo carousel's prev/next controls and status text.
   ================================================================ */
(function () {
  var root = document.querySelector('.vpm-mw-carousel');
  if (!root) return;

  var slides = root.querySelectorAll('.vpm-mw-carousel__slide');
  var status = root.querySelector('.vpm-mw-carousel__status');
  var prevBtn = root.querySelector('.vpm-mw-carousel__prev');
  var nextBtn = root.querySelector('.vpm-mw-carousel__next');
  var current = 0;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('vpm-mw-carousel__slide--active', i === current);
    });
    if (status) status.textContent = (current + 1) + ' of ' + slides.length;
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); });
})();
