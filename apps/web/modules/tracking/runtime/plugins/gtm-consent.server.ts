export default defineNuxtPlugin(() => {

    if (import.meta.client) {
      return;
    }

    const { public: {
      // googleAnalyticsToRegister,
      googleAdsCookieGroup,
      googleAdsCookiesToRegister,
      // googleAdsTrackingId,
      enableGoogleAds,
      registerAdsCookieAsOptOut,
      googleGtmCookieGroup,
      googleGtmCookiesToRegister,
      enableGoogleGtm,
      registerGtmCookieAsOptOut 
    } } = useRuntimeConfig();

    const { add } = useRegisterCookie();

    if ( enableGoogleGtm ) {
      add({
        name: 'Google GTM',
        Provider: 'Cyt.cookieBar.moduleGoogleGtm.provider',
        Status: 'CookieBar.moduleGoogleAnalytics.status',
        PrivacyPolicy: 'https://policies.google.com/privacy',
        Lifespan: 'Session',
        cookieNames: googleGtmCookiesToRegister.split(','),
        accepted: registerGtmCookieAsOptOut,
      }, googleGtmCookieGroup || 'CookieBar.essentials.label');
    }

    if ( enableGoogleAds ) {
      add({
        name: 'Google Ads',
        Provider: 'Cyt.cookieBar.moduleGoogleGtm.provider',
        Status: 'CookieBar.moduleGoogleAnalytics.status',
        PrivacyPolicy: 'https://policies.google.com/privacy',
        Lifespan: 'Session',
        cookieNames: googleAdsCookiesToRegister.split(','),
        accepted: registerAdsCookieAsOptOut,
      }, googleAdsCookieGroup || 'CookieBar.essentials.label');
    }
});
