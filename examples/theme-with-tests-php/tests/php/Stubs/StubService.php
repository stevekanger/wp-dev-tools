<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Tests\Stubs;

defined('ABSPATH') || exit;

/**
 * StubService class.
 *
 * @since 1.0.0
 */
class StubService {
    public function sum(int ...$args): int {
        $sum = 0;

        for ($i = 0; $i < count($args); ++$i) {
            $sum += $args[$i];
        }

        return $sum;
    }
}
