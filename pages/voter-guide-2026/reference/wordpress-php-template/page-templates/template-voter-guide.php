<?php
/**
 * Template Name: Voter Guide 2026
 *
 * Renders the ACF flexible-content "guide_sections" field, dispatching each
 * layout to its template part. Site header/footer come from the active theme.
 */

get_header();
?>

<div class="vpm-vg">

	<?php if ( have_rows( 'guide_sections' ) ) : ?>
		<?php while ( have_rows( 'guide_sections' ) ) : the_row(); ?>
			<?php
			$layout = get_row_layout();
			$part   = 'template-parts/voter-guide/section-' . str_replace( '_', '-', $layout );

			if ( locate_template( $part . '.php' ) ) {
				get_template_part( $part );
			}
			?>
		<?php endwhile; ?>
	<?php else : ?>
		<p style="padding:48px 24px;color:#7B8591;">
			No sections added yet. Edit this page and add sections under "Page Sections."
		</p>
	<?php endif; ?>

</div>

<?php
get_footer();
