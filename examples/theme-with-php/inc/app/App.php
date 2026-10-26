<?php

declare(strict_types=1);

namespace ThemeWithPhp;

use ThemeWithPhp\Core\Container;

defined('ABSPATH') || exit;

/**
 * App class.
 *
 * @since 1.0.0
 */
final class App extends Container {
    private static ?App $instance = null;
    private bool $initialized = false;

    /**
     * App class constructor.
     *
     * @param string $title the app title
     * @param string $prefix the app prefix
     * @param string $slug the app slug
     * @param string $version the app version
     * @param string $rest_version the rest api version
     * @param string $root_dir the app root directory
     * @param string $root_file the app root file
     * @param string $build_path the build direcotry relative to root_dir
     * @param string $view_path the views directory relative to root_dir
     *
     * @since 1.0.0
     */
    public function __construct(
        private readonly string $title,
        private readonly string $prefix,
        private readonly string $slug,
        private readonly string $version,
        private readonly string $rest_version,
        private readonly string $root_dir,
        private readonly string $root_file,
        private readonly string $build_path,
        private readonly string $view_path,
    ) {
    }

    /**
     * Creates the app instance.
     *
     * @since 1.0.0
     */
    public static function make(): App {
        $app = new App(
            title: APP_TITLE,
            prefix: APP_PREFIX,
            slug: APP_SLUG,
            version: get_file_data(APP_ROOT_FILE, ['Version' => 'Version'])['Version'] ?: '1.0.0',
            rest_version: APP_REST_VERSION,
            root_dir: APP_ROOT_DIR,
            root_file: APP_ROOT_FILE,
            build_path: APP_BUILD_PATH,
            view_path: APP_VIEW_PATH,
        );

        return $app;
    }

    /**
     * Gets the app instance.
     *
     * @since 1.0.0
     */
    public static function instance(): self {
        if (null === self::$instance) {
            self::$instance = self::make();
            Bootstrap::boot(self::$instance);
        }

        return self::$instance;
    }

    /**
     * Sets the app instance.
     *
     * @param ?App $app the app instance or null
     *
     * @internal Used by tests to swap or clear the app instance.
     *
     * @since 1.0.0
     */
    public static function set_instance(?App $app): void {
        self::$instance = $app;
    }

    /**
     * Initializes any application specific functionality.
     *
     * @since 1.0.0
     */
    public function init(): static {
        if ($this->initialized) {
            throw new \LogicException('Attempt to call App::init when already initialized.');
        }

        // Add any app specific initialization here to run after dependencies are populated

        // Set App initialized
        $this->initialized = true;

        return $this;
    }

    /**
     * Gets the app initialized status.
     *
     * @since 1.0.0
     */
    public function initialized(): bool {
        return $this->initialized;
    }

    /**
     * Gets the app version.
     *
     * @since 1.0.0
     */
    public function version(): string {
        return $this->version;
    }

    /**
     * Gets the rest version.
     *
     * @since 1.0.0
     */
    public function rest_version(): string {
        return $this->rest_version;
    }

    /**
     * Gets the title.
     *
     * @since 1.0.0
     */
    public function title(): string {
        return $this->title;
    }

    /**
     * Gets the prefix.
     *
     * @param string $suffix any string you want to append
     *
     * @since 1.0.0
     */
    public function prefix(string $suffix = ''): string {
        $prefix = $this->prefix;

        return '' !== $suffix ? "{$prefix}_{$suffix}" : $prefix;
    }

    /**
     * Gets the slug.
     *
     * @param string $suffix any string you want to append
     *
     * @since 1.0.0
     */
    public function slug(string $suffix = ''): string {
        $slug = $this->slug;

        return '' !== $suffix ? "{$slug}-{$suffix}" : $slug;
    }

    /**
     * Gets the root directory.
     *
     * @param string $path any path you want to append (requires you to add the preceeding /)
     *
     * @since 1.0.0
     */
    public function root_dir(string $path = ''): string {
        return $this->root_dir . $path;
    }

    /**
     * Gets the root file.
     *
     * @since 1.0.0
     */
    public function root_file(): string {
        return $this->root_file;
    }

    /**
     * Gets the blocks directory src is built to.
     *
     * @param string $path any path you want to append (requires you to add the preceeding /)
     *
     * @since 1.0.0
     */
    public function build_dir(string $path = ''): string {
        return $this->root_dir . $this->build_path . $path;
    }

    /**
     * Gets the view directory.
     *
     * @param string $path any path you want to append (requires you to add the preceeding /)
     *
     * @since 1.0.0
     */
    public function view_dir(string $path = ''): string {
        return $this->root_dir . $this->view_path . $path;
    }

    /**
     * Gets the root directory url.
     *
     * @param string $path any path you want to append (requires you to add the preceeding /)
     *
     * @since 1.0.0
     */
    public function root_dir_url(string $path = ''): string {
        return rtrim(plugin_dir_url($this->root_file()), '/') . $path;
    }

    /**
     * Gets the build directory url.
     *
     * @param string $path any path you want to append (requires you to add the preceeding /)
     *
     * @since 1.0.0
     */
    public function build_dir_url(string $path = ''): string {
        return $this->root_dir_url($this->build_path) . $path;
    }

    /**
     * Gets the rest namespace.
     *
     * Note: Calling with no $path argument will return the api namespace
     *
     * @param string $path any path you want to append (requires you to add the preceeding /)
     *
     * @since 1.0.0
     */
    public function rest_namespace(string $path = ''): string {
        return $this->slug . '/' . $this->rest_version . $path;
    }

    /**
     * Gets the full api url with path appended to the rest namespace.
     *
     * Note: Calling with no $path argument will return the api namespace
     *
     * @param string $path any path you want to append (requires you to add the preceeding /)
     *
     * @since 1.0.0
     */
    public function rest_url(string $path = ''): string {
        return rest_url($this->rest_namespace($path));
    }
}
