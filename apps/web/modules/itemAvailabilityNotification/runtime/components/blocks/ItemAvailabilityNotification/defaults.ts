import { v4 as uuid } from 'uuid';
import type { BlocksList } from '~/composables/useBlocksList/types';
import type { ItemAvailabilityNotificationSettings } from './types';

export const createDefault = (index: number): { content: ItemAvailabilityNotificationSettings } => ({
  content: {
    customClass: '',
    visibility: {
      field: 'availability',
      operator: 'eq',
      compareTo: 'value',
      value: 6,
    },
    comparison: {
      field: 'availability',
      operator: 'lt',
      compareTo: 'value',
      value: 2,
    },
    showPrivacyPolicy: true,
    readOnlyPrivacyPolicy: false
  },
});

export const getBlocksList = (): BlocksList => ({
  item_availability_notification: {
    category: 'item_availability_notification',
    accessControl: ['product'],
    title: 'Cyt - Item Availability Notification',
    blockName: 'ItemAvailabilityNotification',
    variations: [
      {
        title: 'Cyt - Item Availability Notification',
        image: 'https://placehold.co/300x175',
        template: {
          en: {
            type: 'content',
            name: 'ItemAvailabilityNotification',
            meta: {
              uuid: uuid(),
              isGlobalTemplate: false,
            },
            ...createDefault(0),
          },
          de: {
            type: 'content',
            name: 'ItemAvailabilityNotification',
            meta: {
              uuid: uuid(),
              isGlobalTemplate: false,
            },
            ...createDefault(0),
          },
        },
      },
    ],
  },
});
