<?php

declare(strict_types=1);

namespace ThemeWithPhp\Services;

use ThemeWithPhp\App;
use ThemeWithPhp\Core\MakeableInterface;

defined('ABSPATH') || exit;

/**
 * AbstractService class.
 *
 * @since 1.0.0
 */
abstract class AbstractService implements MakeableInterface {
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
}
