(function () {
  var bannerKey = "vpmBannerDismissed";
  var hideDurationDays = 3;

  function dismissedRecently() {
    try {
      var dismissedAt = parseInt(localStorage.getItem(bannerKey), 10);
      return !isNaN(dismissedAt) &&
        new Date().getTime() < dismissedAt + hideDurationDays * 24 * 60 * 60 * 1000;
    } catch (e) {
      return false;
    }
  }

  function init(banner) {
    if (banner.getAttribute("data-vpm-banner-ready")) return;
    banner.setAttribute("data-vpm-banner-ready", "1");

    if (dismissedRecently()) {
      banner.hidden = true;
      return;
    }

    var closeBtn = banner.querySelector(".vpm-banner__close");
    if (!closeBtn) return;
    closeBtn.addEventListener("click", function () {
      banner.hidden = true;
      try {
        localStorage.setItem(bannerKey, String(new Date().getTime()));
      } catch (e) {}
    });
  }

  var banners = document.querySelectorAll(".vpm-banner");
  for (var i = 0; i < banners.length; i++) init(banners[i]);
})();
