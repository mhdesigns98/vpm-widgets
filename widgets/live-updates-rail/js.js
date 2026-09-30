/* ============================================
   Live Updates Rail — vpm-lur-
   Content lives in the POSTS array below. Edit there to add/remove/reorder —
   no markup changes needed. Schema per post:
     id       (string, required, unique) — used for share/copy-link URLs
     author   (string, required)
     initials (string, required) — 2-3 chars shown in the avatar
     time     (string, required) — e.g. "2 minutes ago"
     category (string, required)
     type     ("text" | "image" | "audio" | "embed", required)
     body     (string, required) — supports basic <strong> markup
     link     ({label, href}, optional) — "read more" row under a text post
     image    ({alt}, optional; type "image" only) — placeholder tile;
              swap the render function's placeholder <div> for a real <img>
              once a source is wired in
     caption  (string, optional; type "image")
     audio    ({title, duration}, optional; type "audio") — duration in
              seconds; this is a VISUAL MOCK ONLY (simulated progress, no
              real <audio> element) until a real audio src is wired in
     embed    ({handle, source, quote}, optional; type "embed")
     hidden   (boolean, optional) — starts hidden, revealed by "Load more"
     homepageFeatured (boolean, optional) — included in the homepage variant's
              3-card grid (data-variant="homepage"); the original design
              hand-picks a text/image/embed trio there rather than just
              taking the first 3 posts, so this is opt-in per post
   ============================================ */
(function () {
  var POSTS = [
    {
      id: '1',
      author: 'Reporter Name',
      initials: 'RN',
      time: '2 minutes ago',
      category: 'Politics',
      type: 'text',
      body: '<strong>Placeholder headline for a short dispatch.</strong> Replace this with a real short update — a sentence or two on what just happened, written the way a reporter would text a desk editor.',
      link: { label: 'Read the full story', href: '#' },
      homepageFeatured: true
    },
    {
      id: '2',
      author: 'Reporter Name',
      initials: 'RN',
      time: '9 minutes ago',
      category: 'Politics',
      type: 'audio',
      body: '<strong>Placeholder audio dispatch.</strong> A one- or two-sentence setup for the clip below.',
      audio: { title: 'Placeholder audio clip title', duration: 102 }
    },
    {
      id: '3',
      author: 'Reporter Name',
      initials: 'RN',
      time: '22 minutes ago',
      category: 'Elections',
      type: 'image',
      body: '<strong>Placeholder headline for an image update.</strong> Short caption-style text describing the photo below.',
      image: { alt: '' },
      caption: 'Photo credit placeholder.',
      homepageFeatured: true
    },
    {
      id: '4',
      author: 'VPM News',
      initials: 'VN',
      time: '41 minutes ago',
      category: 'Government',
      type: 'embed',
      body: '<strong>Placeholder headline for an imported social post.</strong> One line of context before the embed.',
      embed: { handle: '@placeholder', source: 'bsky.social', quote: 'Placeholder quote text imported from a social post — replace with the real quote and source before publishing.' },
      homepageFeatured: true
    },
    {
      id: '5',
      author: 'Reporter Name',
      initials: 'RN',
      time: '1 hour ago',
      category: 'Education',
      type: 'text',
      body: '<strong>Placeholder headline for a longer dispatch.</strong> Enough body copy to trigger the four-line clamp and the "Show more" toggle, so this item demonstrates that interaction in preview.'
    },
    {
      id: '6',
      author: 'Reporter Name',
      initials: 'RN',
      time: '2 hours ago',
      category: 'Environment',
      type: 'text',
      body: '<strong>Placeholder headline, batch two.</strong> Revealed by "Load more" — demonstrates the hidden-post reveal behavior.',
      hidden: true
    },
    {
      id: '7',
      author: 'Reporter Name',
      initials: 'RN',
      time: '3 hours ago',
      category: 'Arts & Culture',
      type: 'text',
      body: '<strong>Placeholder headline, batch two.</strong> Also revealed by "Load more".',
      hidden: true
    }
  ];

  var LOAD_MORE_BATCH = 2;

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  // `touch` renders the mobile variant's full-width 44px buttons (no icons,
  // matching the original design's 1c placement) instead of the sidebar's
  // small icon+text row. Both modes share the same share-menu/copy-link
  // handlers in initRail's click delegation.
  function renderActions(post, touch) {
    var actions = touch
      ? '<div class="vpm-lur__actions vpm-lur__actions--touch">' +
          '<button type="button" class="vpm-lur__action vpm-lur__action--touch" data-lur-share-toggle>Share</button>' +
          '<button type="button" class="vpm-lur__action vpm-lur__action--touch" data-lur-copy><span data-lur-copy-label>Copy link</span></button>' +
        '</div>'
      : '<div class="vpm-lur__actions">' +
          '<button type="button" class="vpm-lur__action" data-lur-share-toggle>' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 12v8h16v-8"></path><path d="M12 16V3"></path><path d="M7 8l5-5 5 5"></path></svg>' +
            'Share' +
          '</button>' +
          '<button type="button" class="vpm-lur__action" data-lur-copy>' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 15l6-6"></path><path d="M11 6l1-1a4 4 0 016 6l-1 1"></path><path d="M13 18l-1 1a4 4 0 01-6-6l1-1"></path></svg>' +
            '<span data-lur-copy-label>Copy link</span>' +
          '</button>' +
        '</div>';

    return (
      actions +
      '<div class="vpm-lur__sharemenu" data-lur-sharemenu>' +
        '<span class="vpm-lur__sharemenu-label">Share to</span>' +
        '<div class="vpm-lur__sharemenu-links">' +
          '<a href="#" rel="noopener">Bluesky</a>' +
          '<a href="#" rel="noopener">Facebook</a>' +
          '<a href="mailto:?body=' + encodeURIComponent('#update-' + post.id) + '">Email</a>' +
        '</div>' +
      '</div>'
    );
  }

  function renderPost(post, touch) {
    var byline =
      '<div class="vpm-lur__byline">' +
        '<span class="vpm-lur__avatar" aria-hidden="true">' + post.initials + '</span>' +
        '<div class="vpm-lur__byline-text">' +
          '<span class="vpm-lur__author">' + post.author + '</span>' +
          '<span class="vpm-lur__meta">' + post.time + ' &middot; ' + post.category + '</span>' +
        '</div>' +
      '</div>';

    var body = '<p class="vpm-lur__body" data-lur-body>' + post.body + '</p>' +
      '<button type="button" class="vpm-lur__toggle" data-lur-toggle hidden>Show more</button>';

    var extra = '';
    if (post.type === 'image') {
      extra =
        '<div class="vpm-lur__image">Photo</div>' +
        (post.caption ? '<p class="vpm-lur__caption">' + post.caption + '</p>' : '');
    } else if (post.type === 'embed' && post.embed) {
      extra =
        '<div class="vpm-lur__embed">' +
          '<div class="vpm-lur__embed-head">' +
            '<span>' + post.embed.handle + '</span>' +
            '<span class="vpm-lur__embed-source">&middot; ' + post.embed.source + '</span>' +
          '</div>' +
          '<p class="vpm-lur__embed-quote">"' + post.embed.quote + '"</p>' +
          '<p class="vpm-lur__embed-note">Imported from social</p>' +
        '</div>';
    } else if (post.type === 'audio' && post.audio) {
      var dur = post.audio.duration || 60;
      extra =
        '<div class="vpm-lur__audio" data-lur-audio data-duration="' + dur + '">' +
          '<div class="vpm-lur__audio-row">' +
            '<button type="button" class="vpm-lur__play" data-lur-play aria-label="Play audio">' +
              '<svg class="vpm-lur__icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"></path></svg>' +
              '<svg class="vpm-lur__icon-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"></path></svg>' +
            '</button>' +
            '<div class="vpm-lur__audio-meta">' +
              '<span class="vpm-lur__audio-title">' + post.audio.title + '</span>' +
              '<span class="vpm-lur__audio-label">Audio &middot; ' + fmtTime(dur) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="vpm-lur__scrub-row">' +
            '<span class="vpm-lur__time" data-lur-time>0:00</span>' +
            '<div class="vpm-lur__track" data-lur-track role="slider" aria-label="Seek" tabindex="0" aria-valuemin="0" aria-valuemax="' + dur + '" aria-valuenow="0">' +
              '<div class="vpm-lur__track-rail"><div class="vpm-lur__track-progress" data-lur-progress></div></div>' +
            '</div>' +
            '<span class="vpm-lur__time vpm-lur__time--end">' + fmtTime(dur) + '</span>' +
          '</div>' +
        '</div>';
    }

    var readmore = post.link
      ? '<a class="vpm-lur__readmore" href="' + post.link.href + '">' +
          '<span class="vpm-lur__readmore-arrow" aria-hidden="true">&rarr;</span>' +
          '<span>' + post.link.label + '</span>' +
        '</a>'
      : '';

    return (
      '<article class="vpm-lur__post" data-lur-post="' + post.id + '"' + (post.hidden ? ' data-lur-hidden hidden' : '') + '>' +
        byline +
        body +
        extra +
        readmore +
        renderActions(post, touch) +
      '</article>'
    );
  }

  function formatUpdated() {
    return 'Updated just now';
  }

  // Homepage variant: condensed 3-card grid on the dark-blue field, no
  // share/audio/copy-link chrome — matches the original design's "1b"
  // placement. Renders fully from scratch rather than relying on the
  // data-lur-list/header markup the sidebar rail expects.
  function renderHomepageCard(post) {
    var byline =
      '<div class="vpm-lur__byline">' +
        '<span class="vpm-lur__avatar" aria-hidden="true">' + post.initials + '</span>' +
        '<div class="vpm-lur__byline-text">' +
          '<span class="vpm-lur__author">' + post.author + '</span>' +
          '<span class="vpm-lur__meta">' + post.time + ' &middot; ' + post.category + '</span>' +
        '</div>' +
      '</div>';

    var body = '<p class="vpm-lur__body">' + post.body + '</p>';

    var extra = '';
    if (post.type === 'image') {
      extra = '<div class="vpm-lur__image">Photo</div>';
    } else if (post.type === 'embed' && post.embed) {
      extra =
        '<div class="vpm-lur__embed">' +
          '<span class="vpm-lur__embed-head">' + post.embed.handle + '</span>' +
          '<p class="vpm-lur__embed-quote">"' + post.embed.quote + '"</p>' +
          '<p class="vpm-lur__embed-note">Imported from social</p>' +
        '</div>';
    }

    var readmore = post.link
      ? '<a class="vpm-lur__hp-readmore" href="' + post.link.href + '">&rarr; ' + post.link.label + '</a>'
      : '';

    return '<article class="vpm-lur__hp-card">' + byline + body + extra + readmore + '</article>';
  }

  function initHomepage(root) {
    if (!root || root.hasAttribute('data-lur-initialized')) return;
    root.setAttribute('data-lur-initialized', 'true');

    var visible = POSTS.filter(function (p) { return p.homepageFeatured; }).slice(0, 3);
    root.innerHTML =
      '<div class="vpm-lur__hp-top">' +
        '<div>' +
          '<p class="vpm-lur__updated">Updated just now</p>' +
          '<h3 class="vpm-lur__title">Latest Updates</h3>' +
        '</div>' +
        '<a href="#" class="vpm-lur__seeall--inline">See all updates</a>' +
      '</div>' +
      '<div class="vpm-lur__hp-grid">' + visible.map(renderHomepageCard).join('') + '</div>' +
      '<div class="vpm-lur__bar" aria-hidden="true"></div>';
  }

  // Mobile variant: its own "Updates" tab above the rail (the "The story"
  // tab is a visual placeholder — this widget only owns the updates feed,
  // not the article it sits beside) and full-width 44px touch buttons
  // instead of the sidebar's icon+text share/copy-link row, matching the
  // original design's 1c placement.
  function initMobile(root) {
    if (!root || root.hasAttribute('data-lur-initialized')) return;
    root.setAttribute('data-lur-initialized', 'true');

    var count = POSTS.length;
    root.innerHTML =
      '<div class="vpm-lur__tabs" role="tablist">' +
        '<button type="button" class="vpm-lur__tab" role="tab" aria-selected="false">The story</button>' +
        '<button type="button" class="vpm-lur__tab vpm-lur__tab--active" role="tab" aria-selected="true">Updates &middot; ' + count + '</button>' +
      '</div>' +
      '<div class="vpm-lur__header">' +
        '<h3 class="vpm-lur__title">Latest Updates</h3>' +
        '<p class="vpm-lur__updated">' + formatUpdated() + '</p>' +
      '</div>' +
      '<div class="vpm-lur__bar" aria-hidden="true"></div>' +
      '<div class="vpm-lur__list" data-lur-list></div>' +
      '<div class="vpm-lur__footer">' +
        '<button type="button" class="vpm-lur__loadmore" data-lur-loadmore hidden>Load more updates</button>' +
      '</div>';

    initRailBehavior(root, true);
  }

  function initRail(root) {
    if (!root || root.hasAttribute('data-lur-initialized')) return;

    var variant = root.getAttribute('data-variant');
    if (variant === 'homepage') { initHomepage(root); return; }
    if (variant === 'mobile') { initMobile(root); return; }

    root.setAttribute('data-lur-initialized', 'true');
    initRailBehavior(root, false);
  }

  // Shared behavior (render posts + wire up interactions) for both the
  // default sidebar/desktop rail and the mobile variant — they differ only
  // in wrapper markup (tab bar) and button style (touch vs icon).
  function initRailBehavior(root, touch) {
    var list = root.querySelector('[data-lur-list]');
    var updatedEl = root.querySelector('[data-lur-updated]');
    var loadMoreBtn = root.querySelector('[data-lur-loadmore]');
    if (!list) return;

    list.innerHTML = POSTS.map(function (p) { return renderPost(p, touch); }).join('');
    if (updatedEl) updatedEl.textContent = formatUpdated();

    var hasHidden = POSTS.some(function (p) { return p.hidden; });
    if (loadMoreBtn) loadMoreBtn.hidden = !hasHidden;

    // Body clamp: only show the toggle if the text actually overflows.
    root.querySelectorAll('[data-lur-body]').forEach(function (body) {
      if (body.scrollHeight > body.clientHeight + 1) {
        var toggle = body.nextElementSibling;
        if (toggle && toggle.hasAttribute('data-lur-toggle')) toggle.hidden = false;
      }
    });

    root.addEventListener('click', function (e) {
      var toggle = e.target.closest('[data-lur-toggle]');
      if (toggle) {
        var body = toggle.previousElementSibling;
        var expanded = body.classList.toggle('vpm-lur__body--expanded');
        toggle.textContent = expanded ? 'Show less' : 'Show more';
        return;
      }

      var shareToggle = e.target.closest('[data-lur-share-toggle]');
      if (shareToggle) {
        var post = shareToggle.closest('[data-lur-post]');
        var menu = post && post.querySelector('[data-lur-sharemenu]');
        root.querySelectorAll('[data-lur-sharemenu]').forEach(function (m) {
          if (m !== menu) m.classList.remove('is-open');
        });
        if (menu) menu.classList.toggle('is-open');
        return;
      }

      var copyBtn = e.target.closest('[data-lur-copy]');
      if (copyBtn) {
        var copyPost = copyBtn.closest('[data-lur-post]');
        var id = copyPost ? copyPost.getAttribute('data-lur-post') : '';
        var url = location.href.split('#')[0] + '#update-' + id;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).catch(function () {});
        }
        var label = copyBtn.querySelector('[data-lur-copy-label]');
        if (label) {
          label.textContent = 'Link copied';
          setTimeout(function () { label.textContent = 'Copy link'; }, 1600);
        }
        return;
      }

      var playBtn = e.target.closest('[data-lur-play]');
      if (playBtn) {
        togglePlay(playBtn);
        return;
      }

      var loadMore = e.target.closest('[data-lur-loadmore]');
      if (loadMore) {
        var hidden = Array.prototype.slice.call(list.querySelectorAll('[data-lur-hidden]'));
        hidden.slice(0, LOAD_MORE_BATCH).forEach(function (n) {
          n.hidden = false;
          n.removeAttribute('data-lur-hidden');
        });
        if (hidden.length <= LOAD_MORE_BATCH) loadMore.hidden = true;
      }
    });

    root.addEventListener('click', function (e) {
      var track = e.target.closest('[data-lur-track]');
      if (track) seek(track, e.clientX);
    });

    root.addEventListener('keydown', function (e) {
      var track = e.target.closest('[data-lur-track]');
      if (!track) return;
      var audio = track.closest('[data-lur-audio]');
      var dur = Number(audio.getAttribute('data-duration')) || 60;
      var step = dur / 20;
      if (e.key === 'ArrowRight') { setAudioTime(audio, (audio._t || 0) + step); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { setAudioTime(audio, (audio._t || 0) - step); e.preventDefault(); }
    });

    function seek(track, clientX) {
      var audio = track.closest('[data-lur-audio]');
      var dur = Number(audio.getAttribute('data-duration')) || 60;
      var r = track.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      setAudioTime(audio, pct * dur);
    }

    function setAudioTime(audio, t) {
      var dur = Number(audio.getAttribute('data-duration')) || 60;
      t = Math.max(0, Math.min(dur, t));
      audio._t = t;
      var progress = audio.querySelector('[data-lur-progress]');
      var timeEl = audio.querySelector('[data-lur-time]');
      var track = audio.querySelector('[data-lur-track]');
      if (progress) progress.style.width = (t / dur * 100) + '%';
      if (timeEl) timeEl.textContent = fmtTime(t);
      if (track) track.setAttribute('aria-valuenow', String(Math.round(t)));
    }

    function togglePlay(btn) {
      var audio = btn.closest('[data-lur-audio]');
      var dur = Number(audio.getAttribute('data-duration')) || 60;
      if (audio._timer) {
        clearInterval(audio._timer);
        audio._timer = null;
        btn.classList.remove('is-playing');
        btn.setAttribute('aria-label', 'Play audio');
        return;
      }
      if ((audio._t || 0) >= dur) audio._t = 0;
      btn.classList.add('is-playing');
      btn.setAttribute('aria-label', 'Pause audio');
      audio._timer = setInterval(function () {
        setAudioTime(audio, (audio._t || 0) + 0.25);
        if (audio._t >= dur) {
          clearInterval(audio._timer);
          audio._timer = null;
          btn.classList.remove('is-playing');
          btn.setAttribute('aria-label', 'Play audio');
        }
      }, 250);
    }
  }

  function initAll() {
    // Scoped to this script's own widget instance, not a page-wide selector —
    // multiple copies of this block on one page initialize independently.
    var script = document.currentScript;
    var scope = script && script.previousElementSibling && script.previousElementSibling.classList.contains('vpm-lur')
      ? script.previousElementSibling
      : document;
    var roots = scope.classList && scope.classList.contains('vpm-lur') ? [scope] : scope.querySelectorAll('.vpm-lur');
    roots.forEach ? roots.forEach(initRail) : Array.prototype.forEach.call(roots, initRail);
  }

  initAll();
})();
