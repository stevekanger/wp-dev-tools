<?php

declare(strict_types=1);

namespace PluginWithTestsPhp\Controllers;

use PluginWithTestsPhp\App;

defined('ABSPATH') || exit;

/**
 * PluginController class.
 *
 * @since 1.0.0
 */
final class PluginController extends AbstractController {
    /**
     * PluginController class constructor.
     *
     * @param string $root_file The application main entry file.
     *
     * @since 1.0.0
     */
    public function __construct(
        private readonly string $root_file,
    ) {
    }

    /**
     * Creates an instance of the class.
     *
     * @param App $app The app instance.
     *
     * @since 1.0.0
     */
    public static function make(App $app): static {
        return new static(
            root_file: $app->root_file()
        );
    }

    /**
     * Register wordpress hooks.
     *
     * @since 1.0.0
     */
    public function register(): void {
        $root_file = $this->root_file;
        register_activation_hook($root_file, [$this, 'activate']);
        register_deactivation_hook($root_file, [$this, 'deactivate']);
    }

    /**
     * Plugin activation hook.
     *
     * @since 1.0.0
     */
    public function activate(): void {
        flush_rewrite_rules();
    }

    /**
     * Plugin deactivation hook.
     *
     * @since 1.0.0
     */
    public function deactivate(): void {
        flush_rewrite_rules();
    }
}
