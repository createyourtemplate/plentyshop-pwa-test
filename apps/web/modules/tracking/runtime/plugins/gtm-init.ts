import { AddressOption, cartGetters, orderGetters } from '@plentymarkets/shop-api'
import { findPhoneOptionValue, getCountryName } from '../utils/utils';

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
      const stats = groups['Cyt.cookieBar.statistics.label'] || {};
      if (stats['Google Analytics'] === true) {
        gaStatus = 'granted';
      }

      // Google Ads prüfen
      const marketing = groups['CookieBar.marketing.label'] || {};
      if (marketing['Google Ads Conversion Messung und dynamisches Remarketing'] === true) {
        adsStatus = 'granted';
      }
    } catch (e) {
      // Fallback bleibt 'denied'
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
        tagPriority: 'critical', // Stellt sicher, dass es VOR dem GTM ausgeführt wird
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

  const { on } = usePlentyEvent();
  
  on('frontend:orderCreated', (order) => {
    if (gaStatus === 'granted' && order.order && order.totals) {
      const billingAddress = computed(() => orderGetters.getBillingAddress(order));
      const customerPhone = findPhoneOptionValue(billingAddress.value?.options);
      const totalVat = order.totals.vats.reduce((acc: number, vat: { value: number }) => acc + vat.value, 0)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'purchase',
        'ecommerce': {
          transaction_id: orderGetters.getId(order),
          value: order.totals.totalGross,
          currency: order.totals.currency,
          tax: totalVat,
          shipping: order.totals.shippingGross,
          items: order.order.orderItems.map((item) => ({
            item_id: orderGetters.getItemVariationId(item),
            item_name: orderGetters.getItemName(item),
            quantity: orderGetters.getItemQty(item),
            affiliation: item.referrerId.toString(),
          }))
        },
        'customer_info': {
          firstname: billingAddress.value?.name2,
          lastname: billingAddress.value?.name3,
          street: `${ billingAddress.value?.address1 } ${ billingAddress.value?.address2 }`,
          phone: customerPhone,
          email: orderGetters.getOrderEmail(order),
          zip: billingAddress.value?.postalCode,
          city: billingAddress.value?.town,
          country: getCountryName(billingAddress.value?.countryId),
        }
      })
    }
  })
});
