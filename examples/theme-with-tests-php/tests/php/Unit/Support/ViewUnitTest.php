<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Tests\Unit\Support;

use ThemeWithTestsPhp\App;
use ThemeWithTestsPhp\Support\View;
use ThemeWithTestsPhp\Tests\Unit\AbstractUnitTest;
use ThemeWithTestsPhp\Tests\Utils\UnitTestUtils;

use const ThemeWithTestsPhp\APP_ROOT_DIR;

defined('ABSPATH') || exit;

/**
 * ViewUnitTest class.
 *
 * @since 1.0.0
 */
final class ViewUnitTest extends AbstractUnitTest {
    /**
     * Ensure the view_dir function gets the correct view directory.
     *
     * @since 1.0.0
     */
    public function test_view_dir(): void {
        $this->assertSame(APP_ROOT_DIR . '/inc/views', View::view_dir());
        $this->assertSame(APP_ROOT_DIR . '/inc/views/appended', View::view_dir('/appended'));

        App::set_instance(UnitTestUtils::make_app(
            root_dir: '/root/dir',
            view_path: '/test/views'
        ));

        $this->assertSame('/root/dir/test/views', View::view_dir());
        $this->assertSame('/root/dir/test/views/appended', View::view_dir('/appended'));
    }

    /**
     * Ensure view make creates an instance of view.
     *
     * @since 1.0.0
     */
    public function test_make_view_instanceof_view(): void {
        App::set_instance(UnitTestUtils::make_app(
            view_path: '/tests/resources'
        ));

        $view = View::make('/test-view.php');

        $this->assertInstanceOf(View::class, $view);
    }

    /**
     * Ensure rendered returns view content.
     *
     * @since 1.0.0
     */
    public function test_view_rendered(): void {
        App::set_instance(UnitTestUtils::make_app(
            view_path: '/tests/resources'
        ));

        $app = App::instance();
        $view = new View($app->view_dir('/test-view.php'));

        $this->assertSame('Hello World!', $view->rendered());
    }

    /**
     * Ensure path returns view path.
     *
     * @since 1.0.0
     */
    public function test_view_path(): void {
        App::set_instance(UnitTestUtils::make_app(
            view_path: '/tests/resources'
        ));

        $app = App::instance();
        $view = new View($app->view_dir('/test-view.php'));

        $this->assertSame(
            UnitTestUtils::get_root_dir('/tests/resources/test-view.php'),
            $view->path()
        );
    }

    /**
     * Ensure data returns correct view data.
     *
     * @since 1.0.0
     */
    public function test_view_data(): void {
        App::set_instance(UnitTestUtils::make_app(
            view_path: '/tests/resources'
        ));

        $app = App::instance();
        $data = ['message' => 'Test data!'];
        $view = new View($app->view_dir('/test-view.php'), $data);

        $this->assertSame(
            $data,
            $view->data()
        );
    }

    /**
     * Ensure the view echo's data correctly.
     *
     * @since 1.0.0
     */
    public function test_view_echo(): void {
        App::set_instance(UnitTestUtils::make_app(
            view_path: '/tests/resources'
        ));

        $app = App::instance();
        $view = new View(
            $app->view_dir('/test-view.php'),
            ['message' => 'test message']
        );
        $view->echo();

        $this->expectOutputString('test message');
    }

    /**
     * Ensure the view show data correctly and returns instanceof View.
     *
     * @since 1.0.0
     */
    public function test_view_show(): void {
        App::set_instance(UnitTestUtils::make_app(
            view_path: '/tests/resources'
        ));

        $view = View::show(
            '/test-view.php',
            ['message' => 'test message']
        );

        $this->expectOutputString('test message');
        $this->assertInstanceOf(View::class, $view);
    }
}
