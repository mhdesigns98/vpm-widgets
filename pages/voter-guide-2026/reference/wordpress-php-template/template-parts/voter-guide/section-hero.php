<?php
/**
 * Hero + Important Dates panel.
 * Featured stories come from the relationship field, falling back to the
 * 3 latest posts in the "Elections" category if none are picked.
 */

$eyebrow      = get_sub_field( 'eyebrow' );
$line1        = get_sub_field( 'headline_line_1' );
$line2        = get_sub_field( 'headline_line_2' );
$line3        = get_sub_field( 'headline_line_3' );
$body         = get_sub_field( 'body' );
$calendar_url = get_sub_field( 'calendar_url' ) ?: '#';
$featured_ids = get_sub_field( 'featured_posts' );

if ( empty( $featured_ids ) ) {
	$fallback     = get_posts(
		array(
			'posts_per_page' => 3,
			'category_name'  => 'elections',
			'fields'         => 'ids',
		)
	);
	$featured_ids = $fallback;
}

$dates = vpm_vg_important_dates();
?>
<section class="hero">
	<div class="hero-grid">
		<div>
			<?php if ( $eyebrow ) : ?>
				<span class="eyebrow"><?php echo esc_html( $eyebrow ); ?></span>
			<?php endif; ?>
			<h1 class="hero-headline">
				<?php if ( $line1 ) : ?><span class="line-blue"><?php echo esc_html( $line1 ); ?></span><?php endif; ?>
				<?php if ( $line2 ) : ?><span class="line-yellow"><?php echo esc_html( $line2 ); ?></span><?php endif; ?>
				<?php if ( $line3 ) : ?><span class="line-white"><?php echo esc_html( $line3 ); ?></span><?php endif; ?>
			</h1>
			<?php if ( $body ) : ?>
				<p class="hero-body"><?php echo esc_html( $body ); ?></p>
			<?php endif; ?>

			<?php if ( ! empty( $featured_ids ) ) : ?>
				<div class="featured-grid">
					<?php foreach ( $featured_ids as $post_id ) : ?>
						<?php
						$categories = get_the_category( $post_id );
						$cat_name   = ! empty( $categories ) ? $categories[0]->name : '';
						?>
						<a class="feat-card" href="<?php echo esc_url( get_permalink( $post_id ) ); ?>">
							<div class="feat-card-img">
								<?php echo get_the_post_thumbnail( $post_id, 'medium_large' ); ?>
							</div>
							<div class="feat-card-body">
								<?php if ( $cat_name ) : ?>
									<span class="feat-tag" style="color:#6CACE4;"><?php echo esc_html( $cat_name ); ?></span>
								<?php endif; ?>
								<p class="feat-title"><?php echo esc_html( get_the_title( $post_id ) ); ?></p>
								<p class="feat-byline"><?php echo esc_html( get_the_author_meta( 'display_name', get_post_field( 'post_author', $post_id ) ) ); ?></p>
							</div>
						</a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>

		<div class="dates-panel">
			<span class="dates-eyebrow">Important Dates</span>
			<div class="dates-list">
				<?php foreach ( $dates as $date ) : ?>
					<div class="date-item">
						<div class="date-num"><?php echo esc_html( $date['month'] ); ?><br><?php echo esc_html( $date['day'] ); ?></div>
						<div>
							<div class="date-label"><?php echo esc_html( $date['label'] ); ?></div>
							<div class="date-detail"><?php echo esc_html( $date['detail'] ); ?></div>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
			<a href="<?php echo esc_url( $calendar_url ); ?>" class="dates-cta">Full Elections Calendar &rarr;</a>
		</div>
	</div>
</section>
