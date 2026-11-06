<template>
    <div :class="settings.customClass">
        <ItemAvailabilityNotification
            :visibility="settings.visibility"
            :comparison="settings.comparison"
            :show-privacy-policy="settings.showPrivacyPolicy"
            :read-only-privacy-policy="settings.readOnlyPrivacyPolicy"
        />
    </div>
</template>

<script setup lang="ts">
import type { ItemAvailabilityNotificationBlockProps, ItemAvailabilityNotificationSettings } from './types';

const props = defineProps<ItemAvailabilityNotificationBlockProps>();

const DEFAULT_SETTINGS: ItemAvailabilityNotificationSettings = {
    customClass: '',
    visibility: { field: 'availability', operator: 'gt', value: 6, compareTo: 'value' },
    comparison: { field: 'availability', operator: 'lte', value: 2, compareTo: 'value' },
    showPrivacyPolicy: true,
    readOnlyPrivacyPolicy: false,
};

const resolveSource = (): Partial<ItemAvailabilityNotificationSettings> => {
    const raw = props.content as unknown;

    if (raw && typeof raw === 'object' && 'content' in raw) {
        const nested = (raw as { content?: unknown }).content;
        if (nested && typeof nested === 'object') {
            return nested as Partial<ItemAvailabilityNotificationSettings>;
        }
    }

    return (raw as Partial<ItemAvailabilityNotificationSettings>) || {};
};

const settings = computed<ItemAvailabilityNotificationSettings>(() => {
    const source = resolveSource();

    const data = {
        customClass: source.customClass ?? DEFAULT_SETTINGS.customClass,
        visibility: source.visibility ?? DEFAULT_SETTINGS.visibility,
        comparison: source.comparison ?? DEFAULT_SETTINGS.comparison,
        showPrivacyPolicy: source.showPrivacyPolicy ?? DEFAULT_SETTINGS.showPrivacyPolicy,
        readOnlyPrivacyPolicy: source.readOnlyPrivacyPolicy ?? DEFAULT_SETTINGS.readOnlyPrivacyPolicy,
    };

    if (data.visibility.compareTo && data.visibility.compareTo !== 'value') {
        data.visibility.value = -1;
    } else {
        data.visibility.value = data.visibility.value < 0 ? 6 : data.visibility.value;
    }

    if (data.comparison.compareTo && data.comparison.compareTo !== 'value') {
        data.comparison.value = -1;
    } else {
        data.comparison.value = data.comparison.value < 0 ? 2 : data.comparison.value;
    }

    return data;
});
</script>