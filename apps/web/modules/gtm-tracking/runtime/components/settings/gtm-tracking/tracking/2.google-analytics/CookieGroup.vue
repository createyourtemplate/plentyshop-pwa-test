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
        data-testid="google-cyt-ga-cookie-group"
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
