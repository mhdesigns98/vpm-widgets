<?php
/**
 * Key Virginia Elections — race data from inc/voter-guide-data.php.
 */

$title    = get_sub_field( 'section_title' );
$subtitle = get_sub_field( 'section_subtitle' );
$races    = vpm_vg_key_races();
?>
<section class="section">
	<div class="section-inner">
		<div class="section-label"><div class="section-label-bar"></div><h2><?php echo esc_html( $title ); ?></h2></div>
		<?php if ( $subtitle ) : ?><p class="section-sub"><?php echo esc_html( $subtitle ); ?></p><?php endif; ?>
		<div class="race-grid">
			<?php foreach ( $races as $race ) : ?>
				<a class="race-card" href="<?php echo esc_url( $race['url'] ); ?>">
					<div class="race-icon"><?php echo esc_html( $race['icon'] ); ?></div>
					<div class="race-name"><?php echo esc_html( $race['name'] ); ?></div>
					<div class="race-candidates"><?php echo esc_html( $race['candidates'] ); ?></div>
					<p class="race-desc"><?php echo esc_html( $race['desc'] ); ?></p>
					<div class="race-more">Learn more &rarr;</div>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
