<?php

declare(strict_types=1);

namespace PluginWithTestsPhp\Controllers;

use PluginWithTestsPhp\App;
use PluginWithTestsPhp\Core\MakeableInterface;

defined('ABSPATH') || exit;

/**
 * AbstractController class.
 *
 * @since 1.0.0
 */
abstract class AbstractController implements MakeableInterface {
    /**
     * Creates an instance of the class.
     *
     * @param App $app the app instance
     *
     * @since 1.0.0
     */
    public static function make(App $app): static {
        return new static();
    }

    /**
     * Called when the application initalizes to register wordpress hooks, etc.
     *
     * @since 1.0.0
     */
    abstract public function register(): void;
}
