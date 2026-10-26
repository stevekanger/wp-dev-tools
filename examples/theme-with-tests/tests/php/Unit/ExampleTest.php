<?php

declare(strict_types=1);

namespace ThemeWithTests\Tests\Unit;

/**
 * ExampleTest class.
 *
 * We use the global WP_UnitTestCase from wordpress testing lib.
 *
 * @since 1.0.0
 */
final class ExampleTest extends \WP_UnitTestCase {
    /**
     * Check if the wordpress users table exists so we know our database setup is correctly.
     *
     * @since 1.0.0
     */
    public function testUsersTableExists() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'users';
        $this->assertEquals(
            $table_name,
            $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table_name)),
        );
    }
}
