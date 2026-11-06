import type { ConditionType } from "../../ItemAvailabilityNotification/types";

export interface ItemAvailabilityNotificationSettings {
  customClass: string;
  visibility: ConditionType;
  comparison: ConditionType;
  showPrivacyPolicy: boolean;
  readOnlyPrivacyPolicy: boolean;
}

export type ItemAvailabilityNotificationContent = ItemAvailabilityNotificationSettings;

export interface ItemAvailabilityNotificationLegacyContent {
  content: Partial<ItemAvailabilityNotificationSettings>;
}

export type ItemAvailabilityNotificationBlockPayload = Partial<ItemAvailabilityNotificationSettings>;

export interface ItemAvailabilityNotificationBlockProps {
  content: Record<string, unknown>;
}

export interface ItemAvailabilityNotificationFormProps {
  uuid?: string;
}
