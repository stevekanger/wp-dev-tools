<?php

declare(strict_types=1);

/**
 * Plugin Name: Plugin With Tests
 * Plugin Uri:
 * Author: John Doe
 * Author URI:
 * Description: Plugin with tests.
 * Version: 1.0.0
 * Requires at least: 7.1.4
 * Tested up to: 7.1.4
 * Requires PHP: 8.3
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:
 * Text Domain: plugin-with-tests
 * Requires Plugins:
 */

namespace PluginWithTests;

defined('ABSPATH') || exit;

/**
 * Gets the app version from the doc comment.
 *
 * @since 1.0.0
 */
function get_version(): string {
    return get_file_data(__FILE__, ['Version' => 'Version'])['Version'] ?: '0.1.0';
}

/**
 * Registers blocks from the build/blocks folder.
 *
 * @since 1.0.0
 */
function register_blocks(): void {
    // Add block slugs here you want to register
    $blocks = [];

    foreach ($blocks as $slug) {
        $block_path = __DIR__ . '/build/blocks/' . $slug;
        register_block_type($block_path);
    }
}
add_action('init', __NAMESPACE__ . '\register_blocks');

/**
 * Enqueue the client scripts.
 *
 * @since 1.0.0
 */
function enqueue_client_assets(): void {
    $version = get_version();

    // enqueue js
    wp_enqueue_script(
        'plugin-with-tests-client',
        plugin_dir_url(__FILE__) . '/build/client/index.js',
        [],
        $version,
        ['in_footer' => true, 'strategy' => 'defer'],
    );

    // enqueue css
    wp_enqueue_style(
        'plugin-with-tests-client',
        plugin_dir_url(__FILE__) . '/build/client/index.css',
        [],
        $version,
        'all'
    );
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_client_assets');

/**
 * Enqueue the admin scripts.
 *
 * @since 1.0.0
 */
function enqueue_admin_assets(): void {
    $version = get_version();

    // enqueue js
    wp_enqueue_script(
        'plugin-with-tests-admin',
        plugin_dir_url(__FILE__) . '/build/admin/index.js',
        [],
        $version,
        ['in_footer' => true, 'strategy' => 'defer'],
    );

    // enqueue css
    wp_enqueue_style(
        'plugin-with-tests-admin',
        plugin_dir_url(__FILE__) . '/build/admin/index.css',
        [],
        $version,
        'all'
    );
}
add_action('admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_admin_assets');
