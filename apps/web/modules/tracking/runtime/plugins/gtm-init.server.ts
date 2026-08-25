export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    return;
  }

  const { public: { googleGtmTrackingId } } = useRuntimeConfig();

  // 1. Consent-Cookie serverseitig lesen
  const rawCookie = useCookie<string | Record<string, any> | null>('consent-cookie').value;

  let gaStatus = 'denied';
  let adsStatus = 'denied';

  if (rawCookie) {
    try {
      const consent = typeof rawCookie === 'string' ? JSON.parse(decodeURIComponent(rawCookie)) : rawCookie;
      const groups = consent?.groups || {};

      // Google Analytics prüfen
      if (groups['Cyt.cookieBar.statistics.label']?.['Google Analytics'] === true) {
        gaStatus = 'granted';
      }

      // Google Ads prüfen
      if (groups['Cyt.cookieBar.marketing.label']?.['Google Ads Conversion Messung und dynamisches Remarketing'] === true) {
        adsStatus = 'granted';
      }
    } catch (e) {
      // Fallback bleibt denied
    }
  }

  // 2. Consent Default Script + GTM Container rendern
  useHead({
    script: [
      {
        type: 'text/javascript',
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': '${adsStatus}',
            'ad_user_data': '${adsStatus}',
            'ad_personalization': '${adsStatus}',
            'analytics_storage': '${gaStatus}',
            'personalization_storage': 'granted',
            'functionality_storage': 'granted',
            'security_storage': 'granted',
            'wait_for_update': 500
          });
        `,
        tagPosition: 'bodyOpen',
        tagPriority: 'critical',
        id: 'gtm-consent-default',
      },
      {
        type: 'text/javascript',
        innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer', '${googleGtmTrackingId}');`,
        tagPosition: 'bodyOpen',
        tagPriority: 'low',
        id: 'gtm',
      },
    ],
  });
});
