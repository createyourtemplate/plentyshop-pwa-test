export default defineNuxtPlugin({
  name: 'gtm-consent',
  parallel: true,
  setup() {
    const { add } = useRegisterCookie();

    add({
        name: 'Meins',
        Provider: 'Meins',
        Status: 'Meins',
        PrivacyPolicy: 'https://policies.google.com/privacy',
        Lifespan: 'Session',
        cookieNames: ['/^_ga/', '_ga', '_gid', '_gat'],
        accepted: true
    }, 'essentials');
  },
});
