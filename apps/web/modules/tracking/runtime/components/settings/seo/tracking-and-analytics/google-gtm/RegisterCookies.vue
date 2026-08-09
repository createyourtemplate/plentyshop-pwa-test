<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfInput
        v-model="googleGtmCookiesToRegister"
        type="text"
        data-testid="google-gtm-cookies-to-register"
        :placeholder="getEditorTranslation('placeholder')"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('googleGtmCookiesToRegister');

const googleGtmCookiesToRegister = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Cookies that should be registered",
    "placeholder": "Comma-separated"
  },
  "de": {
    "label": "Cookies die registriert werden sollen",
    "placeholder": "Kommasepariert"
  }
}
</i18n>
