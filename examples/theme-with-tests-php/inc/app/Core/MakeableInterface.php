<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Core;

use ThemeWithTestsPhp\App;

defined('ABSPATH') || exit;

/**
 * MakeableInterface interface.
 *
 * @since 1.0.0
 */
interface MakeableInterface {
    /**
     * Creates an instance of the class.
     *
     * @param App $app the service continer
     *
     * @since 1.0.0
     */
    public static function make(App $app): static;
}
