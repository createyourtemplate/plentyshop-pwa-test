<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>
  </SiteConfigurationView>
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "GTM Tracking",
    "description1": "⚠️ This group of settings will require a shop redeploy to take effect.",
    "description2": "Control if and how you want to use Google Tag Manager."
  },
  "de": {
    "label": "GTM Tracking",
    "description1": "⚠️ Damit diese Einstellungen der Gruppe wirksam wird, ist eine erneute Bereitstellung des Shops erforderlich.",
    "description2": "Steuern Sie, ob und wie Sie Google Tag Manager nutzen möchten."
  }
}
</i18n>
