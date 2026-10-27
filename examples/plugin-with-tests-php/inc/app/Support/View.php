<?php

declare(strict_types=1);

namespace PluginWithTestsPhp\Support;

use function PluginWithTestsPhp\app;

/**
 * Create a view from template part.
 *
 * @since 1.0.0
 */
final class View {
    private string $rendered;
    private string $path;
    private mixed $data;

    /**
     * Construct the view object attributes.
     *
     * @param string $path The full path to the template file.
     * @param mixed $data Any data you want passed to the view (Note: this data will be extracted to variables).
     *
     * @since 1.0.0
     */
    public function __construct(string $path, array $data = []) {
        $this->path = $path;
        $this->data = $data;

        extract($data, EXTR_SKIP);
        ob_start();
        include $path;
        $this->rendered = ob_get_clean();
    }

    /**
     * Gets the app view directory.
     *
     * @param string $path Any path you want to append (requires you to add the preceeding /).
     *
     * @since 1.0.0
     */
    public static function view_dir(string $path = ''): string {
        return app()->view_dir($path);
    }

    /**
     * Creates a view from the view directory.
     *
     * @param string $path Any path you want to append (requires you to add the preceeding /).
     * @param mixed $data Any data you want passed to the view (Note: this data will be extracted to variables).
     */
    public static function make(string $path, $data = []): static {
        return new static(self::view_dir($path), $data);
    }

    /**
     * Creates a view from the view directory and echos it.
     *
     * @param string $path The template file path relative to the view directory.
     * @param mixed $data Any data you want passed to the view (Note: this data will be extracted to variables).
     */
    public static function show(string $path, $data = []): static {
        $instance = self::make($path, $data);

        return $instance->echo();
    }

    /**
     * Echo the rendered output.
     *
     * @since 1.0.0
     */
    public function echo(): static {
        echo $this->rendered;

        return $this;
    }

    /**
     * Get the rendered output.
     *
     * @since 1.0.0
     */
    public function rendered(): string {
        return $this->rendered;
    }

    /**
     * Get the view path.
     *
     * @since 1.0.0
     */
    public function path(): string {
        return $this->path;
    }

    /**
     * Get the template data.
     *
     * @since 1.0.0
     */
    public function data(): mixed {
        return $this->data;
    }
}
