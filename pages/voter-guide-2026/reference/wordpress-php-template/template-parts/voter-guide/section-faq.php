<?php
/**
 * Voting FAQ — accordion, content from inc/voter-guide-data.php.
 * Accordion behavior is handled by assets/voter-guide.js.
 */

$title       = get_sub_field( 'section_title' );
$subtitle    = get_sub_field( 'section_subtitle' );
$callout_url = get_sub_field( 'callout_url' ) ?: 'https://www.elections.virginia.gov';
$faq_items   = vpm_vg_faq();
?>
<div class="accent-bar"></div>
<section class="faq-section">
	<div class="faq-inner">
		<div class="section-label"><div class="section-label-bar"></div><h2><?php echo esc_html( $title ); ?></h2></div>
		<?php if ( $subtitle ) : ?><p class="section-sub"><?php echo esc_html( $subtitle ); ?></p><?php endif; ?>

		<div class="faq-list" id="vpm-faq-list">
			<?php foreach ( $faq_items as $item ) : ?>
				<div class="faq-item">
					<button class="faq-btn" aria-expanded="false">
						<span class="faq-q"><?php echo esc_html( $item['q'] ); ?></span>
						<span class="faq-icon">&#8964;</span>
					</button>
					<p class="faq-answer"><?php echo esc_html( $item['a'] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="faq-callout">
			<p>Still have questions? Virginia&rsquo;s Department of Elections has resources available in multiple languages.</p>
			<a href="<?php echo esc_url( $callout_url ); ?>" target="_blank" rel="noopener noreferrer">
				elections.virginia.gov
				<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
			</a>
		</div>
	</div>
</section>
