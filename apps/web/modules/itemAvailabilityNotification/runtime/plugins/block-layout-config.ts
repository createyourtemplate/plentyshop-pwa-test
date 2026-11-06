/**
 * Theme-specific block layout configuration plugin
 * Registers theme block layout rules by importing the side-effect config module.
 * The imported module merges theme overrides into the global block layout registry.
 */
import '../configuration/block-layout.config';

export default defineNuxtPlugin(() => {
  // This plugin intentionally has no runtime logic.
  // Its only purpose is to guarantee the config side effect is evaluated during app bootstrap.
});
