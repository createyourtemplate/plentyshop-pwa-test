<template>
  <SfTooltip
    :label="getEditorTranslation('tooltip')"
    placement="right"
    class="inline-grid font-editor"
    :show-arrow="true"
  >
    <button
      type="button"
      class="editor-button relative py-2 flex justify-center items-center"
      :class="{ 'bg-editor-button text-white rounded-md': active, 'text-neutral-900': !active }"
      aria-label="Open tracking settings drawer"
      data-testid="open-tracking-settings-drawer"
    >
      <!-- Target / Tracking Icon -->
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "Tracking: Manage Google Tag Manager, GA4, and Google Ads settings."
  },
  "de": {
    "tooltip": "Tracking: Einstellungen für Google Tag Manager, GA4 und Google Ads verwalten."
  }
}
</i18n>
