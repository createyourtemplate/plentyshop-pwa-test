import {
  addComponent,
  addImports,
  addImportsDir,
  addRouteMiddleware,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'itemAvailabilityNotification',
  },
  setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    nuxt.options.plugins.push(resolve('./runtime/plugins/block-layout-config'));

    addRouteMiddleware({
      name: 'itemAvailabilityNotification',
      path: resolve('./runtime/middleware/itemAvailabilityNotification.client'),
      global: true,
    });

    addImportsDir(resolve('./runtime/composables'));

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.publicAssets = nitroConfig.publicAssets || [];
      nitroConfig.publicAssets.push({
        dir: resolve('./runtime/public'),
      });
    });

    nuxt.hook('i18n:registerModule', (register) => {
      register({
        langDir: resolve('./runtime/lang'),
        locales: [
          { code: 'de', file: 'de.json' },
          { code: 'en', file: 'en.json' },
          { code: 'fr', file: 'fr.json' },
          { code: 'it', file: 'it.json' },
        ],
      });
    });

    addImports({
      name: 'useItemAvailabilityNotification',
      from: resolve('./runtime/composables/useItemAvailabilityNotification/useItemAvailabilityNotification'),
    });

    addComponent({
        name: "itemAvailabilityNotification",
        filePath: resolve("./runtime/components/ItemAvailabilityNotification/ItemAvailabilityNotification.vue"),
    });
  }
});