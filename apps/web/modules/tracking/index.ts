import { defineNuxtModule, createResolver, addPlugin } from '@nuxt/kit';

export interface ModuleOptions {
  googleGtmTrackingId?: string;
  enableGoogleGtm?: boolean;
  enableGoogleAds?: boolean;
  enableCytGA?: boolean;
  googleAdsCookiesToRegister?: string | string[];
  registerAdsCookieAsOptOut?: boolean;
  googleGtmCookiesToRegister?: string | string[];
  registerGtmCookieAsOptOut?: boolean;
  googleCytGACookiesToRegister?: string | string[];
  registerCytGACookieAsOptOut?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'tracking',
    configKey: 'tracking',
  },
  defaults: {
    enableGoogleGtm: true,
    enableGoogleAds: false,
    enableCytGA: false,
    googleAdsCookiesToRegister: '',
    registerAdsCookieAsOptOut: false,
    googleGtmCookiesToRegister: '',
    registerGtmCookieAsOptOut: false,
    googleCytGACookiesToRegister: '',
    registerCytGACookieAsOptOut: false,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // RuntimeConfig initialisieren
    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {};
    const publicConfig = nuxt.options.runtimeConfig.public;

    // Optionen an runtimeConfig.public übergeben
    publicConfig.googleGtmTrackingId =
      publicConfig.googleGtmTrackingId ?? options.googleGtmTrackingId;
    publicConfig.enableGoogleGtm =
      publicConfig.enableGoogleGtm ?? options.enableGoogleGtm;
    publicConfig.enableGoogleAds =
      publicConfig.enableGoogleAds ?? options.enableGoogleAds;
    publicConfig.enableCytGA =
      publicConfig.enableCytGA ?? options.enableCytGA;
    publicConfig.googleAdsCookiesToRegister =
      publicConfig.googleAdsCookiesToRegister ?? options.googleAdsCookiesToRegister;
    publicConfig.registerAdsCookieAsOptOut =
      publicConfig.registerAdsCookieAsOptOut ?? options.registerAdsCookieAsOptOut;
    publicConfig.googleGtmCookiesToRegister =
      publicConfig.googleGtmCookiesToRegister ?? options.googleGtmCookiesToRegister;
    publicConfig.registerGtmCookieAsOptOut =
      publicConfig.registerGtmCookieAsOptOut ?? options.registerGtmCookieAsOptOut;
    publicConfig.googleCytGACookiesToRegister =
      publicConfig.googleCytGACookiesToRegister ?? options.googleCytGACookiesToRegister;
    publicConfig.registerCytGACookieAsOptOut =
      publicConfig.registerCytGACookieAsOptOut ?? options.registerCytGACookieAsOptOut;

    // Restliche Logik (i18n, noscript, plugins)...
  },
});
