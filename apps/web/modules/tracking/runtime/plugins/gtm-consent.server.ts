import { toBool } from "../utils/utils";

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    return;
  }

  const { add } = useRegisterCookie();

  const config = useRuntimeConfig().public as any;

  const {
    enableCytGA,
    googleCytGACookiesToRegister,
    googleCytGACookieGroup,
    registerCytGACookieAsOptOut,

    enableGoogleAds,
    googleAdsCookiesToRegister,
    googleAdsCookieGroup,
    registerAdsCookieAsOptOut,

    enableGoogleGtm,
    googleGtmCookiesToRegister,
    googleGtmCookieGroup,
    registerGtmCookieAsOptOut
  } = config;

  if (enableGoogleGtm) {
    add({
      name: t('Cyt.cookieBar.moduleGoogleGtm.name'),
      Provider: t('Cyt.cookieBar.moduleGoogleGtm.provider'),
      Status: t('Cyt.cookieBar.moduleGoogleGtm.status'),
      PrivacyPolicy: "https://policies.google.com/privacy",
      Lifespan: t('Cyt.cookieBar.moduleGoogleGtm.lifeSpan'),
      cookieNames: typeof googleGtmCookiesToRegister === 'string' ? googleGtmCookiesToRegister.split(',') : [],
      accepted: toBool(registerGtmCookieAsOptOut),
    }, googleGtmCookieGroup ?? "CookieBar.functional.label");
  }

  if (enableCytGA) {
    add({
      name: t('Cyt.cookieBar.moduleGoogleAnalytics.name'),
      Provider: t('Cyt.cookieBar.moduleGoogleAnalytics.provider'),
      Status: t('Cyt.cookieBar.moduleGoogleAnalytics.status'),
      PrivacyPolicy: "https://policies.google.com/privacy",
      Lifespan: t('Cyt.cookieBar.moduleGoogleAnalytics.lifeSpan'),
      cookieNames: typeof googleCytGACookiesToRegister === 'string' ? googleCytGACookiesToRegister.split(',') : [],
      accepted: toBool(registerCytGACookieAsOptOut),
    }, googleCytGACookieGroup ?? "Cyt.cookieBar.statistics.label");
  }

  if (enableGoogleAds) {
    add({
      name: t('Cyt.cookieBar.moduleGoogleAds.name'),
      Provider: t('Cyt.cookieBar.moduleGoogleAds.provider'),
      Status: t('Cyt.cookieBar.moduleGoogleAds.status'),
      PrivacyPolicy: "https://policies.google.com/privacy/ads",
      Lifespan: t('Cyt.cookieBar.moduleGoogleAds.lifeSpan'),
      cookieNames: typeof googleAdsCookiesToRegister === 'string' ? googleAdsCookiesToRegister.split(',') : [],
      accepted: toBool(registerAdsCookieAsOptOut),
    }, googleAdsCookieGroup ?? 'CookieBar.marketing.label');
  }
});
