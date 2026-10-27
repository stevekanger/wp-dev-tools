<?php

declare(strict_types=1);

namespace ThemeWithPhp;

use ThemeWithPhp\Controllers\AssetController;
use ThemeWithPhp\Controllers\RestController;
use ThemeWithPhp\Controllers\ThemeController;
use ThemeWithPhp\Core\Facade;

defined('ABSPATH') || exit;

/**
 * Boostrap class.
 *
 * @since 1.0.0
 */
final class Bootstrap {
    /**
     * Bootstrap class constructor.
     *
     * @param App $app The app instance.
     *
     * @since 1.0.0
     */
    public function __construct(
        private App $app,
    ) {
    }

    /**
     * Called after creating the app instance to setup the app.
     *
     * @param App $app The app instance.
     *
     * @since 1.0.0
     */
    public static function boot(App $app): void {
        Facade::set_container($app);

        $bootstrap = new self($app);
        $bootstrap->bind_dependencies();
        $app->init();
        $bootstrap->register_controllers();
    }

    /**
     * Populates the container with dependencies (Configs, Services, etc).
     *
     * @since 1.0.0
     */
    public function bind_dependencies(): static {
        return $this;
    }

    /**
     * Creates and registers the controllers.
     *
     * @since 1.0.0
     */
    public function register_controllers(): static {
        AssetController::make($this->app)->register();
        RestController::make($this->app)->register();
        ThemeController::make($this->app)->register();

        return $this;
    }
}
