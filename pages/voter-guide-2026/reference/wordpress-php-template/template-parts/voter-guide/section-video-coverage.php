<?php
/**
 * VPM Video Coverage — featured embed + shorts list.
 */

$featured_url     = get_sub_field( 'featured_video_url' );
$featured_title   = get_sub_field( 'featured_video_title' );
$featured_caption = get_sub_field( 'featured_video_caption' );
$shorts           = get_sub_field( 'shorts' );
?>
<section class="section-alt">
	<div class="section-inner">
		<div class="section-label"><div class="section-label-bar"></div><h2>VPM Video Coverage</h2></div>
		<p class="section-sub">Watch VPM's election reporting &mdash; full segments and short clips</p>
		<div style="display:grid;grid-template-columns:3fr 2fr;gap:24px;align-items:start">
			<div>
				<?php if ( $featured_url ) : ?>
					<div style="aspect-ratio:16/9;overflow:hidden;border-radius:2px;">
						<?php echo wp_oembed_get( $featured_url ); ?>
					</div>
				<?php else : ?>
					<div style="aspect-ratio:16/9;background:linear-gradient(135deg,#1A1F26,#0d1520);border:2px dashed rgba(108,172,228,.25);border-radius:2px;display:flex;align-items:center;justify-content:center;">
						<span style="font-size:12px;color:#5A6470;font-weight:600;">Add a featured video URL in Page Sections</span>
					</div>
				<?php endif; ?>

				<?php if ( $featured_title || $featured_caption ) : ?>
					<div style="margin-top:14px">
						<?php if ( $featured_title ) : ?>
							<p style="font-size:16px;font-weight:700;color:#fff;margin-top:6px;line-height:1.3"><?php echo esc_html( $featured_title ); ?></p>
						<?php endif; ?>
						<?php if ( $featured_caption ) : ?>
							<p style="font-size:13px;color:#7B8591;margin-top:6px"><?php echo esc_html( $featured_caption ); ?></p>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>

			<?php if ( ! empty( $shorts ) ) : ?>
				<div>
					<div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7B8591;margin-bottom:12px">Shorts</div>
					<div style="display:flex;flex-direction:column;gap:10px">
						<?php foreach ( $shorts as $short ) : ?>
							<div style="display:grid;grid-template-columns:72px 1fr;gap:12px;align-items:center;background:#101820;border:1px solid rgba(255,255,255,.06);border-radius:2px;padding:10px">
								<div style="aspect-ratio:9/16;overflow:hidden;border-radius:2px;background:#000;">
									<?php if ( ! empty( $short['video_url'] ) ) : ?>
										<?php echo wp_oembed_get( $short['video_url'] ); ?>
									<?php endif; ?>
								</div>
								<div>
									<p style="font-size:13px;font-weight:600;color:#fff;line-height:1.3;margin:0"><?php echo esc_html( $short['title'] ); ?></p>
									<span style="font-size:11px;color:#5A6470;margin-top:4px;display:block">Vertical &middot; 9:16</span>
								</div>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
