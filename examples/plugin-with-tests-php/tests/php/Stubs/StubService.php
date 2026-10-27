<?php

declare(strict_types=1);

namespace PluginWithTestsPhp\Tests\Stubs;

defined('ABSPATH') || exit;

/**
 * StubService class.
 *
 * @since 1.0.0
 */
class StubService {
    /**
     * Gets the sum of all args.
     *
     * @param int ...$args The numbers you want to sum.
     *
     * @since 1.0.0
     */
    public function sum(int ...$args): int {
        $sum = 0;

        for ($i = 0; $i < count($args); ++$i) {
            $sum += $args[$i];
        }

        return $sum;
    }
}
