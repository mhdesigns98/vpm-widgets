<?php
/**
 * Newsletter Signup — posts to the configured form action URL
 * (Mailchimp form action or the VPM newsletter signup API).
 */

$eyebrow     = get_sub_field( 'eyebrow' );
$heading     = get_sub_field( 'heading' );
$body        = get_sub_field( 'body' );
$form_action = get_sub_field( 'form_action' );
?>
<section class="newsletter">
	<div class="newsletter-inner">
		<?php if ( $eyebrow ) : ?><span class="eyebrow" style="color:#E0E721;"><?php echo esc_html( $eyebrow ); ?></span><?php endif; ?>
		<h2><?php echo esc_html( $heading ); ?></h2>
		<?php if ( $body ) : ?><p><?php echo esc_html( $body ); ?></p><?php endif; ?>

		<form class="newsletter-form" method="post" action="<?php echo esc_url( $form_action ); ?>" target="_blank">
			<input class="newsletter-input" type="email" name="EMAIL" placeholder="Your email address" required />
			<button class="btn-subscribe" type="submit">Subscribe</button>
		</form>
	</div>
</section>
