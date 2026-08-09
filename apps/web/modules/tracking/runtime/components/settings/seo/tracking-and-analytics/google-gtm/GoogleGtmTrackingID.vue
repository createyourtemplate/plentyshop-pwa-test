<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfInput
        v-model="googlegtmTrackingId"
        type="text"
        data-testid="google-gtm-tracking-id"
        :placeholder="getEditorTranslation('placeholder')"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('googlegtmTrackingId');

const googlegtmTrackingId = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Google GTM Tracking ID",
    "placeholder": "Google GTM Tracking ID"
  },
  "de": {
    "label": "Google GTM Tracking ID",
    "placeholder": "Google GTM Tracking ID"
  }
}
</i18n>
