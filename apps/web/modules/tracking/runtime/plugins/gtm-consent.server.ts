import { toBool } from "../utils/utils";

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    return;
  }

  const { t } = useI18n();
  const { add } = useRegisterCookie();

  const config = useRuntimeConfig().public as {
    enableCytGA?: boolean | string;
    googleCytGACookiesToRegister?: string;
    registerCookieAsOptOut?: boolean | string;
    googleAdsCookiesToRegister?: string;
    enableGoogleAds?: boolean | string;
    registerAdsCookieAsOptOut?: boolean | string;
    googleGtmCookiesToRegister?: string;
    enableGoogleGtm?: boolean | string;
    googleGtmCookieGroup?: string;
    registerGtmCookieAsOptOut?: boolean | string;
  };

  const {
    enableCytGA,
    googleCytGACookiesToRegister = '',
    registerCookieAsOptOut,
    googleAdsCookiesToRegister = '',
    enableGoogleAds,
    registerAdsCookieAsOptOut,
    googleGtmCookiesToRegister = '',
    enableGoogleGtm,
    googleGtmCookieGroup,
    registerGtmCookieAsOptOut,
  } = config;

  if (toBool(enableGoogleGtm)) {
    const group = typeof googleGtmCookieGroup === 'string' && googleGtmCookieGroup
      ? googleGtmCookieGroup
      : 'CookieBar.functional.label';

    add(
      {
        name: t('Cyt.cookieBar.moduleGoogleGtm.name'),
        Provider: t('Cyt.cookieBar.moduleGoogleGtm.provider'),
        Status: t('Cyt.cookieBar.moduleGoogleGtm.status'),
        PrivacyPolicy: 'https://policies.google.com/privacy',
        Lifespan: t('Cyt.cookieBar.moduleGoogleGtm.lifeSpan'),
        cookieNames: String(googleGtmCookiesToRegister).split(',').filter(Boolean),
        accepted: toBool(registerGtmCookieAsOptOut),
      },
      group
    );
  }

  if (toBool(enableCytGA)) {
    add(
      {
        name: t('Cyt.cookieBar.moduleGoogleAnalytics.name'),
        Provider: t('Cyt.cookieBar.moduleGoogleAnalytics.provider'),
        Status: t('Cyt.cookieBar.moduleGoogleAnalytics.status'),
        PrivacyPolicy: 'https://policies.google.com/privacy',
        Lifespan: t('Cyt.cookieBar.moduleGoogleAnalytics.lifeSpan'),
        cookieNames: String(googleCytGACookiesToRegister).split(',').filter(Boolean),
        accepted: toBool(registerCookieAsOptOut),
      },
      'Cyt.cookieBar.statistics.label'
    );
  }

  if (toBool(enableGoogleAds)) {
    add(
      {
        name: t('Cyt.cookieBar.moduleGoogleAds.name'),
        Provider: t('Cyt.cookieBar.moduleGoogleAds.provider'),
        Status: t('Cyt.cookieBar.moduleGoogleAds.status'),
        PrivacyPolicy: 'https://policies.google.com/privacy/ads',
        Lifespan: t('Cyt.cookieBar.moduleGoogleAds.lifeSpan'),
        cookieNames: String(googleAdsCookiesToRegister).split(',').filter(Boolean),
        accepted: toBool(registerAdsCookieAsOptOut),
      },
      'CookieBar.marketing.label'
    );
  }
});
