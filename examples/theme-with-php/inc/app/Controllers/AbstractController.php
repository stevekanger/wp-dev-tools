<?php

declare(strict_types=1);

namespace ThemeWithPhp\Controllers;

use ThemeWithPhp\App;
use ThemeWithPhp\Core\MakeableInterface;

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
     * @param App $app The app instance.
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
