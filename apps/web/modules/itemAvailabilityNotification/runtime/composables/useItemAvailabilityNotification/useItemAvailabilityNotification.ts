import type {
  ItemAvailabilityNotificationConfirmParams,
  ItemAvailabilityNotificationEndpoints,
  ItemAvailabilityNotificationParams,
  ItemAvailabilityNotificationRecord,
} from './types';

export const useItemAvailabilityNotification = () => {
  const subscribe = async (
    params: ItemAvailabilityNotificationParams,
  ): Promise<{ data: ItemAvailabilityNotificationRecord | undefined; error: unknown }> => {
    const sdk = useSdk().plentysystems as unknown as ItemAvailabilityNotificationEndpoints;
    try {
      const response = await sdk.subscribeItemAvailabilityNotification(params);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: undefined, error };
    }
  };

  const confirm = async (params: ItemAvailabilityNotificationConfirmParams): Promise<boolean> => {
    const sdk = useSdk().plentysystems as unknown as ItemAvailabilityNotificationEndpoints;
    try {
      const response = await sdk.confirmItemAvailabilityNotification(params);
      return !!response.data?.result;
    } catch {
      return false;
    }
  };

  return { subscribe, confirm };
};
