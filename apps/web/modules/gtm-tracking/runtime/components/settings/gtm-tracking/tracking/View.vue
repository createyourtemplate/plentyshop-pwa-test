<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>
    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2">
          <span class="align-middle font-bold">{{ getEditorTranslation('description') }}</span>
        </p>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "SEO Settings",
    "description": "Managing tracking settings and controlling marketing and analytics data collection via Google Tag Manager."
  },
  "de": {
    "label": "SEO Settings",
    "description": "Steuerung und Verwaltung des Trackings sowie der Marketing- und Analyse-Datenerfassung mittels Google Tag Manager."
  }
}
</i18n>
