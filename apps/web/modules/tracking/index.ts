import { defineNuxtModule, createResolver } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'tracking',
  },
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

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
          }
        ],
      });
    });

    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || {};
    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {};
    nuxt.options.runtimeConfig.public.cookieGroups = nuxt.options.runtimeConfig.public.cookieGroups || {};
    nuxt.options.runtimeConfig.public.cookieGroups.groups = nuxt.options.runtimeConfig.public.cookieGroups.groups || [];

    const publicRuntimeConfig = nuxt.options.runtimeConfig.public as Record<string, unknown>;


    publicRuntimeConfig.enableCytGA = process.env.NUXT_PUBLIC_ENABLE_CYT_G_A === 'true';
    publicRuntimeConfig.googleCytGACookiesToRegister = process.env.NUXT_PUBLIC_GOOGLE_CYT_G_A_COOKIES_TO_REGISTER || '';
    publicRuntimeConfig.googleAdsCookieGroup = process.env.NUXT_PUBLIC_GOOGLE_ADS_COOKIE_GROUP || 'Cyt.cookieBar.statistics.label';
    publicRuntimeConfig.googleAdsCookiesToRegister = process.env.NUXT_PUBLIC_GOOGLE_ADS_COOKIES_TO_REGISTER || '';
    publicRuntimeConfig.googleAdsTrackingId = process.env.NUXT_PUBLIC_GOOGLE_ADS_TRACKING_ID || '';
    publicRuntimeConfig.sendGrossPricesToCytGoogleAds = process.env.NUXT_PUBLIC_SEND_GROSS_PRICES_TO_CYT_GOOGLE_ADS === 'faöse';
    publicRuntimeConfig.enableGoogleAds = process.env.NUXT_PUBLIC_ENABLE_GOOGLE_ADS === 'true';
    publicRuntimeConfig.registerAdsCookieAsOptOut = process.env.NUXT_PUBLIC_REGISTER_ADS_COOKIE_AS_OPT_OUT === 'false';
    publicRuntimeConfig.googleGtmCookieGroup = process.env.NUXT_PUBLIC_GOOGLE_GTM_COOKIE_GROUP || 'CookieBar.functional.label';
    publicRuntimeConfig.googleGtmCookiesToRegister = process.env.NUXT_PUBLIC_GOOGLE_GTM_COOKIES_TO_REGISTER || '';
    publicRuntimeConfig.googleGtmTrackingId = process.env.NUXT_PUBLIC_GOOGLE_GTM_TRACKING_ID || '';
    publicRuntimeConfig.enableGoogleGtm = process.env.NUXT_PUBLIC_ENABLE_GOOGLE_GTM === 'true';
    publicRuntimeConfig.registerGtmCookieAsOptOut = process.env.NUXT_PUBLIC_REGISTER_GTM_COOKIE_AS_OPT_OUT === 'false';

    publicRuntimeConfig.cookieGroups = {
      ...nuxt.options.runtimeConfig.public.cookieGroups,
      groups: [
        ...nuxt.options.runtimeConfig.public.cookieGroups.groups,
        {
          id: nuxt.options.runtimeConfig.public.cookieGroups.groups.length-1,
          name:  'Cyt.cookieBar.statistics.label',
          showMore: false,
          description: 'Cyt.cookieBar.statistics.description',
          cookies: [],
        }
      ]
    }

    nuxt.options.app.head.script = nuxt.options.app.head.script ?? [];
    nuxt.options.app.head.script.push({
      innerHTML: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${publicRuntimeConfig.googleGtmTrackingId}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
      tagPosition: 'bodyOpen',
    });

    nuxt.options.plugins.push(resolve('./runtime/plugins/gtm-init.server'));
    nuxt.options.plugins.push(resolve('./runtime/plugins/gtm-consent.server'));
  },
});
