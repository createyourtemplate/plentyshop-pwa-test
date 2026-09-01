<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>

    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2 text-gray-600">
          <span class="align-middle">{{ getEditorTranslation('description') }}</span>
        </p>
      </div>
    </template>

    <div class="px-4 pb-6 space-y-6">
      <!-- 1. Google Tag Manager Bereich -->
      <div class="border-b border-gray-200 pb-4">
        <h3 class="font-bold text-base mb-3 text-gray-800">
          {{ getEditorTranslation('gtmSection') }}
        </h3>
        <EnableGoogleGtm />
        <GoogleGtmTrackingID />
        <GoogleGtmCookieGroup />
        <GoogleGtmRegisterCookies />
      </div>

      <!-- 2. Google Analytics (GA4) Bereich -->
      <div class="border-b border-gray-200 pb-4">
        <h3 class="font-bold text-base mb-3 text-gray-800">
          {{ getEditorTranslation('gaSection') }}
        </h3>
        <EnableGoogleAnalytics />
        <GoogleAnalyticsRegisterCookieAsOptOut />
        <GoogleAnalyticsRegisterCookies />
        <GoogleAnalyticsCookieGroup />
      </div>

      <!-- 3. Google Ads Bereich -->
      <div class="pb-2">
        <h3 class="font-bold text-base mb-3 text-gray-800">
          {{ getEditorTranslation('adsSection') }}
        </h3>
        <EnableGoogleAds />
        <GoogleAdsRegisterCookieAsOptOut />
        <GoogleAdsRegisterCookies />
        <GoogleAdsCookieGroup />
      </div>
    </div>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
// Google Tag Manager Komponenten
import EnableGoogleGtm from './google-tag-manager/EnableGoogleGtm.vue';
import GoogleGtmTrackingID from './google-tag-manager/GoogleGtmTrackingID.vue';
import GoogleGtmCookieGroup from './google-tag-manager/CookieGroup.vue';
import GoogleGtmRegisterCookies from './google-tag-manager/RegisterCookies.vue';

// Google Analytics Komponenten
import EnableGoogleAnalytics from './google-analytics/EnableGoogleAnalytics.vue';
import GoogleAnalyticsCookieGroup from './google-analytics/CookieGroup.vue';
import GoogleAnalyticsRegisterCookies from './google-analytics/RegisterCookies.vue';
import GoogleAnalyticsRegisterCookieAsOptOut from './google-analytics/RegisterCookieAsOptOut.vue';

// Google Ads Komponenten
import EnableGoogleAds from './google-ads/EnableGoogleAds.vue';
import GoogleAdsCookieGroup from './google-ads/CookieGroup.vue';
import GoogleAdsRegisterCookies from './google-ads/RegisterCookies.vue';
import GoogleAdsRegisterCookieAsOptOut from './google-ads/RegisterCookieAsOptOut.vue';
</script>

<i18n lang="json">
{
  "en": {
    "label": "Tracking (GTM, GA4, Ads)",
    "description": "Configure Google Tag Manager, Google Analytics 4, and Google Ads tracking including consent mode.",
    "gtmSection": "Google Tag Manager",
    "gaSection": "Google Analytics (GA4)",
    "adsSection": "Google Ads"
  },
  "de": {
    "label": "Tracking (GTM, GA4, Ads)",
    "description": "Konfigurieren Sie Google Tag Manager, Google Analytics 4 und Google Ads Tracking inklusive Consent Mode.",
    "gtmSection": "Google Tag Manager",
    "gaSection": "Google Analytics (GA4)",
    "adsSection": "Google Ads"
  }
}
</i18n>
