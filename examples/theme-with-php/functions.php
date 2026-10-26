<?php

declare(strict_types=1);

namespace ThemeWithPhp;

defined('ABSPATH') || exit;

// Require autoloader
require_once __DIR__ . '/vendor/autoload.php';

// Define some app constants
const APP_TITLE = 'Theme With Php';
const APP_PREFIX = 'theme_with_php';
const APP_SLUG = 'theme-with-php';
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
