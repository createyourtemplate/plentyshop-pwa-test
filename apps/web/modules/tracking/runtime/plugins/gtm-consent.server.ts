import { toBool } from "../utils/utils";

export default defineNuxtPlugin(() => {

    if (import.meta.client) {
      return;
    }

    const { add } = useRegisterCookie();

    const { public: {
      enableCytGA,
      googleCytGACookiesToRegister,
      registerCookieAsOptOut,
      googleAdsCookiesToRegister,
      enableGoogleAds,
      registerAdsCookieAsOptOut,
      googleGtmCookiesToRegister,
      enableGoogleGtm,
      googleGtmCookieGroup,
      registerGtmCookieAsOptOut 
    } } = useRuntimeConfig();

    if ( enableGoogleGtm ) {
      add({
        name: t('Cyt.cookieBar.moduleGoogleGtm.name'),
        Provider: t('Cyt.cookieBar.moduleGoogleGtm.provider'),
        Status: t('Cyt.cookieBar.moduleGoogleGtm.status'),
        PrivacyPolicy: "https://policies.google.com/privacy",
        Lifespan: t('Cyt.cookieBar.moduleGoogleGtm.lifeSpan'),
        cookieNames: googleGtmCookiesToRegister.split(','),
        accepted: toBool(registerGtmCookieAsOptOut),
      }, googleGtmCookieGroup ?? "CookieBar.functional.label");
    }

    if ( enableCytGA ) {
      add({
        name: t('Cyt.cookieBar.moduleGoogleAnalytics.name'),
        Provider: t('Cyt.cookieBar.moduleGoogleAnalytics.provider'),
        Status: t('Cyt.cookieBar.moduleGoogleAnalytics.status'),
        PrivacyPolicy: "https://policies.google.com/privacy",
        Lifespan: t('Cyt.cookieBar.moduleGoogleAnalytics.lifeSpan'),
        cookieNames: googleCytGACookiesToRegister.split(','),
        accepted: toBool(registerCookieAsOptOut),
      }, "Cyt.cookieBar.statistics.label");
    }


    if ( enableGoogleAds ) {
      add({
        name: t('Cyt.cookieBar.moduleGoogleAds.name'),
        Provider: t('Cyt.cookieBar.moduleGoogleAds.provider'),
        Status: t('Cyt.cookieBar.moduleGoogleAds.status'),
        PrivacyPolicy: "https://policies.google.com/privacy/ads",
        Lifespan: t('Cyt.cookieBar.moduleGoogleAds.lifeSpan'),
        cookieNames: googleAdsCookiesToRegister.split(','),
        accepted: toBool(registerAdsCookieAsOptOut),
      }, 'CookieBar.marketing.label');
    }
});
