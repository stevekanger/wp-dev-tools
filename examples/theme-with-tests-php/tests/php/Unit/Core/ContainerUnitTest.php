<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Tests\Unit\Core;

use ThemeWithTestsPhp\Core\Container;
use ThemeWithTestsPhp\Tests\Stubs\StubService;
use ThemeWithTestsPhp\Tests\Unit\AbstractUnitTest;

defined('ABSPATH') || exit;

/*
 * ContainerUnitTest class.
 *
 * @since 1.0.0
 */
final class ContainerUnitTest extends AbstractUnitTest {
    /**
     * Ensure container properly registers and retrieves classes.
     *
     * @since 1.0.0
     */
    public function test_container_registers_all_types(): void {
        $container = new Container();

        $container->bind(StubService::class, fn() => new StubService());
        $container->bind('true', fn() => true);
        $container->bind('false', fn() => false);
        $container->bind('null', fn() => null);
        $container->bind('array', fn() => ['foo' => 'bar']);

        $instance = $container->get(StubService::class);
        $this->assertTrue($instance instanceof StubService);
        $this->assertTrue($container->get('true'));
        $this->assertFalse($container->get('false'));
        $this->assertNull($container->get('null'));
        $this->assertIsArray($container->get('array'));
        $this->assertSame('bar', $container->get('array')['foo']);
    }

    /**
     * Ensure the container has() function works properly.
     *
     * @since 1.0.0
     */
    public function test_container_has(): void {
        $container = new Container();
        $container->bind(StubService::class, fn() => new StubService());

        $this->assertTrue($container->has(StubService::class));
    }

    /**
     * Ensure container overwrites existing bindings when the same key is set.
     *
     * @since 1.0.0
     */
    public function test_container_overwrites_bound_items(): void {
        $container = new Container();

        $container->bind('one', fn() => 1);
        $container->bind('two', fn() => 2);

        $container->get('one');
        $container->get('two');

        $container->bind('one', fn() => 3);
        $container->bind('two', fn() => new StubService());

        $this->assertEquals(3, $container->get('one'));
        $this->assertInstanceOf(StubService::class, $container->get('two'));
    }
}
