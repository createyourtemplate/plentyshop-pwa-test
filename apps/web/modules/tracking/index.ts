import { defineNuxtModule, createResolver, addPlugin } from '@nuxt/kit';

export interface ModuleOptions {
  googleGtmTrackingId?: string;
  enableGoogleGtm?: boolean;
  enableGoogleAds?: boolean;
  // weitere Optionen...
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'tracking',
    configKey: 'tracking',
  },
  defaults: {
    enableGoogleGtm: false,
    enableGoogleAds: false,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // 1. i18n Integration
    nuxt.hook('i18n:registerModule', (register: (config: object) => void) => {
      register({
        langDir: resolve('./runtime/lang'),
        locales: [
          { code: 'de', file: 'de.json' },
          { code: 'en', file: 'en.json' },
        ],
      });
    });

    // 2. RuntimeConfig Defaults setzen (automatisch durch NUXT_PUBLIC_* überschreibbar)
    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {};
    const publicConfig = nuxt.options.runtimeConfig.public;

    publicConfig.googleGtmTrackingId = publicConfig.googleGtmTrackingId || options.googleGtmTrackingId || '';
    publicConfig.enableGoogleGtm = publicConfig.enableGoogleGtm ?? options.enableGoogleGtm;

    // Cookie Groups sauber initialisieren
    publicConfig.cookieGroups = publicConfig.cookieGroups || { groups: [] };
    const groups = (publicConfig.cookieGroups as { groups: unknown[] }).groups;

    groups.push({
      id: groups.length,
      name: 'Cyt.cookieBar.statistics.label',
      showMore: false,
      description: 'Cyt.cookieBar.statistics.description',
      cookies: [],
    });

    // 3. GTM Noscript sauber einbinden
    nuxt.options.app.head = nuxt.options.app.head || {};
    nuxt.options.app.head.noscript = nuxt.options.app.head.noscript || [];
    
    if (publicConfig.googleGtmTrackingId) {
      nuxt.options.app.head.noscript.push({
        innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${publicConfig.googleGtmTrackingId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        tagPosition: 'bodyOpen',
      });
    }

    // 4. Plugins über addPlugin registrieren
    addPlugin({
      src: resolve('./runtime/plugins/gtm-init.server'),
      mode: 'server',
    });
    addPlugin({
      src: resolve('./runtime/plugins/gtm-consent.server'),
      mode: 'server',
    });
  },
});
