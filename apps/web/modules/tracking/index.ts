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
    nuxt.options.runtimeConfig.public = { 
      ...nuxt.options.runtimeConfig.public,
      googleAnalyticsToRegister: process.env.NUXT_PUBLIC_GOOGLE_ANALITICS_COOKIES_TO_REGISTER || '',
      googleAdsCookieGroup: process.env.NUXT_PUBLIC_GOOGLE_ADS_COOKIE_GROUP || 'CookieBar.marketing.label',
      googleAdsCookiesToRegister: process.env.NUXT_PUBLIC_GOOGLE_ADS_COOKIES_TO_REGISTER || '',
      googleAdsTrackingId: process.env.NUXT_PUBLIC_GOOGLE_ADS_TRACKING_ID || '',
      enableGoogleAds: process.env.NUXT_PUBLIC_ENABLE_GOOGLE_ADS === 'true',
      registerAdsCookieAsOptOut: process.env.NUXT_PUBLIC_REGISTER_ADS_COOKIE_AS_OPT_OUT === 'true',
      googleGtmCookieGroup: process.env.NUXT_PUBLIC_GOOGLE_GTM_COOKIE_GROUP || 'CookieBar.essentials.label',
      googleGtmCookiesToRegister: process.env.NUXT_PUBLIC_GOOGLE_GTM_COOKIES_TO_REGISTER || '',
      googleGtmTrackingId: process.env.NUXT_PUBLIC_GOOGLE_GTM_TRACKING_ID || '',
      enableGoogleGtm: process.env.NUXT_PUBLIC_ENABLE_GOOGLE_GTM === 'true',
      registerGtmCookieAsOptOut: process.env.NUXT_PUBLIC_REGISTER_GTM_COOKIE_AS_OPT_OUT === 'true'
    }

    nuxt.options.app.head.script = nuxt.options.app.head.script ?? [];
    nuxt.options.app.head.script.push({
      innerHTML: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NUXT_PUBLIC_GOOGLE_ANALITICS_TRACKING_ID}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
      tagPosition: 'bodyOpen',
    });

    nuxt.options.plugins.push(resolve('./runtime/plugins/gtm-init.server'));
    nuxt.options.plugins.push(resolve('./runtime/plugins/gtm-consent.server'));
  },
});
