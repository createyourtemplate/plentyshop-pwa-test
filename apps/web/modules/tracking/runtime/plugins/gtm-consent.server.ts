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
        name: t('Cyt.cookieBar.moduleGoogleGtm.name'),
        Provider: t('Cyt.cookieBar.moduleGoogleGtm.provider'),
        Status: t('Cyt.cookieBar.moduleGoogleGtm.status'),
        PrivacyPolicy: "https://policies.google.com/privacy",
        Lifespan: t('Cyt.cookieBar.moduleGoogleGtm.lifeSpan'),
        cookieNames: googleGtmCookiesToRegister.split(','),
        accepted: registerGtmCookieAsOptOut,
      }, googleGtmCookieGroup || 'CookieBar.essentials.label');
    }

    if ( enableGoogleAds ) {
      add({
        name: t('Cyt.cookieBar.moduleGoogleAds.name'),
        Provider: t('Cyt.cookieBar.moduleGoogleAds.provider'),
        Status: t('Cyt.cookieBar.moduleGoogleAds.status'),
        PrivacyPolicy: "https://policies.google.com/privacy/ads",
        Lifespan: t('Cyt.cookieBar.moduleGoogleAds.lifeSpan'),
        cookieNames: googleAdsCookiesToRegister.split(','),
        accepted: registerAdsCookieAsOptOut,
      }, googleAdsCookieGroup || 'CookieBar.essentials.label');
    }
});
