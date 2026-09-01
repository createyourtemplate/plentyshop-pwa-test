import { defineNuxtModule, createResolver, addPlugin } from '@nuxt/kit';

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
    
    // Bestehende Gruppen sicher laden
    const existingGroups = (nuxt.options.runtimeConfig.public as any).cookieGroups?.groups ?? [];
    
    // Basis-ID für neue Gruppen ermitteln (höchste bestehende ID + 1)
    const baseId = existingGroups.length > 0 
      ? Math.max(...existingGroups.map((g: any) => Number(g.id) || 0)) + 1 
      : 1;

    const publicRuntimeConfig = nuxt.options.runtimeConfig.public as Record<string, unknown>;

    // GA4 Configuration
    publicRuntimeConfig.enableCytGA = process.env.NUXT_PUBLIC_ENABLE_CYT_G_A === 'true';
    publicRuntimeConfig.googleCytGACookieGroup = process.env.NUXT_PUBLIC_GOOGLE_CYT_G_A_COOKIE_GROUP || 'Cyt.cookieBar.statistics.label';
    publicRuntimeConfig.googleCytGACookiesToRegister = process.env.NUXT_PUBLIC_GOOGLE_CYT_G_A_COOKIES_TO_REGISTER || '';
    publicRuntimeConfig.registerCytGACookieAsOptOut = process.env.NUXT_PUBLIC_REGISTER_CYT_G_A_COOKIE_AS_OPT_OUT === 'true';

    // Ads Configuration
    publicRuntimeConfig.enableGoogleAds = process.env.NUXT_PUBLIC_ENABLE_GOOGLE_ADS === 'true';
    publicRuntimeConfig.googleAdsCookieGroup = process.env.NUXT_PUBLIC_GOOGLE_ADS_COOKIE_GROUP || 'CookieBar.marketing.label';
    publicRuntimeConfig.googleAdsCookiesToRegister = process.env.NUXT_PUBLIC_GOOGLE_ADS_COOKIES_TO_REGISTER || '';
    publicRuntimeConfig.registerAdsCookieAsOptOut = process.env.NUXT_PUBLIC_REGISTER_ADS_COOKIE_AS_OPT_OUT === 'true';
      
    // GTM Configuration
    publicRuntimeConfig.enableGoogleGtm = process.env.NUXT_PUBLIC_ENABLE_GOOGLE_GTM === 'true';
    publicRuntimeConfig.googleGtmCookieGroup = process.env.NUXT_PUBLIC_GOOGLE_GTM_COOKIE_GROUP || 'CookieBar.functional.label';
    publicRuntimeConfig.googleGtmCookiesToRegister = process.env.NUXT_PUBLIC_GOOGLE_GTM_COOKIES_TO_REGISTER || '';
    publicRuntimeConfig.googleGtmTrackingId = process.env.NUXT_PUBLIC_GOOGLE_GTM_TRACKING_ID || '';  
    publicRuntimeConfig.registerGtmCookieAsOptOut = process.env.NUXT_PUBLIC_REGISTER_GTM_COOKIE_AS_OPT_OUT === 'true';

    // Cookie Groups registrieren (Statistiken)
    publicRuntimeConfig.cookieGroups = {
      ...(nuxt.options.runtimeConfig.public as any).cookieGroups,
      groups: [
        ...existingGroups,
        {
          id: baseId,
          name: 'Cyt.cookieBar.statistics.label',
          showMore: false,
          description: 'Cyt.cookieBar.statistics.description',
          cookies: [],
        },
      ]
    };

    // GTM <noscript> Fallback sauber im noscript-Array registrieren
    nuxt.options.app.head.noscript = nuxt.options.app.head.noscript ?? [];
    if (publicRuntimeConfig.googleGtmTrackingId) {
      nuxt.options.app.head.noscript.push({
        innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${publicRuntimeConfig.googleGtmTrackingId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        tagPosition: 'bodyOpen',
      });
    }

    // Plugins über Nuxt Kit addPlugin registrieren
    addPlugin(resolve('./runtime/plugins/gtm-init.server'));
    addPlugin(resolve('./runtime/plugins/gtm-consent.server'));
    addPlugin(resolve('./runtime/plugins/gtm-consent.client'));
    addPlugin(resolve('./runtime/plugins/gtm-events.client'));
  },
});
