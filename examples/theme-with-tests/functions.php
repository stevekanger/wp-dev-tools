<?php

declare(strict_types=1);

namespace ThemeWithTests;

defined('ABSPATH') || exit;

/**
 * Gets the app version from the doc comment.
 *
 * @since 1.0.0
 */
function get_version(): string {
    return get_file_data(__DIR__ . '/style.css', ['Version' => 'Version'])['Version'] ?: '0.1.0';
}

/**
 * Enqueue the client scripts.
 *
 * @since 1.0.0
 */
function enqueue_client_assets(): void {
    $version = get_version();

    // enqueue js
    wp_enqueue_script(
        'theme-with-tests-client',
        get_template_directory_uri() . '/build/client/index.js',
        [],
        $version,
        ['in_footer' => true, 'strategy' => 'defer'],
    );

    // enqueue css
    wp_enqueue_style(
        'theme-with-tests-client',
        get_template_directory_uri() . '/build/client/index.css',
        [],
        $version,
        'all'
    );
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_client_assets');

/**
 * Enqueue the admin cripts.
 *
 * @since 1.0.0
 */
function enqueue_admin_assets(): void {
    $version = get_version();

    // enqueue js
    wp_enqueue_script(
        'theme-with-tests-admin',
        get_template_directory_uri() . '/build/admin/index.js',
        [],
        $version,
        ['in_footer' => true, 'strategy' => 'defer'],
    );

    // enqueue css
    wp_enqueue_style(
        'theme-with-tests-admin',
        get_template_directory_uri() . '/build/admin/index.css',
        [],
        $version,
        'all'
    );
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_admin_assets');
