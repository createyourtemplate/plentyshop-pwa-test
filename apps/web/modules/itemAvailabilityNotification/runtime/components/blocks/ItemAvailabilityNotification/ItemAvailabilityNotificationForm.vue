<template>
  <EditorFormPanel
    :title="t('itemAvailabilityNotification.widget.widgetLabel')"
    data-testid="item-availability-notification-label"
  >
    <div class="mb-4">
      <UiFormLabel class="mb-2">{{ t('itemAvailabilityNotification.widget.customClass') }}</UiFormLabel>
      <SfInput v-model="itemAvailabilityNotificationSettings.customClass" type="text" placeholder="Eigene Klasse" />
    </div>

    <hr class="my-4" />
    <p class="text-sm font-semibold mb-3">{{ t('itemAvailabilityNotification.widget.formVisibilityTypeLabel') }}</p>

    <div class="mb-4">
      <SfSelect v-model="itemAvailabilityNotificationSettings.visibility.field" disabled>
        <option value="availability">{{ t('itemAvailabilityNotification.widget.conditionTypeAvailability') }}</option>
      </SfSelect>
    </div>

    <div class="mb-4">
      <SfSelect v-model="itemAvailabilityNotificationSettings.visibility.operator">
        <option value="eq">{{ t('itemAvailabilityNotification.widget.conditionComparisonEQ') }}</option>
        <option value="gt">{{ t('itemAvailabilityNotification.widget.conditionComparisonGT') }}</option>
        <option value="gte">{{ t('itemAvailabilityNotification.widget.conditionComparisonGTE') }}</option>
        <option value="lt">{{ t('itemAvailabilityNotification.widget.conditionComparisonLT') }}</option>
        <option value="lte">{{ t('itemAvailabilityNotification.widget.conditionComparisonLTE') }}</option>
      </SfSelect>
    </div>

    <div class="mb-4">
      <SfSelect v-model="itemAvailabilityNotificationSettings.visibility.compareTo">
        <option value="value">{{ t('itemAvailabilityNotification.widget.conditionCompareToValueLabel') }}</option>
        <option value="current">{{ t('itemAvailabilityNotification.widget.conditionCompareToCurrentLabel') }}</option>
      </SfSelect>
    </div>

    <div v-if="itemAvailabilityNotificationSettings.visibility.compareTo === 'value'" class="mb-4">
      <UiFormLabel class="mb-2">{{ t('itemAvailabilityNotification.widget.conditionCompareToLabel') }}</UiFormLabel>
      <SfInput
        v-model.number="itemAvailabilityNotificationSettings.visibility.value"
        type="number"
        min="0"
        placeholder="2"
      />
    </div>

    <hr class="my-4" />
    <p class="text-sm font-semibold mb-3">{{ t('itemAvailabilityNotification.widget.sendMailTypeLabel') }}</p>

    <div class="mb-4">
      <SfSelect v-model="itemAvailabilityNotificationSettings.comparison.field" disabled>
        <option value="availability">{{ t('itemAvailabilityNotification.widget.conditionTypeAvailability') }}</option>
      </SfSelect>
    </div>

    <div class="mb-4">
      <SfSelect v-model="itemAvailabilityNotificationSettings.comparison.operator">
        <option value="eq">{{ t('itemAvailabilityNotification.widget.conditionComparisonEQ') }}</option>
        <option value="gt">{{ t('itemAvailabilityNotification.widget.conditionComparisonGT') }}</option>
        <option value="gte">{{ t('itemAvailabilityNotification.widget.conditionComparisonGTE') }}</option>
        <option value="lt">{{ t('itemAvailabilityNotification.widget.conditionComparisonLT') }}</option>
        <option value="lte">{{ t('itemAvailabilityNotification.widget.conditionComparisonLTE') }}</option>
      </SfSelect>
    </div>

    <div class="mb-4">
      <SfSelect v-model="itemAvailabilityNotificationSettings.comparison.compareTo">
        <option value="value">{{ t('itemAvailabilityNotification.widget.conditionCompareToValueLabel') }}</option>
        <option value="current">{{ t('itemAvailabilityNotification.widget.conditionCompareToCurrentLabel') }}</option>
      </SfSelect>
    </div>

    <div v-if="itemAvailabilityNotificationSettings.comparison.compareTo === 'value'" class="mb-4">
      <UiFormLabel class="mb-2">{{ t('itemAvailabilityNotification.widget.conditionCompareToLabel') }}</UiFormLabel>
      <SfInput
        v-model.number="itemAvailabilityNotificationSettings.comparison.value"
        type="number"
        min="0"
        placeholder="2"
      />
    </div>

    <hr class="my-4" />

    <div class="py-2 flex items-center justify-between gap-3">
      <UiFormLabel for="show-privacy-policy" class="m-0">
        {{ t('itemAvailabilityNotification.widget.showPrivacyHintLabel') }}
      </UiFormLabel>
      <SfSwitch
        id="show-privacy-policy"
        v-model="itemAvailabilityNotificationSettings.showPrivacyPolicy"
      />
    </div>

    <div
      v-if="itemAvailabilityNotificationSettings.showPrivacyPolicy"
      class="py-2 flex items-center justify-between gap-3">
      <UiFormLabel for="read-only-privacy-policy" class="m-0">
        {{ t('itemAvailabilityNotification.widget.requirePrivacyHintLabel') }}
      </UiFormLabel>
      <SfSwitch
        id="read-only-privacy-policy"
        v-model="itemAvailabilityNotificationSettings.readOnlyPrivacyPolicy"
      />
    </div>
  </EditorFormPanel>
</template>
<script setup lang="ts">
import {
  SfInput,
  SfSelect,
  SfSwitch,
} from '@storefront-ui/vue';
import type { ItemAvailabilityNotificationFormProps, ItemAvailabilityNotificationSettings } from './types';

const props = defineProps<ItemAvailabilityNotificationFormProps>();

const { allBlocks: data } = useBlocks();

const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const DEFAULT_SETTINGS: ItemAvailabilityNotificationSettings = {
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
};

const itemAvailabilityNotificationSettings = computed<ItemAvailabilityNotificationSettings>(() => {
  const block = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value);
  if (!block) {
    return { ...DEFAULT_SETTINGS };
  }

  const rawContent = block.content as Partial<ItemAvailabilityNotificationSettings> & { content?: Partial<ItemAvailabilityNotificationSettings> };
  const source = rawContent.content && typeof rawContent.content === 'object' ? rawContent.content : rawContent;

  const normalized: ItemAvailabilityNotificationSettings = {
    customClass: source.customClass ?? DEFAULT_SETTINGS.customClass,
    visibility: source.visibility ?? DEFAULT_SETTINGS.visibility,
    comparison: source.comparison ?? DEFAULT_SETTINGS.comparison,
    showPrivacyPolicy: source.showPrivacyPolicy ?? DEFAULT_SETTINGS.showPrivacyPolicy,
    readOnlyPrivacyPolicy: source.readOnlyPrivacyPolicy ?? DEFAULT_SETTINGS.readOnlyPrivacyPolicy,
  };

  block.content = normalized;

  return block.content as ItemAvailabilityNotificationSettings;
});
</script>
