/**
 * Theme-specific block layout rules
 * Extends the core BLOCK_LAYOUT_RULES with custom block configurations
 */

import { BLOCK_LAYOUT_RULES } from '~/configuration/block-layout.config';
import type { BlockLayoutRule } from '~/configuration/block-layout.config';

/**
 * Theme-specific block layout rules
 * These will be merged with the core rules at runtime
 */
export const THEME_BLOCK_LAYOUT_RULES: Record<string, BlockLayoutRule> = {
  ItemAvailabilityNotification: { padding: false },
};

/**
 * Merge theme rules with core rules
 * This runs once when the configuration is imported
 */
Object.assign(BLOCK_LAYOUT_RULES, THEME_BLOCK_LAYOUT_RULES);
