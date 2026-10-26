<?php

declare(strict_types=1);

namespace ThemeWithPhp\Controllers;

defined('ABSPATH') || exit;

/**
 * ThemeController class.
 *
 * @since 1.0.0
 */
final class ThemeController extends AbstractController {
    /**
     * Register wordpress hooks.
     *
     * @since 1.0.0
     */
    public function register(): void {
        add_action('after_theme_setup', [$this, 'after_theme_setup']);
    }

    /**
     * Setup any theme related functionality.
     *
     * @since 1.0.0
     */
    public function after_theme_setup(): void {
    }
}
