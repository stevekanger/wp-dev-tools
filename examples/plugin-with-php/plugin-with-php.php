<?php

declare(strict_types=1);

/**
 * Plugin Name: Plugin With Php
 * Plugin Uri:
 * Author: John Doe
 * Author URI:
 * Description: Plugin with php.
 * Version: 1.0.0
 * Requires at least: 7.1.4
 * Tested up to: 7.1.4
 * Requires PHP: 8.3
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:
 * Text Domain: plugin-with-php
 * Requires Plugins:
 */

namespace PluginWithPhp;

defined('ABSPATH') || exit;

// Require autoloader
require_once __DIR__ . '/vendor/autoload.php';

// Define some app constants
const APP_TITLE = 'Plugin With Php';
const APP_PREFIX = 'plugin_with_php';
const APP_SLUG = 'plugin-with-php';
const APP_REST_VERSION = 'v1';
const APP_ROOT_DIR = __DIR__;
const APP_ROOT_FILE = __FILE__;
const APP_BUILD_PATH = '/build';
const APP_VIEW_PATH = '/inc/views';

/**
 * Gets the application instance. Creates one if it doesn't already exist.
 *
 * @since 1.0.0
 */
function app(): App {
    return App::instance();
}

// Start the app
app();
