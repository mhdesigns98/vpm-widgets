<?php
/**
 * Hardcoded content for the VPM Voter Guide 2026 page.
 *
 * Per project decision (see BRIEF.md): race data, regional races, important
 * dates, election results, and FAQ are dev-maintained here, not exposed as
 * ACF fields. Update this file directly and redeploy when data changes.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function vpm_vg_important_dates() {
	return array(
		array(
			'month'  => 'Sep',
			'day'    => '18',
			'label'  => 'Early In-Person Voting Begins',
			'detail' => '45 days before Election Day',
		),
		array(
			'month'  => 'Oct',
			'day'    => '23',
			'label'  => 'Voter Registration Deadline',
			'detail' => 'Register online at vote.virginia.gov',
		),
		array(
			'month'  => 'Oct',
			'day'    => '31',
			'label'  => 'Last Day of Early Voting',
			'detail' => 'Saturday before Election Day',
		),
		array(
			'month'  => 'Nov',
			'day'    => '3',
			'label'  => 'Election Day',
			'detail' => 'Polls open 6 a.m. – 7 p.m.',
		),
	);
}

function vpm_vg_key_races() {
	return array(
		array(
			'icon'       => '🏛️',
			'name'       => 'U.S. Senate',
			'candidates' => 'Tim Kaine (D) vs. TBD (R)',
			'desc'       => 'Sen. Tim Kaine seeks a third term in one of 2026’s most-watched races. Republicans have fielded multiple primary challengers vying for the nomination in a state growing increasingly competitive at the federal level.',
			'url'        => '#',
		),
		array(
			'icon'       => '🏛',
			'name'       => 'U.S. House — All 11 Districts',
			'candidates' => 'Multiple incumbents & challengers',
			'desc'       => 'Virginia’s full congressional delegation is on the ballot. Seats in VA-02 (Hampton Roads), VA-05 (Southside), and VA-07 (Richmond suburbs) are rated as toss-ups or lean seats by major election forecasters.',
			'url'        => '#',
		),
		array(
			'icon'       => '⚖',
			'name'       => 'State Corporation Commission',
			'candidates' => 'To be determined',
			'desc'       => 'Voters will elect members to Virginia’s powerful regulatory body overseeing utilities, insurance, and financial institutions — decisions that affect every Virginian’s power bills and insurance rates.',
			'url'        => '#',
		),
	);
}

function vpm_vg_regional_races() {
	return array(
		array(
			'color'    => '#6CACE4',
			'name'     => 'Northern Virginia',
			'district' => 'VA-10 & VA-11',
			'counties' => array( 'Fairfax County', 'Arlington', 'Alexandria City', 'Prince William' ),
			'note'     => 'The DC suburbs anchor competitive open-seat contests in two of the state’s most closely divided districts.',
			'url'      => '#',
		),
		array(
			'color'    => '#EE2737',
			'name'     => 'Hampton Roads',
			'district' => 'VA-02',
			'counties' => array( 'Virginia Beach', 'Norfolk', 'Chesapeake', 'Newport News' ),
			'note'     => 'VA-02 is consistently one of Virginia’s most competitive congressional seats, with a heavy military and veteran presence.',
			'url'      => '#',
		),
		array(
			'color'    => '#E0E721',
			'name'     => 'Richmond Metro',
			'district' => 'VA-04 & VA-07',
			'counties' => array( 'Richmond City', 'Henrico', 'Chesterfield' ),
			'note'     => 'The capital region’s diverse electorate makes VA-07 a key bellwether for statewide trends in 2026.',
			'url'      => '#',
		),
		array(
			'color'    => '#6CACE4',
			'name'     => 'Shenandoah Valley',
			'district' => 'VA-06',
			'counties' => array( 'Roanoke', 'Lynchburg', 'Augusta County' ),
			'note'     => 'A safe Republican district. Local races — school boards, sheriff, commonwealth’s attorney — will draw the most competitive contests.',
			'url'      => '#',
		),
		array(
			'color'    => '#EE2737',
			'name'     => 'Southwest Virginia',
			'district' => 'VA-09',
			'counties' => array( 'Bristol', 'Wise County', 'Lee County' ),
			'note'     => 'The coalfields region has trended heavily Republican. Down-ballot races for local offices carry high stakes for communities.',
			'url'      => '#',
		),
		array(
			'color'    => '#E0E721',
			'name'     => 'Eastern Shore & Rural East',
			'district' => 'VA-01',
			'counties' => array( 'Accomack', 'Northampton', 'King William' ),
			'note'     => 'Part of VA-01, covering the Northern Neck and Eastern Shore. Competitive local races on water rights and rural broadband.',
			'url'      => '#',
		),
	);
}

function vpm_vg_faq() {
	return array(
		array(
			'q' => 'How do I register to vote in Virginia?',
			'a' => 'Register online at vote.virginia.gov, by mail, or in person at your local registrar’s office. The deadline to register is 15 days before the election — October 23 for the November 3 general election.',
		),
		array(
			'q' => 'Can I vote early or by absentee ballot?',
			'a' => 'Yes. Virginia offers no-excuse absentee voting. You can request an absentee ballot online, by mail, or in person at your registrar’s office. Early in-person voting begins 45 days before the election.',
		),
		array(
			'q' => 'What ID do I need to bring to vote?',
			'a' => 'Virginia requires a photo ID to vote in person. Acceptable forms include a Virginia driver’s license, U.S. passport, military ID, or a free Virginia voter photo ID card from your registrar.',
		),
		array(
			'q' => 'What if I make a mistake on my ballot?',
			'a' => 'If you haven’t yet deposited your ballot or fed it into the scanner, ask a poll worker for a replacement. Spoiled ballots are noted in the poll book. For mailed ballots, contact your registrar.',
		),
		array(
			'q' => 'How do I find my polling place?',
			'a' => 'Enter your address at vote.virginia.gov/VoterInformation to find your assigned polling place, view your sample ballot, and check your registration status.',
		),
		array(
			'q' => 'Can I vote if I have a felony conviction?',
			'a' => 'Rights restoration in Virginia is now automatic upon completion of your sentence, including any period of probation or parole, under a 2021 executive order made permanent by the General Assembly.',
		),
		array(
			'q' => 'Can I vote in person on Election Day?',
			'a' => 'Yes. Polls are open from 6 a.m. to 7 p.m. on Election Day. If you are in line by 7 p.m., you are entitled to vote regardless of how long it takes.',
		),
	);
}

/**
 * Election results — placeholder data shaped to match the AP Elections API v3
 * response so a future live integration is a drop-in swap. Always rendered
 * (no election-week auto-show, no admin toggle).
 *
 * Live fetch would be:
 * GET https://api.ap.org/v3/elections/2026-11-03?apiKey=YOUR_KEY&statePostal=VA&resultsType=l
 */
function vpm_vg_election_results() {
	return array(
		array(
			'id'                  => 'va-senate',
			'officeName'          => 'U.S. Senate',
			'seatName'            => 'Virginia',
			'called'              => true,
			'calledTime'          => '10:34 PM ET',
			'precinctsReporting'  => 3847,
			'precinctsTotal'      => 4102,
			'candidates'          => array(
				array( 'first' => 'Tim', 'last' => 'Kaine', 'party' => 'Dem', 'voteCount' => 1284402, 'votePercent' => 52.1, 'winner' => true, 'incumbent' => true ),
				array( 'first' => 'Mike', 'last' => 'Donovan', 'party' => 'GOP', 'voteCount' => 1142311, 'votePercent' => 46.3, 'winner' => false, 'incumbent' => false ),
				array( 'first' => 'Laura', 'last' => 'Simms', 'party' => 'Lib', 'voteCount' => 37890, 'votePercent' => 1.5, 'winner' => false, 'incumbent' => false ),
			),
		),
		array(
			'id'                 => 'va-02',
			'officeName'         => 'U.S. House',
			'seatName'           => 'Virginia 2nd District',
			'called'             => false,
			'calledTime'         => '',
			'precinctsReporting' => 312,
			'precinctsTotal'     => 489,
			'candidates'         => array(
				array( 'first' => 'Jen', 'last' => 'Kiggans', 'party' => 'GOP', 'voteCount' => 87441, 'votePercent' => 50.8, 'winner' => false, 'incumbent' => true ),
				array( 'first' => 'Missy', 'last' => 'Cotter Smasal', 'party' => 'Dem', 'voteCount' => 84112, 'votePercent' => 48.9, 'winner' => false, 'incumbent' => false ),
			),
		),
		array(
			'id'                 => 'va-07',
			'officeName'         => 'U.S. House',
			'seatName'           => 'Virginia 7th District',
			'called'             => true,
			'calledTime'         => '11:02 PM ET',
			'precinctsReporting' => 401,
			'precinctsTotal'     => 401,
			'candidates'         => array(
				array( 'first' => 'Eugene', 'last' => 'Vindman', 'party' => 'Dem', 'voteCount' => 112044, 'votePercent' => 53.4, 'winner' => true, 'incumbent' => true ),
				array( 'first' => 'Paul', 'last' => 'Templeton', 'party' => 'GOP', 'voteCount' => 96881, 'votePercent' => 46.2, 'winner' => false, 'incumbent' => false ),
			),
		),
		array(
			'id'                 => 'va-10',
			'officeName'         => 'U.S. House',
			'seatName'           => 'Virginia 10th District',
			'called'             => false,
			'calledTime'         => '',
			'precinctsReporting' => 198,
			'precinctsTotal'     => 521,
			'candidates'         => array(
				array( 'first' => 'Suhas', 'last' => 'Subramanyam', 'party' => 'Dem', 'voteCount' => 44203, 'votePercent' => 51.2, 'winner' => false, 'incumbent' => true ),
				array( 'first' => 'Rob', 'last' => 'Hartwell', 'party' => 'GOP', 'voteCount' => 40918, 'votePercent' => 47.4, 'winner' => false, 'incumbent' => false ),
			),
		),
		array(
			'id'                 => 'va-05',
			'officeName'         => 'U.S. House',
			'seatName'           => 'Virginia 5th District',
			'called'             => true,
			'calledTime'         => '9:48 PM ET',
			'precinctsReporting' => 611,
			'precinctsTotal'     => 611,
			'candidates'         => array(
				array( 'first' => 'Bob', 'last' => 'Good', 'party' => 'GOP', 'voteCount' => 134002, 'votePercent' => 58.1, 'winner' => true, 'incumbent' => true ),
				array( 'first' => 'Gloria', 'last' => 'Barry', 'party' => 'Dem', 'voteCount' => 93441, 'votePercent' => 40.5, 'winner' => false, 'incumbent' => false ),
			),
		),
	);
}

function vpm_vg_party_color( $party ) {
	$colors = array(
		'Dem' => '#1A6AA8',
		'GOP' => '#C8202F',
		'Ind' => '#7B8591',
		'Lib' => '#D4A017',
	);
	return isset( $colors[ $party ] ) ? $colors[ $party ] : '#7B8591';
}

function vpm_vg_party_letter( $party ) {
	$letters = array(
		'Dem' => 'D',
		'GOP' => 'R',
		'Ind' => 'I',
		'Lib' => 'L',
	);
	return isset( $letters[ $party ] ) ? $letters[ $party ] : '?';
}
