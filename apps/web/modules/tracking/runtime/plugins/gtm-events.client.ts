import { orderGetters } from '@plentymarkets/shop-api';
import { findPhoneOptionValue, getCountryName } from '../utils/utils';

export default defineNuxtPlugin(() => {
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
});
