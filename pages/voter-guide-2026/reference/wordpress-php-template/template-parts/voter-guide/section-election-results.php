<?php
/**
 * Election Results — placeholder data from inc/voter-guide-data.php, shaped
 * to match the AP Elections API v3 response for a future live swap.
 * Always renders; no election-week auto-show, no admin toggle (dropped per
 * project decision — see BRIEF.md).
 */

$title    = get_sub_field( 'section_title' );
$subtitle = get_sub_field( 'section_subtitle' );
$races    = vpm_vg_election_results();
?>
<div class="vpm-results">
	<div class="res-inner">
		<div class="res-header">
			<div class="res-title-group">
				<div class="res-bar"></div>
				<h2 class="res-h2"><?php echo esc_html( $title ); ?></h2>
				<div class="res-live"><span class="res-live-dot"></span><span class="res-live-txt">Live</span></div>
			</div>
			<div class="res-ap"><span>Powered by</span> <span>AP Elections</span></div>
		</div>
		<?php if ( $subtitle ) : ?><p class="res-sub"><?php echo esc_html( $subtitle ); ?></p><?php endif; ?>

		<div class="res-grid">
			<?php foreach ( $races as $race ) : ?>
				<?php
				$percent_reporting = $race['precinctsTotal'] > 0
					? round( $race['precinctsReporting'] / $race['precinctsTotal'] * 100 )
					: 0;

				$sorted = $race['candidates'];
				usort(
					$sorted,
					function ( $a, $b ) {
						return $b['votePercent'] <=> $a['votePercent'];
					}
				);
				$max_percent  = $sorted[0]['votePercent'];
				$leader_color = vpm_vg_party_color( $sorted[0]['party'] );
				$border_color = $race['called'] ? $leader_color : '#3D4652';
				$fill_color   = $race['called'] ? '#6CACE4' : '#3D4652';
				?>
				<div class="race-card" style="border-top:3px solid <?php echo esc_attr( $border_color ); ?>">
					<div class="race-top">
						<div>
							<div class="race-office"><?php echo esc_html( $race['officeName'] ); ?></div>
							<div class="race-seat"><?php echo esc_html( $race['seatName'] ); ?></div>
						</div>
						<?php if ( $race['called'] ) : ?>
							<div class="race-badge called"><span class="race-badge-txt">AP Calls</span></div>
						<?php else : ?>
							<div class="race-badge pending"><span class="race-badge-txt">In Progress</span></div>
						<?php endif; ?>
					</div>

					<div class="prct-row">
						<span class="prct-label">Precincts reporting</span>
						<span class="prct-val"><?php echo esc_html( number_format_i18n( $race['precinctsReporting'] ) . '/' . number_format_i18n( $race['precinctsTotal'] ) . ' (' . $percent_reporting . '%)' ); ?></span>
					</div>
					<div class="prct-track">
						<div class="prct-fill" style="width:<?php echo esc_attr( $percent_reporting ); ?>%;background:<?php echo esc_attr( $fill_color ); ?>"></div>
					</div>

					<div class="cand-list">
						<?php foreach ( $race['candidates'] as $candidate ) : ?>
							<?php
							$bar_width = $max_percent > 0 ? round( $candidate['votePercent'] / $max_percent * 100, 1 ) : 0;
							$color     = vpm_vg_party_color( $candidate['party'] );
							$name_style = $candidate['winner'] ? 'font-weight:700;color:#fff;' : 'font-weight:500;color:#B9C8D8;';
							?>
							<div>
								<div class="cand-row">
									<span class="cand-party" style="background:<?php echo esc_attr( $color ); ?>"><?php echo esc_html( vpm_vg_party_letter( $candidate['party'] ) ); ?></span>
									<span class="cand-name" style="<?php echo esc_attr( $name_style ); ?>">
										<?php if ( $candidate['winner'] ) : ?>
											<svg style="display:inline;vertical-align:middle;margin-right:4px" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E0E721" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
										<?php endif; ?>
										<?php echo esc_html( $candidate['first'] . ' ' . $candidate['last'] ); ?>
										<?php if ( $candidate['incumbent'] ) : ?><span style="font-size:10px;color:#5A6470;margin-left:4px">*</span><?php endif; ?>
									</span>
									<span class="cand-pct" style="<?php echo esc_attr( $name_style ); ?>"><?php echo esc_html( number_format( $candidate['votePercent'], 1 ) ); ?>%</span>
									<span class="cand-count"><?php echo esc_html( number_format_i18n( $candidate['voteCount'] ) ); ?></span>
								</div>
								<div class="cand-bar-track">
									<div class="cand-bar-fill" style="width:<?php echo esc_attr( $bar_width ); ?>%;background:<?php echo esc_attr( $candidate['winner'] ? $color : $color . '88' ); ?>"></div>
								</div>
							</div>
						<?php endforeach; ?>
					</div>

					<?php if ( $race['called'] && $race['calledTime'] ) : ?>
						<div class="race-called-time">Called <?php echo esc_html( $race['calledTime'] ); ?></div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>

		<p class="res-note">Data is for demonstration. Replace vpm_vg_election_results() in inc/voter-guide-data.php with a live AP Elections API fetch.</p>
	</div>
</div>
