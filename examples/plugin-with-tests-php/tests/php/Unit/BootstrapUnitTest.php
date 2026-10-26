<?php

declare(strict_types=1);

namespace PluginWithTestsPhp\Tests\Unit;

use PluginWithTestsPhp\App;
use PluginWithTestsPhp\Bootstrap;
use PluginWithTestsPhp\Tests\Utils\UnitTestUtils;

defined('ABSPATH') || exit;

/**
 * BootstrapTest class.
 *
 * @since 
 */
final class BootstrapUnitTest extends AbstractUnitTest {
    /**
     * Make sure functions return an instance of Bootstrap.
     *
     * @since 
     */
    public function test_bind_dependencies_returns_self(): void {
        $app = UnitTestUtils::make_app();

        $this->assertInstanceOf(App::class, $app);

        $bootstrap = new Bootstrap($app);

        $this->assertSame($bootstrap, $bootstrap->bind_dependencies());
        $this->assertSame($bootstrap, $bootstrap->register_controllers());
    }
}
