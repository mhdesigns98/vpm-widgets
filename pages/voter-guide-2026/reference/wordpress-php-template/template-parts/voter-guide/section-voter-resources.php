<?php
/**
 * Voter Resources bar — thin strip of quick links.
 */

$links = get_sub_field( 'links' );
?>
<div class="voter-resources">
	<div class="voter-resources-inner">
		<span class="voter-resources-label">Voter Resources</span>
		<?php foreach ( (array) $links as $link ) : ?>
			<a href="<?php echo esc_url( $link['url'] ); ?>" target="_blank" rel="noopener noreferrer" class="voter-resources-link"><?php echo esc_html( $link['label'] ); ?> &#8599;</a>
		<?php endforeach; ?>
	</div>
</div>
