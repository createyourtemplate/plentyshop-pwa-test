import { AddressOption, cartGetters, orderGetters } from '@plentymarkets/shop-api';
import { findPhoneOptionValue, getCountryName } from '../utils/utils';

export default defineNuxtPlugin(() => {
  const { public: { googleGtmTrackingId } } = useRuntimeConfig();

  // ==========================================
  // 1. SERVER-SIDE: Consent Default & GTM Head
  // ==========================================
  if (import.meta.server) {
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
        if (groups['CookieBar.marketing.label']?.['Google Ads Conversion Messung und dynamisches Remarketing'] === true) {
          adsStatus = 'granted';
        }
      } catch (e) {
        // Fallback bleibt 'denied'
      }
    }

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
  }

  // ==========================================
  // 2. CLIENT-SIDE: Ecommerce / Purchase Event
  // ==========================================
  if (import.meta.client) {
    const { on } = usePlentyEvent();

    on('frontend:orderCreated', (order: any) => {
      if (order?.order && order?.totals) {
        const billingAddress = orderGetters.getBillingAddress(order);
        const customerPhone = findPhoneOptionValue(billingAddress?.options);
        const totalVat = order.totals.vats?.reduce((acc: number, vat: { value: number }) => acc + vat.value, 0) || 0;

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: orderGetters.getId(order),
            value: order.totals.totalGross,
            currency: order.totals.currency,
            tax: totalVat,
            shipping: order.totals.shippingGross,
            items: order.order.orderItems?.map((item: any) => ({
              item_id: orderGetters.getItemVariationId(item),
              item_name: orderGetters.getItemName(item),
              quantity: orderGetters.getItemQty(item),
              affiliation: item.referrerId?.toString(),
            })) || [],
          },
          customer_info: {
            firstname: billingAddress?.name2,
            lastname: billingAddress?.name3,
            street: `${billingAddress?.address1 || ''} ${billingAddress?.address2 || ''}`.trim(),
            phone: customerPhone,
            email: orderGetters.getOrderEmail(order),
            zip: billingAddress?.postalCode,
            city: billingAddress?.town,
            country: getCountryName(billingAddress?.countryId),
          },
        });
      }
    });
  }
});
