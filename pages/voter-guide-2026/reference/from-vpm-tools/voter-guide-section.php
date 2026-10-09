<?php
/**
 * VPM Voter Guide Section — Shortcode
 *
 * Usage: [vpm_voter_guide tag="voter-guide" limit="5"]
 *
 * Add this file to your theme's functions.php via:
 *   require_once get_template_directory() . '/inc/voter-guide-section.php';
 * Or paste the contents directly into functions.php.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function vpm_voter_guide_shortcode( $atts ) {
    $atts = shortcode_atts( [
        'tag'   => 'voter-guide',
        'limit' => 5,
    ], $atts, 'vpm_voter_guide' );

    $tag   = esc_attr( $atts['tag'] );
    $limit = intval( $atts['limit'] );

    ob_start();
    ?>
    <div class="vpm-voter-guide" id="vpm-voter-guide">

        <div class="vpm-vg-header">
            <div class="vpm-vg-accent" aria-hidden="true"></div>
            <div>
                <p class="vpm-vg-eyebrow">Virginia 2026 Primary</p>
                <h2 class="vpm-vg-title">Key dates &amp; voter guide</h2>
            </div>
        </div>

        <div class="vpm-vg-body">

            <div class="vpm-vg-dates">
                <p class="vpm-vg-section-label">Important dates</p>
                <div class="vpm-vg-dates-grid" id="vpm-dates-grid"></div>
            </div>

            <div class="vpm-vg-articles">
                <p class="vpm-vg-section-label">
                    Voter guide
                    <span class="vpm-vg-count" id="vpm-article-count"></span>
                </p>
                <div class="vpm-vg-articles-list" id="vpm-articles-list">
                    <p class="vpm-vg-status" id="vpm-articles-status">Loading articles&hellip;</p>
                </div>
            </div>

        </div>
    </div>

    <style>
    .vpm-voter-guide { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; padding: 24px 0; }
    .vpm-vg-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
    .vpm-vg-accent { width: 5px; height: 32px; background: #CC0000; border-radius: 2px; flex-shrink: 0; }
    .vpm-vg-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #666; margin: 0 0 2px; }
    .vpm-vg-title { font-size: 20px; font-weight: 600; margin: 0; color: #1a1a1a; }
    .vpm-vg-body { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    @media (max-width: 640px) { .vpm-vg-body { grid-template-columns: 1fr; } }
    .vpm-vg-section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #888; margin: 0 0 14px; }
    .vpm-vg-dates-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; }
    .vpm-vg-date-item { padding: 12px; border: 1px solid #e0e0e0; border-radius: 6px; background: #fff; }
    .vpm-vg-date-item.is-past { opacity: 0.5; }
    .vpm-vg-date-item.is-past .vpm-vg-date-num { text-decoration: line-through; }
    .vpm-vg-date-item.is-today { border-color: #CC0000; border-width: 2px; }
    .vpm-vg-date-num { font-size: 18px; font-weight: 700; margin: 0 0 4px; color: #1a1a1a; }
    .vpm-vg-date-label { font-size: 12px; color: #666; margin: 0; line-height: 1.4; }
    .vpm-vg-articles-list { display: flex; flex-direction: column; gap: 10px; }
    .vpm-vg-article-card { display: flex; gap: 12px; align-items: flex-start; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; background: #fff; text-decoration: none; color: inherit; }
    .vpm-vg-article-card:hover { border-color: #bbb; background: #fafafa; }
    .vpm-vg-article-thumb { width: 72px; height: 52px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
    .vpm-vg-article-no-thumb { width: 72px; height: 52px; background: #f0f0f0; border-radius: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .vpm-vg-article-no-thumb svg { opacity: 0.35; }
    .vpm-vg-article-title { font-size: 13px; font-weight: 600; margin: 0 0 4px; line-height: 1.4; color: #1a1a1a; }
    .vpm-vg-article-date { font-size: 11px; color: #888; margin: 0; }
    .vpm-vg-status { font-size: 13px; color: #888; margin: 0; padding: 4px 0; }
    .vpm-vg-count { font-size: 10px; background: #f0f0f0; color: #666; padding: 1px 7px; border-radius: 4px; margin-left: 6px; font-weight: 400; letter-spacing: 0; text-transform: none; }
    </style>

    <script>
    (function () {
        var TODAY = new Date('<?php echo date('Y-m-d'); ?>');

        var DATES = [
            { display: 'June 18–19', label: 'Early voting starts',                  date: new Date('2026-06-18') },
            { display: 'July 24',         label: 'Voter registration deadline',           date: new Date('2026-07-24') },
            { display: 'July 24',         label: 'Absentee ballot application deadline',  date: new Date('2026-07-24') },
            { display: 'Aug. 1',          label: 'Early voting ends',                     date: new Date('2026-08-01') },
            { display: 'Aug. 4',          label: 'Primary election day',                  date: new Date('2026-08-04') },
        ];

        var grid = document.getElementById('vpm-dates-grid');
        DATES.forEach(function (d) {
            var past    = d.date < TODAY && d.date.toDateString() !== TODAY.toDateString();
            var isToday = d.date.toDateString() === TODAY.toDateString();
            var el = document.createElement('div');
            el.className = 'vpm-vg-date-item' + (past ? ' is-past' : '') + (isToday ? ' is-today' : '');
            el.innerHTML = '<p class="vpm-vg-date-num">' + d.display + '</p>' +
                           '<p class="vpm-vg-date-label">' + d.label + '</p>';
            grid.appendChild(el);
        });

        var TAG   = '<?php echo $tag; ?>';
        var LIMIT = <?php echo $limit; ?>;
        var API   = '<?php echo esc_url( rest_url( 'wp/v2/' ) ); ?>';

        var statusEl = document.getElementById('vpm-articles-status');
        var list     = document.getElementById('vpm-articles-list');
        var countEl  = document.getElementById('vpm-article-count');

        function renderArticles(articles) {
            statusEl && statusEl.parentNode && statusEl.parentNode.removeChild(statusEl);
            countEl.textContent = articles.length;
            articles.forEach(function (post) {
                var thumb = (post._embedded &&
                             post._embedded['wp:featuredmedia'] &&
                             post._embedded['wp:featuredmedia'][0] &&
                             post._embedded['wp:featuredmedia'][0].media_details &&
                             post._embedded['wp:featuredmedia'][0].media_details.sizes &&
                             post._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail)
                    ? post._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url
                    : null;

                var thumbHtml = thumb
                    ? '<img class="vpm-vg-article-thumb" src="' + thumb + '" alt="" loading="lazy" />'
                    : '<div class="vpm-vg-article-no-thumb"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>';

                var date = post.date
                    ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '';

                var card = document.createElement('a');
                card.className = 'vpm-vg-article-card';
                card.href = post.link || '#';
                card.innerHTML = thumbHtml +
                    '<div>' +
                    '<p class="vpm-vg-article-title">' + (post.title && post.title.rendered ? post.title.rendered : 'Untitled') + '</p>' +
                    '<p class="vpm-vg-article-date">' + date + '</p>' +
                    '</div>';
                list.appendChild(card);
            });
        }

        function showError(msg) {
            if (statusEl) statusEl.textContent = msg;
            countEl.textContent = '0';
        }

        fetch(API + 'tags?slug=' + TAG + '&_fields=id')
            .then(function (r) { return r.json(); })
            .then(function (tags) {
                if (!tags.length) { showError('No tag found for “' + TAG + '”.'); return; }
                var tagId = tags[0].id;
                return fetch(API + 'posts?tags=' + tagId + '&per_page=' + LIMIT + '&_embed&_fields=id,title,link,date,_embedded,_links');
            })
            .then(function (r) { return r && r.json(); })
            .then(function (posts) {
                if (!posts || !posts.length) { showError('No articles tagged “' + TAG + '” yet.'); return; }
                renderArticles(posts);
            })
            .catch(function () {
                showError('Could not load articles.');
            });
    })();
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode( 'vpm_voter_guide', 'vpm_voter_guide_shortcode' );
