<?php

declare(strict_types=1);

namespace ThemeWithPhp\Core;

use function ThemeWithPhp\app;

/**
 * Facade class.
 *
 * @since 1.0.0
 */
abstract class Facade {
    /**
     * The accessor method that returns the resource container id.
     *
     * @since 1.0.0
     */
    abstract protected static function accessor(): string;

    /**
     * Php magic method called when static method is called on a class.
     *
     * @param string $method The method called.
     * @param array<int, mixed> $args The args the method's called with.
     *
     * @since 1.0.0
     */
    public static function __callStatic(string $method, array $args): mixed {
        return app()->get(static::accessor())->$method(...$args);
    }
}
