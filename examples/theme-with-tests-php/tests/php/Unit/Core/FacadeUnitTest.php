<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Tests\Unit;

use ThemeWithTestsPhp\App;
use ThemeWithTestsPhp\Core\Facade;
use ThemeWithTestsPhp\Tests\Stubs\StubService;
use ThemeWithTestsPhp\Tests\Utils\UnitTestUtils;

defined('ABSPATH') || exit;

/**
 * StubServiceFacade class.
 *
 * @method static string sum(int ...$args)
 *
 * @since 1.0.0
 */
final class StubServiceFacade extends Facade {
    /**
     * Accessor method for facade.
     *
     * @since 0.1.0
     */
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
     * Ensure the Facade correctly runs methods on forwarded service.
     *
     * @since 1.0.0
     */
    public function test_facade_forwards_call_to_resolved_instance(): void {
        $app = UnitTestUtils::make_app();
        App::set_instance($app);
        $app->bind(StubService::class, fn() => new StubService());

        $this->assertEquals(4, StubServiceFacade::sum(2, 2));
        $this->assertEquals(8, StubServiceFacade::sum(2, 2, 2, 2));
    }

    /**
     * Ensure bound services are correctly used.
     *
     * @since 1.0.0
     */
    public function test_facade_uses_whatever_is_bound_to_the_accessor(): void {
        // create a new method that multiplies instead.
        $stub = new class extends StubService {
            public function sum(int ...$args): int {
                return $args[0] * $args[1];
            }
        };

        $app = UnitTestUtils::make_app();
        App::set_instance($app);
        $app->bind(StubService::class, fn() => $stub);

        $this->assertEquals(9, StubServiceFacade::sum(3, 3));
    }
}
