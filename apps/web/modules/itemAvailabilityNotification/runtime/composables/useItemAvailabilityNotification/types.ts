import type { Endpoints } from '@plentymarkets/shop-api';

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

export type ItemAvailabilityNotificationRecord = {
  id: number;
  hash: string;
  variationId: number;
  variationNumber: string;
  articleId: number;
  name: string;
  image: string;
  mail: string;
  lang: string;
  plentyId: number;
  props: string;
  comparisonField: string;
  comparisonType: string;
  comparisonValue: number;
  createdAt: string;
  expiresAt: string;
};

export type ItemAvailabilityNotificationResponse = {
  data?: ItemAvailabilityNotificationRecord;
};

export type ItemAvailabilityNotificationConfirmResponse = {
  data?: { result: boolean };
};

export interface ItemAvailabilityNotificationEndpoints extends Endpoints {
  subscribeItemAvailabilityNotification: (
    params: ItemAvailabilityNotificationParams,
  ) => Promise<ItemAvailabilityNotificationResponse>;
  confirmItemAvailabilityNotification: (
    params: ItemAvailabilityNotificationConfirmParams,
  ) => Promise<ItemAvailabilityNotificationConfirmResponse>;
}
