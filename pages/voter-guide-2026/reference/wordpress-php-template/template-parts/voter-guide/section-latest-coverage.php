<?php
/**
 * Latest Coverage — real WordPress posts from the selected category
 * (defaults to "Elections").
 */

$category_id = get_sub_field( 'category' );
$post_count  = get_sub_field( 'post_count' ) ?: 4;

$query_args = array(
	'posts_per_page' => $post_count,
	'ignore_sticky_posts' => true,
);

if ( $category_id ) {
	$query_args['cat'] = $category_id;
} else {
	$query_args['category_name'] = 'elections';
}

$coverage_query = new WP_Query( $query_args );
?>
<section class="section">
	<div class="section-inner">
		<div style="margin-bottom:4px"><span class="eyebrow">From the Newsroom</span></div>
		<div class="section-label"><div class="section-label-bar"></div><h2>Latest Coverage</h2></div>
		<p class="section-sub">Stories from VPM's election reporting team</p>

		<?php if ( $coverage_query->have_posts() ) : ?>
			<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
				<?php while ( $coverage_query->have_posts() ) : $coverage_query->the_post(); ?>
					<?php $categories = get_the_category(); ?>
					<a href="<?php the_permalink(); ?>" style="background:#0d1520;border:1px solid rgba(255,255,255,.06);border-radius:2px;overflow:hidden;display:block;">
						<div style="aspect-ratio:16/9;overflow:hidden;">
							<?php the_post_thumbnail( 'medium_large', array( 'style' => 'width:100%;height:100%;object-fit:cover;display:block;' ) ); ?>
						</div>
						<div style="padding:12px 14px 16px">
							<?php if ( ! empty( $categories ) ) : ?>
								<span style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#6CACE4;display:block;margin-bottom:8px"><?php echo esc_html( $categories[0]->name ); ?></span>
							<?php endif; ?>
							<p style="font-size:14px;font-weight:700;color:#fff;line-height:1.35;margin:0"><?php the_title(); ?></p>
							<p style="font-size:11px;color:#3D4652;margin-top:6px"><?php the_author(); ?> &middot; <?php echo esc_html( get_the_date() ); ?></p>
						</div>
					</a>
				<?php endwhile; ?>
			</div>
			<?php wp_reset_postdata(); ?>
		<?php else : ?>
			<p class="wp-feed-empty">No posts found in this category yet.</p>
		<?php endif; ?>
	</div>
</section>
