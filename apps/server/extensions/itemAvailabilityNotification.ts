export type ItemAvailabilityNotificationParams = {
  mail: string;
  articleId: number | string;
  variationId: number | string;
  name: string;
  image: string;
  comparisonField: string;
  comparisonType: string;
  comparisonValue: number | string;
};

export type ItemAvailabilityNotificationConfirmParams = {
  subscription: string;
  hash: string;
};

export const itemAvailabilityNotificationExtension = {
  name: 'itemAvailabilityNotification',
  extendApiMethods: {
    subscribeItemAvailabilityNotification: async (
      context: any,
      params: ItemAvailabilityNotificationParams,
    ) => {
      const url = new URL('/rest/cyt/item_availability', context.config.api.url as string);
      const { data } = await context.client.post(url.href, params, {
        headers: { cookie: context.req?.headers?.cookie || '' },
      });
      return { data };
    },
    confirmItemAvailabilityNotification: async (
      context: any,
      params: ItemAvailabilityNotificationConfirmParams,
    ) => {
      const url = new URL('/rest/cyt/item_availability/confirm', context.config.api.url as string);
      const { data } = await context.client.post(url.href, params, {
        headers: { cookie: context.req?.headers?.cookie || '' },
      });
      return { data };
    },
  },
};
