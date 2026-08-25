import { defineNuxtModule, createResolver } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'tracking',
  },
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // i18n Modul registrieren
    nuxt.hook('i18n:registerModule', (register: any) => {
      register({
        langDir: resolve('./runtime/lang'),
        locales: [
          {
            code: 'de',
            file: 'de.json',
          },
          {
            code: 'en',
            file: 'en.json',
          },
        ],
      });
    });

    // RuntimeConfig absichern
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || {};
    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {};
    nuxt.options.runtimeConfig.public.cookieGroups = nuxt.options.runtimeConfig.public.cookieGroups || {};
    nuxt.options.runtimeConfig.public.cookieGroups.groups = nuxt.options.runtimeConfig.public.cookieGroups.groups || [];

    const publicRuntimeConfig = nuxt.options.runtimeConfig.public as Record<string, unknown>;

    // Google Analytics (CytGA) -> Statistics
    publicRuntimeConfig.enableCytGA = process.env.NUXT_PUBLIC_ENABLE_CYT_G_A === 'true';
    publicRuntimeConfig.googleCytGACookiesToRegister = process.env.NUXT_PUBLIC_GOOGLE_CYT_G_A_COOKIES_TO_REGISTER || '';
    publicRuntimeConfig.googleCytGACookieGroup = process.env.NUXT_PUBLIC_GOOGLE_CYT_GA_COOKIE_GROUP || 'Cyt.cookieBar.statistics.label';
    publicRuntimeConfig.registerCookieAsOptOut = process.env.NUXT_PUBLIC_REGISTER_CYT_GA_COOKIE_AS_OPT_OUT === 'false';
    publicRuntimeConfig.registerCytGACookieAsOptOut = process.env.NUXT_PUBLIC_REGISTER_CYT_GA_COOKIE_AS_OPT_OUT === 'false';

    // Google Ads -> Marketing
    publicRuntimeConfig.enableGoogleAds = process.env.NUXT_PUBLIC_ENABLE_GOOGLE_ADS === 'true';
    publicRuntimeConfig.googleAdsTrackingId = process.env.NUXT_PUBLIC_GOOGLE_ADS_TRACKING_ID || '';
    publicRuntimeConfig.googleAdsCookieGroup = process.env.NUXT_PUBLIC_GOOGLE_ADS_COOKIE_GROUP || 'CookieBar.marketing.label';
    publicRuntimeConfig.googleAdsCookiesToRegister = process.env.NUXT_PUBLIC_GOOGLE_ADS_COOKIES_TO_REGISTER || '';
    publicRuntimeConfig.registerAdsCookieAsOptOut = process.env.NUXT_PUBLIC_REGISTER_ADS_COOKIE_AS_OPT_OUT === 'false';
    publicRuntimeConfig.sendGrossPricesToCytGoogleAds = process.env.NUXT_PUBLIC_SEND_GROSS_PRICES_TO_CYT_GOOGLE_ADS === 'false';

    // Google Tag Manager (GTM) -> Functional
    publicRuntimeConfig.enableGoogleGtm = process.env.NUXT_PUBLIC_ENABLE_GOOGLE_GTM === 'true';
    publicRuntimeConfig.googleGtmTrackingId = process.env.NUXT_PUBLIC_GOOGLE_GTM_TRACKING_ID || '';
    publicRuntimeConfig.googleGtmCookieGroup = process.env.NUXT_PUBLIC_GOOGLE_GTM_COOKIE_GROUP || 'CookieBar.functional.label';
    publicRuntimeConfig.googleGtmCookiesToRegister = process.env.NUXT_PUBLIC_GOOGLE_GTM_COOKIES_TO_REGISTER || '';
    publicRuntimeConfig.registerGtmCookieAsOptOut = process.env.NUXT_PUBLIC_REGISTER_GTM_COOKIE_AS_OPT_OUT === 'false';

    // Cookie-Gruppen für Banner registrieren
    const currentGroups = nuxt.options.runtimeConfig.public.cookieGroups.groups;
    publicRuntimeConfig.cookieGroups = {
      ...nuxt.options.runtimeConfig.public.cookieGroups,
      groups: [
        ...currentGroups,
        {
          id: currentGroups.length > 0 ? currentGroups.length : 0,
          name: 'Cyt.cookieBar.statistics.label',
          showMore: false,
          description: 'Cyt.cookieBar.statistics.description',
          cookies: [],
        },
      ],
    };

    // Noscript Iframe
    nuxt.options.app = nuxt.options.app || {};
    nuxt.options.app.head = nuxt.options.app.head || {};
    nuxt.options.app.head.script = nuxt.options.app.head.script ?? [];
    nuxt.options.app.head.script.push({
      innerHTML: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${publicRuntimeConfig.googleGtmTrackingId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
      tagPosition: 'bodyOpen',
    });

    // Plugins registrieren
    nuxt.options.plugins = nuxt.options.plugins || [];
    nuxt.options.plugins.push(resolve('./runtime/plugins/gtm-init.server'));
    nuxt.options.plugins.push(resolve('./runtime/plugins/gtm-consent.server'));
  },
});
