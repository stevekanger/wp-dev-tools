<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Config;

use ThemeWithTestsPhp\App;
use ThemeWithTestsPhp\Core\MakeableInterface;

defined('ABSPATH') || exit;

/**
 * AbstractConfig class.
 *
 * @since 1.0.0
 */
abstract class AbstractConfig implements MakeableInterface {
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
}
