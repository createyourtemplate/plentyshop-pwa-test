<template>
  <div class="py-2 hidden d-none">
    <p class="mb-4">{{ getEditorTranslation('description1') }}</p>
    <p class="mb-4">{{ getEditorTranslation('description2') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="googleCytGACookieGroup"
        :options="options"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        label="label"
        track-by="value"
        select-label=""
        deselect-label=""
        data-testid="google-analytics-cookie-group"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import type { SettingOption } from '~/utils/editorSettings';
import { getCookieGroupOptions } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('googleCytGACookieGroup');

const options = computed(() => getCookieGroupOptions());

const googleCytGACookieGroup = computed({
  get: () => {
    return options.value.find((o: SettingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option?.value ?? '');
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Cookie Group",
    "description1": "⚠️ This group of settings will require a shop redeploy to take effect.",
    "description2": "Control if and how you want to use Google Analytics.",
    "placeholder": "Select Cookie Group"
  },
  "de": {
    "label": "Cookie Gruppe",
    "description1": "⚠️ Damit diese Einstellungen der Gruppe wirksam wird, ist eine erneute Bereitstellung des Shops erforderlich.",
    "description2": "Steuern Sie, ob und wie Sie Google Analytics nutzen möchten.",
    "placeholder": "Cookie-Gruppe auswählen"
  }
}
</i18n>



