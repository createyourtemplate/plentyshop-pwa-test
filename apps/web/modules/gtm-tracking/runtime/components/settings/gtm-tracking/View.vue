<template>
  <SiteConfigurationView>
    <!-- Blendet die Zeile 'gtm-tracking' oben drüber komplett aus: -->
    <template #setting-breadcrumbs><span /></template>

    <!-- Haupttitel: -->
    <template #setting-title>{{ getEditorTranslation('label') }}</template>

    <!-- Beschreibung & Versionsanzeige: -->
    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2 text-neutral-600">
          {{ getEditorTranslation('description') }}
        </p>
        <!-- Versionsangabe: -->
        <span class="text-xs text-neutral-400 font-mono pb-2">
          Version 1.0.0 • createyourtemplate
        </span>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Tracking & Analytics",
    "description": "Managing tracking settings and controlling marketing and analytics data collection via Google Tag Manager."
  },
  "de": {
    "label": "Tracking & Analytics",
    "description": "Verwaltung der Tracking-Einstellungen und Steuerung der Erfassung von Marketing- und Analysedaten über den Google Tag Manager."
  }
}
</i18n>
