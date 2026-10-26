<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Tests\Unit;

use ThemeWithTestsPhp\Core\Container;
use ThemeWithTestsPhp\Core\Facade;
use ThemeWithTestsPhp\Tests\Stubs\StubService;

defined('ABSPATH') || exit;

/**
 * StubServiceFacade class.
 *
 * @method static string sum(int ...$args)
 *
 * @since 1.0.0
 */
final class StubServiceFacade extends Facade {
    protected static function accessor(): string {
        return StubService::class;
    }
}

/**
 * FacadeUnitTest class.
 *
 * @since 1.0.0
 */
final class FacadeUnitTest extends AbstractUnitTest {
    /**
     * Make sure the facade throws if contianer is not set.
     *
     * @since 1.0.0
     */
    public function test_throws_when_container_not_set(): void {
        Facade::set_container(null);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Facade container has not been set');

        StubServiceFacade::sum(1, 2);
    }

    /**
     * Ensure the Facade correctly runs methods on forwarded service.
     *
     * @since 1.0.0
     */
    public function test_forwards_call_to_resolved_instance(): void {
        $container = new Container();
        $container->bind(StubService::class, fn() => new StubService());
        Facade::set_container($container);

        $this->assertEquals(4, StubServiceFacade::sum(2, 2));
        $this->assertEquals(8, StubServiceFacade::sum(2, 2, 2, 2));
    }

    /**
     * Ensure bound services are correctly used.
     *
     * @since 1.0.0
     */
    public function test_uses_whatever_is_bound_to_the_accessor(): void {
        // create a new method that multiplies instead.
        $stub = new class extends StubService {
            public function sum(int ...$args): int {
                return $args[0] * $args[1];
            }
        };

        $container = new Container();
        $container->bind(StubService::class, fn() => $stub);
        Facade::set_container($container);

        $this->assertEquals(9, StubServiceFacade::sum(3, 3));
    }
}
