<?php
/**
 * Key Regional Races — regional data from inc/voter-guide-data.php.
 */

$title    = get_sub_field( 'section_title' );
$subtitle = get_sub_field( 'section_subtitle' );
$regions  = vpm_vg_regional_races();
?>
<section class="section-alt">
	<div class="section-inner">
		<div class="section-label"><div class="section-label-bar"></div><h2><?php echo esc_html( $title ); ?></h2></div>
		<?php if ( $subtitle ) : ?><p class="section-sub"><?php echo esc_html( $subtitle ); ?></p><?php endif; ?>
		<div class="region-grid">
			<?php foreach ( $regions as $region ) : ?>
				<a class="region-card" href="<?php echo esc_url( $region['url'] ); ?>">
					<div class="region-bar" style="background:<?php echo esc_attr( $region['color'] ); ?>;"></div>
					<div class="region-body">
						<div class="region-name"><?php echo esc_html( $region['name'] ); ?></div>
						<div class="region-district" style="color:<?php echo esc_attr( $region['color'] ); ?>;"><?php echo esc_html( $region['district'] ); ?></div>
						<div class="region-counties">
							<?php foreach ( $region['counties'] as $county ) : ?>
								<span class="region-county"><?php echo esc_html( $county ); ?></span>
							<?php endforeach; ?>
						</div>
						<p class="region-note"><?php echo esc_html( $region['note'] ); ?></p>
					</div>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
