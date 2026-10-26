<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Controllers;

use ThemeWithTestsPhp\App;

defined('ABSPATH') || exit;

/**
 * RestController class.
 *
 * @since 1.0.0
 */
final class RestController extends AbstractController {
    public const ROUTE_EXAMPLE = '/example';

    /**
     * RestController class constructor.
     *
     * @param string $rest_namespace the app rest namespace
     *
     * @since 1.0.0
     */
    public function __construct(
        private readonly string $rest_namespace,
    ) {
    }

    /**
     * Creates an instance of the class.
     *
     * @param App $app the app instance
     *
     * @since 1.0.0
     */
    public static function make(App $app): static {
        return new static(
            rest_namespace: $app->rest_namespace()
        );
    }

    /**
     * Register wordrpess hooks.
     *
     * @since 1.0.0
     */
    public function register(): void {
        add_action('rest_api_init', [$this, 'register_rest_route']);
    }

    /**
     * Registers the rest routes.
     *
     * @since 1.0.0
     */
    public function register_rest_route(): void {
        register_rest_route($this->rest_namespace, self::ROUTE_EXAMPLE, [
            'methods' => 'GET',
            'callback' => [$this, 'example_route_get'],
            'permissions_callback' => function() {
                return current_user_can('edit_posts');
            },
        ]);
    }

    /**
     * Callback for the example route.
     *
     * @since 1.0.0
     */
    public function example_route_get(): \WP_REST_Response {
        return new \WP_REST_Response([
            'message' => 'Hello World!',
        ]);
    }
}
