<template>
  <SfTooltip
    :label="getEditorTranslation('tooltip')"
    placement="right"
    class="inline-grid font-editor"
    :show-arrow="true"
  >
    <button
      type="button"
      class="editor-button relative py-2 flex justify-center"
      :class="{ 'bg-editor-button text-white rounded-md': active }"
      aria-label="Open tracking settings drawer"
      data-testid="open-tracking-settings-drawer"
    >
      <NuxtImg v-if="active" width="24" height="24px" :src="whiteIcon" />
      <NuxtImg v-else width="24" height="24px" :src="blackIcon" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';
import whiteIcon from '~/assets/icons/paths/seo-white.svg'; // Bei Bedarf durch Tracking-Icon ersetzen
import blackIcon from '~/assets/icons/paths/seo-black.svg';

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
