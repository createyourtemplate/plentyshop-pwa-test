<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfInput
        v-model="googleAdsTrackingId"
        type="text"
        data-testid="google-ads-tracking-id"
        :placeholder="getEditorTranslation('placeholder')"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('googleAdsTrackingId');

const googleAdsTrackingId = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Google Ads Conversion-ID",
    "placeholder": "Google Ads Conversion-ID"
  },
  "de": {
    "label": "Google Ads Conversion-ID",
    "placeholder": "Google Ads Conversion-ID"
  }
}
</i18n>
