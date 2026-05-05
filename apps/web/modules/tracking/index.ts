import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'tracking',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);
    addPlugin({ src: resolver.resolve('./runtime/gtm.plugin'), mode: 'server' });

    nuxt.options.app.head.script = nuxt.options.app.head.script ?? [];
    nuxt.options.app.head.script.push({
      innerHTML: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NUXT_PUBLIC_GOOGLE_ANALITICS_TRACKING_ID}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
      tagPosition: 'bodyOpen',
    });
  },
});
