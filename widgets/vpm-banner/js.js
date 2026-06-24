(function () {
  var banner = document.getElementById("vpm-banner");
  var closeBtn = document.getElementById("vpm-banner-close");
  var bannerKey = "vpmBannerDismissed";
  var hideDurationDays = 3;

  if (!banner || !closeBtn) return;

  var dismissedAt = localStorage.getItem(bannerKey);
  if (dismissedAt) {
    var now = new Date().getTime();
    var expiry = parseInt(dismissedAt) + hideDurationDays * 24 * 60 * 60 * 1000;
    if (now < expiry) {
      banner.style.display = "none";
    }
  }

  closeBtn.addEventListener("click", function () {
    banner.style.display = "none";
    localStorage.setItem(bannerKey, new Date().getTime());
  });
})();
