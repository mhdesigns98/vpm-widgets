<?php
/**
 * Paste this into your active theme's functions.php (or a site-specific
 * plugin). Requires ACF Pro for the flexible-content field.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Hardcoded content (races, dates, results, FAQ) — see inc/voter-guide-data.php.
require_once get_stylesheet_directory() . '/inc/voter-guide-data.php';

/**
 * Enqueue the Voter Guide styles/scripts only on the Voter Guide 2026 template.
 */
function vpm_vg_enqueue_assets() {
	if ( ! is_page_template( 'page-templates/template-voter-guide.php' ) ) {
		return;
	}

	wp_enqueue_style(
		'vpm-voter-guide',
		get_stylesheet_directory_uri() . '/assets/voter-guide.css',
		array(),
		wp_get_theme()->get( 'Version' )
	);

	wp_enqueue_script(
		'vpm-voter-guide',
		get_stylesheet_directory_uri() . '/assets/voter-guide.js',
		array(),
		wp_get_theme()->get( 'Version' ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'vpm_vg_enqueue_assets' );

/**
 * Load the ACF field group from Local JSON (acf-field-group-voter-guide.json).
 * Point ACF's load path at wherever you keep this file — commonly an
 * `acf-json/` folder in the theme.
 */
function vpm_vg_acf_json_load_point( $paths ) {
	$paths[] = get_stylesheet_directory() . '/acf-json';
	return $paths;
}
add_filter( 'acf/settings/load_json', 'vpm_vg_acf_json_load_point' );
