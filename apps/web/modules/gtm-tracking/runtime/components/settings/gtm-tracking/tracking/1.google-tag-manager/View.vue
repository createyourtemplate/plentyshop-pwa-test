<template>
  <SiteConfigurationView>
    <template #setting-breadcrumbs>{{ getEditorTranslation('breadcrumbs') }}</template>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>
  </SiteConfigurationView>
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "breadcrumbs": "GTM Tracking",
    "label": "Google Tag Manager"
  },
  "de": {
    "breadcrumbs": "GTM Tracking",
    "label": "Google Tag Manager"
  }
}
</i18n>
