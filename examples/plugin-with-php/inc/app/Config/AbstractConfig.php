<?php

declare(strict_types=1);

namespace PluginWithPhp\Config;

use PluginWithPhp\App;
use PluginWithPhp\Core\MakeableInterface;

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
     * @param App $app the app instance
     *
     * @since 1.0.0
     */
    public static function make(App $app): static {
        return new static();
    }
}
