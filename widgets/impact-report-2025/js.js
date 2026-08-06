/* VPM 2025 Impact Report - shared behavior.
   Restored 2026-08-06. This script was lost when the two page-authored <style>
   blocks were replaced by the consolidated stylesheet - it lived in the same
   Code Block as the first one.

   CHANGED FROM THE ORIGINAL: execution is now deferred to DOMContentLoaded.
   The original ran inline during parsing, so `document.querySelector(".vpm-impact-component")`
   returned null whenever the script sat above the section markup - which it did.
   That is why adding the wrapper class alone did not start the counters.
   With the deferral, this block can go in any Code Block on the page.

   Handles: Brightspot/CMS header offset for the sticky nav, nav scrollspy +
   smooth scroll, letter "read more" toggling, and the Awards counter animation.
   Every piece checks for its own target elements first, so it is safe on pages
   that use only some of the sections. */

const vpmImpactInit = () => {
  const root = document.querySelector(".vpm-impact-component");
  if (!root) return;

  /* Detect Brightspot persistent player height and set CSS variable */
  const updateHeaderOffset = () => {
    const persistentPlayer = document.querySelector('.PH-persistent-player');
    const psHeader = document.querySelector('ps-header');
    let offset = 0;

    if (persistentPlayer) {
      const rect = persistentPlayer.getBoundingClientRect();
      if (rect.height > 0) {
        offset = rect.bottom;
      }
    } else if (psHeader) {
      const rect = psHeader.getBoundingClientRect();
      if (rect.bottom > 0) {
        offset = Math.max(0, rect.bottom);
      }
    }

    root.style.setProperty('--vpm-cms-header-height', offset + 'px');
  };

  updateHeaderOffset();
  let scrollTick = false;
  window.addEventListener('scroll', () => {
    if (!scrollTick) {
      requestAnimationFrame(() => {
        updateHeaderOffset();
        scrollTick = false;
      });
      scrollTick = true;
    }
  }, { passive: true });

  setTimeout(updateHeaderOffset, 500);

  const smoothScrollTo = (element) => {
    if ('scrollBehavior' in document.documentElement.style) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 600;
      let start = null;

      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        window.scrollTo(0, startPosition + distance * ease);
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  const navLinks = [...root.querySelectorAll(".nav-link")];
  const sections = [...root.querySelectorAll(".impact-section[id]")];

  const setActive = (id) => {
    navLinks.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = root.querySelector(href);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
      setActive(href.slice(1));
    });
  });

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.05, 0.1, 0.2, 0.35],
      }
    );

    sections.forEach((s) => observer.observe(s));
    setActive(sections[0].id);
  }

  /* Letter "read more" toggle behavior */
  const letterDetails = [...root.querySelectorAll(".letter-details")];

  letterDetails.forEach((details) => {
    const summary = details.querySelector(".readmore");
    if (!summary) return;

    const closedText = "Read full letter";
    const openText = "Collapse letter";

    const updateSummaryText = () => {
      const isOpen = details.hasAttribute("open");
      summary.textContent = isOpen ? openText : closedText;
    };

    details.addEventListener("toggle", updateSummaryText);

    summary.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (details.hasAttribute("open")) {
          details.removeAttribute("open");
        } else {
          details.setAttribute("open", "");
        }
      }
    });
  });

  /* Awards counter animation */
  const awardsRoot = document.querySelector(".vpm-awards2025");
  if (awardsRoot) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counterEls = awardsRoot.querySelectorAll(".award-number, .total-number");

    function animateCounter(el, duration) {
      duration = duration || 1200;
      const target = Number(el.dataset.target || 0);
      if (!Number.isFinite(target)) return;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * t).toString();
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (prefersReduced) {
      counterEls.forEach(function(el) { el.textContent = el.dataset.target || "0"; });
    } else {
      const counterObs = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (el.dataset.animated) return;
          el.dataset.animated = "true";
          animateCounter(el);
          obs.unobserve(el);
        });
      }, { threshold: 0.4 });
      counterEls.forEach(function(el) { counterObs.observe(el); });
    }
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    console.log("VPM Impact Component initialized", {
      sections: sections.length,
      navLinks: navLinks.length,
      letterDetails: letterDetails.length
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", vpmImpactInit, { once: true });
} else {
  vpmImpactInit();
}
