<?php

declare(strict_types=1);

namespace PluginWithPhp\Controllers;

use PluginWithPhp\App;

defined('ABSPATH') || exit;

/**
 * AssetController class.
 *
 * @since 1.0.0
 */
final class AssetController extends AbstractController {
    /**
     * AssetController class constructor.
     *
     * @param string $slug the app slug
     * @param string $build_dir_url the url to the build dir
     * @param string $version the app version
     *
     * @since 1.0.0
     */
    public function __construct(
        private readonly string $slug,
        private readonly string $build_dir_url,
        private readonly string $version,
    ) {
    }

    /**
     * Creates an instance of the class.
     *
     * @param App $app the app instance
     *
     * @since 1.0.0
     */
    public static function make(App $app): static {
        return new static(
            slug: $app->slug(),
            build_dir_url: $app->build_dir_url(),
            version: $app->version()
        );
    }

    /**
     * Register wordpress hooks.
     *
     * @since 1.0.0
     */
    public function register(): void {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_client_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }

    /**
     * Enqueue the client side scripts.
     *
     * @since 1.0.0
     */
    public function enqueue_client_assets(): void {
        // enqueue js
        wp_enqueue_script(
            $this->slug . '-client',
            $this->build_dir_url . '/client/index.js',
            [],
            $this->version,
            ['in_footer' => true, 'strategy' => 'defer'],
        );

        // enqueue css
        wp_enqueue_style(
            $this->slug . '-client',
            $this->build_dir_url . '/client/index.css',
            [],
            $this->version,
            'all',
        );
    }

    /**
     * Enqueue the admin side scripts.
     *
     * @since 1.0.0
     */
    public function enqueue_admin_assets(): void {
        // enqueue js
        wp_enqueue_script(
            $this->slug . '-admin',
            $this->build_dir_url . '/admin/index.js',
            [],
            $this->version,
            ['in_footer' => true, 'strategy' => 'defer'],
        );

        // enqueue css
        wp_enqueue_style(
            $this->slug . '-admin',
            $this->build_dir_url . '/admin/index.css',
            [],
            $this->version,
            'all',
        );
    }
}
