<?php

declare(strict_types=1);

namespace PluginWithTestsPhp\Tests\Unit;

use PluginWithTestsPhp\App;
use PluginWithTestsPhp\Tests\Utils\UnitTestUtils;

use const PluginWithTestsPhp\APP_PREFIX;
use const PluginWithTestsPhp\APP_REST_VERSION;
use const PluginWithTestsPhp\APP_ROOT_DIR;
use const PluginWithTestsPhp\APP_ROOT_FILE;
use const PluginWithTestsPhp\APP_SLUG;
use const PluginWithTestsPhp\APP_TITLE;

/**
 * AppUnitTest class.
 *
 * @since 1.0.0
 */
final class AppUnitTest extends AbstractUnitTest {
    /**
     * Make sure init returns an instance of the app.
     *
     * @since 1.0.0
     */
    public function test_init_returns_self(): void {
        $app = UnitTestUtils::make_app();

        $this->assertSame($app, $app->init());
    }

    /**
     * Make sure calling init twice throws.
     *
     * @since 1.0.0
     */
    public function test_init_throws_when_called_twice(): void {
        $app = UnitTestUtils::make_app();
        $app->init();

        $this->expectException(\LogicException::class);
        $this->expectExceptionMessage('already initialized');

        $app->init();
    }

    /**
     * Make sure App::instance() gets an instance of App.
     */
    public function test_app_instance_returns_instancof_app(): void {
        $app = App::instance();

        $this->assertInstanceOf(App::class, $app);
    }

    /**
     * Ensure app initialized is set properly.
     *
     * @since 1.0.0
     */
    public function test_app_initialized(): void {
        $app = App::instance();
        $this->assertTrue($app->initialized());

        $app = UnitTestUtils::make_app();
        $this->assertFalse($app->initialized());

        $app->init();
        $this->assertTrue($app->initialized());
    }

    /**
     * Ensure App gets the correct title.
     *
     * @since 1.0.0
     */
    public function test_app_title(): void {
        $app = App::instance();
        $this->assertSame(APP_TITLE, $app->title());

        $app = UnitTestUtils::make_app(
            title: 'Test App Title'
        );
        $this->assertSame('Test App Title', $app->title());
    }

    /**
     * Ensure App gets the correct prefix.
     *
     * @since 1.0.0
     */
    public function test_app_prefix(): void {
        $app = App::instance();
        $this->assertSame(APP_PREFIX, $app->prefix());
        $this->assertSame(APP_PREFIX . '_test', $app->prefix('test'));

        $app = UnitTestUtils::make_app(
            prefix: 'test_app_prefix'
        );
        $this->assertSame('test_app_prefix', $app->prefix());
        $this->assertSame('test_app_prefix_test', $app->prefix('test'));
    }

    /**
     * Ensure App gets the correct slug.
     *
     * @since 1.0.0
     */
    public function test_app_slug(): void {
        $app = App::instance();
        $this->assertSame(APP_SLUG, $app->slug());
        $this->assertSame(APP_SLUG . '-test', $app->slug('test'));

        $app = UnitTestUtils::make_app(
            slug: 'test-app-slug'
        );
        $this->assertSame('test-app-slug', $app->slug());
        $this->assertSame('test-app-slug-test', $app->slug('test'));
    }

    /**
     * Ensure app gets the correct version.
     *
     * @since 1.0.0
     */
    public function test_app_version(): void {
        $app = App::instance();
        $this->assertSame(get_file_data(APP_ROOT_FILE, ['Version' => 'Version'])['Version'], $app->version());

        $app = UnitTestUtils::make_app(
            version: '1.2.3'
        );
        $this->assertSame('1.2.3', $app->version());
    }

    /**
     * Ensure app gets the correct rest version.
     *
     * @since 1.0.0
     */
    public function test_app_rest_version(): void {
        $app = App::instance();
        $this->assertSame('v1', $app->rest_version());

        $app = UnitTestUtils::make_app(
            rest_version: 'v5'
        );
        $this->assertSame('v5', $app->rest_version());
    }

    /**
     * Ensure app gets the correct root dir.
     *
     * @since 1.0.0
     */
    public function test_root_dir(): void {
        $app = App::instance();
        $this->assertSame(APP_ROOT_DIR, $app->root_dir());
        $this->assertSame(APP_ROOT_DIR . '/appended', $app->root_dir('/appended'));

        $app = UnitTestUtils::make_app(
            root_dir: '/test/app/root'
        );
        $this->assertSame('/test/app/root', $app->root_dir());
        $this->assertSame('/test/app/root/appended', $app->root_dir('/appended'));
    }

    /**
     * Ensure app gets the correct root file.
     *
     * @since 1.0.0
     */
    public function test_root_file(): void {
        $app = App::instance();
        $this->assertSame(APP_ROOT_FILE, $app->root_file());

        $app = UnitTestUtils::make_app(
            root_file: '/test/app/root/file.php'
        );
        $this->assertSame('/test/app/root/file.php', $app->root_file());
    }

    /**
     * Ensure app gets the correct build dir.
     *
     * @since 1.0.0
     */
    public function test_build_dir(): void {
        $app = App::instance();
        $this->assertSame(APP_ROOT_DIR . '/build', $app->build_dir());
        $this->assertSame(APP_ROOT_DIR . '/build/appended', $app->build_dir('/appended'));

        $app = UnitTestUtils::make_app(
            root_dir: '/test/root',
            build_path: '/test/path'
        );
        $this->assertSame('/test/root/test/path', $app->build_dir());
        $this->assertSame('/test/root/test/path/appended', $app->build_dir('/appended'));
    }

    /**
     * Ensure app gets the correct view dir.
     *
     * @since 1.0.0
     */
    public function test_view_dir(): void {
        $app = App::instance();
        $this->assertSame(APP_ROOT_DIR . '/inc/views', $app->view_dir());
        $this->assertSame(APP_ROOT_DIR . '/inc/views/appended', $app->view_dir('/appended'));

        $app = UnitTestUtils::make_app(
            root_dir: '/test/root',
            view_path: '/test/path'
        );
        $this->assertSame('/test/root/test/path', $app->view_dir());
        $this->assertSame('/test/root/test/path/appended', $app->view_dir('/appended'));
    }

    /**
     * Test root dir url properly sets and appends.
     *
     * @since 1.0.0
     */
    public function test_root_dir_url(): void {
        $app = App::instance();
        $this->assertSame(rtrim(plugin_dir_url(APP_ROOT_FILE), '/'), $app->root_dir_url());
        $this->assertSame(rtrim(plugin_dir_url(APP_ROOT_FILE), '/') . '/appended', $app->root_dir_url('/appended'));

        $app = UnitTestUtils::make_app(
            root_file: __FILE__,
        );
        $this->assertSame(rtrim(plugin_dir_url(__FILE__), '/'), $app->root_dir_url());
        $this->assertSame(rtrim(plugin_dir_url(__FILE__), '/') . '/appended', $app->root_dir_url('/appended'));
    }

    /**
     * Test build dir url properly sets and appends.
     *
     * @since 1.0.0
     */
    public function test_build_dir_url(): void {
        $app = App::instance();
        $this->assertSame(rtrim(plugin_dir_url(APP_ROOT_FILE), '/') . '/build', $app->build_dir_url());
        $this->assertSame(rtrim(plugin_dir_url(APP_ROOT_FILE), '/') . '/build/appended', $app->build_dir_url('/appended'));

        $app = UnitTestUtils::make_app(
            root_file: __FILE__,
            build_path: '/test'
        );
        $this->assertSame(rtrim(plugin_dir_url(__FILE__), '/') . '/test', $app->build_dir_url());
        $this->assertSame(rtrim(plugin_dir_url(__FILE__), '/') . '/test/appended', $app->build_dir_url('/appended'));
    }

    /**
     * Ensure the rest namespace is built correctly.
     *
     * @since 1.0.0
     */
    public function test_rest_namespace(): void {
        $app = App::instance();
        $this->assertSame(APP_SLUG . '/' . APP_REST_VERSION, $app->rest_namespace());
        $this->assertSame(APP_SLUG . '/' . APP_REST_VERSION . '/appended', $app->rest_namespace('/appended'));

        $app = UnitTestUtils::make_app(
            slug: 'test-slug',
            rest_version: 'v5'
        );

        $this->assertSame('test-slug/v5', $app->rest_namespace());
        $this->assertSame('test-slug/v5/appended', $app->rest_namespace('/appended'));
    }

    /**
     * Ensures rest url's are built correctly.
     *
     * @since 1.0.0
     */
    public function test_rest_url(): void {
        $app = App::instance();
        $this->assertTrue(str_contains(APP_SLUG . '/' . APP_REST_VERSION, $app->rest_namespace()));
        $this->assertTrue(str_contains(APP_SLUG . '/' . APP_REST_VERSION . '/appended', $app->rest_namespace('/appended')));

        $app = UnitTestUtils::make_app(
            slug: 'test-slug',
            rest_version: 'v5'
        );

        $this->assertTrue(str_contains('test-slug/v5', $app->rest_namespace()));
        $this->assertTrue(str_contains('test-slug/v5/appended', $app->rest_namespace('/appended')));
    }
}
