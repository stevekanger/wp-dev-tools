<?php

declare(strict_types=1);

namespace ThemeWithTestsPhp\Controllers;

use ThemeWithTestsPhp\App;
use ThemeWithTestsPhp\Config\BlockConfig;

defined('ABSPATH') || exit;

/**
 * Block Controller.
 *
 * @since 1.0.0
 */
final class BlockController extends AbstractController {
    /**
     * BlockController class constructor.
     *
     * @param string $block_dir the directory the blocks are built to
     * @param array $blocks a list of registerable blocks
     *
     * @since 1.0.0
     */
    public function __construct(
        private readonly string $block_dir,
        private readonly array $blocks,
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
        $config = $app->get(BlockConfig::class);

        return new static(
            block_dir: $config->block_dir,
            blocks: $config->blocks
        );
    }

    /**
     * Register block hooks.
     *
     * @since 1.0.0
     */
    public function register(): void {
        add_action('init', [$this, 'register_blocks']);
    }

    /**
     * Register all blocks.
     *
     * @since 1.0.0
     */
    public function register_blocks(): void {
        foreach ($this->blocks as $slug) {
            $block_path = $this->block_dir . '/' . $slug;
            register_block_type($block_path);
        }
    }
}
