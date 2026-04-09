import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'tracking',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);
    addPlugin(resolver.resolve('./runtime/gtm.plugin'));

    nuxt.options.app.head.script = nuxt.options.app.head.script ?? [];
    nuxt.options.app.head.script.push({
      innerHTML: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KG7DWQ4M"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
      tagPosition: 'bodyOpen',
    });
  },
});
