<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Traits;

defined('ABSPATH') || exit;

/**
 * Allows access to the $wpdb instance.
 *
 * @since 1.0.0
 */
trait WpdbTrait {
    /**
     * Gets the $wpdb instance.
     *
     * @since 1.0.0
     */
    protected function wpdb(): \wpdb {
        global $wpdb;

        return $wpdb;
    }
}
