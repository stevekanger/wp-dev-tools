<?php

declare(strict_types=1);

namespace PluginWithTestsPhp\Core;

/**
 * Facade class.
 *
 * @since 1.0.0
 */
abstract class Facade {
    private static ?Container $container = null;

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
        return self::container()->get(static::accessor())->$method(...$args);
    }

    /**
     * Sets the contianer instance.
     *
     * @param ?Container $container The service container.
     *
     * @internal null container should only be set for testing.
     *
     * @since 1.0.0
     */
    public static function set_container(?Container $container): void {
        self::$container = $container;
    }

    /**
     * Gets the container instance.
     *
     * @throws \RuntimeException If no container is set.
     *
     * @since 1.0.0
     */
    private static function container(): Container {
        if (!self::$container) {
            throw new \RuntimeException('Facade container has not been set');
        }

        return self::$container;
    }
}
