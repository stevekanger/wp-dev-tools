<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Tests\Unit;

use ThemeWithTestsPhp\App;
use ThemeWithTestsPhp\Core\Facade;

defined('ABSPATH') || exit;

/**
 * UnitTestCase class.
 *
 * @since 0.1.0
 */
abstract class AbstractUnitTest extends \WP_UnitTestCase {
    private ?App $app = null;

    /**
     * All tests setup.
     *
     * @since 0.1.0
     */
    public function set_up(): void {
        parent::set_up();

        $this->app = App::instance();
    }

    /**
     * All tests tear down.
     *
     * @since 0.1.0
     */
    public function tear_down(): void {
        App::set_instance($this->app);
        Facade::set_container($this->app);

        parent::tear_down();
    }
}
