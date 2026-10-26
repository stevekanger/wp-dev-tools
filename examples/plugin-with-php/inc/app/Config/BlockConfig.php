<?php

declare(strict_types=1);

namespace PluginWithPhp\Config;

use PluginWithPhp\App;

defined('ABSPATH') || exit;

/**
 * BlockConfig class.
 *
 * @since 1.0.0
 */
final class BlockConfig extends AbstractConfig {
    // List of block slugs to register
    private const array BLOCKS = [];

    /**
     * BlockConfig class constructor.
     *
     * @param string $block_dir the directory the blocks are built to
     * @param array $blocks a list of registerable blocks
     *
     * @since 1.0.0
     */
    public function __construct(
        public readonly string $block_dir,
        public readonly array $blocks,
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
            block_dir: $app->build_dir('/blocks'),
            blocks: self::BLOCKS
        );
    }
}
