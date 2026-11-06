<template>
  <div class="whitespace-nowrap mb-5 rounded-lg p-3 overflow-hidden">
    <p class="font-semibold mb-3">{{ t("itemAvailabilityNotification.frontend.formHintText") }}</p>
    <form class="space-y-4" :aria-label="t('itemAvailabilityNotification.frontend.formLabel')" @submit.prevent="submit">
        <div>
          <label for="email" class="block text-sm font-medium text-neutral-900 mb-2">
            {{ t('itemAvailabilityNotification.frontend.emailLabel') }}
          </label>
          <SfInput
            id="email"
            v-model="email"
            type="email"
            :placeholder="t('itemAvailabilityNotification.frontend.emailPlaceHolder')"
            required
            class="w-full"
            :disabled="isLoading"
            @focus="formInteraction"
          />
        </div>

        <div v-if="showPrivacyPolicy" class="flex items-start gap-2">
          <SfCheckbox
            id="privacy-policy"
            v-model="agreedToPolicy"
            :disabled="isLoading"
            :required="!readOnlyPrivacyPolicy"
            :hidden="readOnlyPrivacyPolicy"
            @change="formInteraction"
          />
          <label for="privacy-policy" class="text-sm text-neutral-700">
            <i18n-t v-if="!readOnlyPrivacyPolicy" keypath="itemAvailabilityNotification.frontend.readAndAccepted" tag="span">
              <template #privacyPolicy>
                <NuxtLink
                  :to="localePath(paths.privacyPolicy)"
                  class="text-primary-700 underline"
                  target="_blank"
                  :aria-label="t('itemAvailabilityNotification.frontend.privacyPolicyLink')"
                >
                  {{ t('legal.privacyPolicy')}}
                </NuxtLink>
              </template>
            </i18n-t>
            <i18n-t v-else keypath="itemAvailabilityNotification.frontend.privacyHintText" tag="span">
              <template #privacyPolicy>
                <NuxtLink
                  :to="localePath(paths.privacyPolicy)"
                  class="text-primary-700 underline"
                  target="_blank"
                  :aria-label="t('itemAvailabilityNotification.frontend.privacyPolicyLink')"
                >
                  {{ t('legal.privacyPolicy')}}
                </NuxtLink>
              </template>
            </i18n-t>
          </label>
        </div>

        <NuxtTurnstile
          v-if="turnstileSiteKey && (email.length > 0 || turnstileLoad)"
          ref="turnstileElement"
          v-model="turnstileToken"
          :site-key="turnstileSiteKey"
          :options="{ theme: 'light' }"
          class="flex justify-center"
          :aria-label="t('itemAvailabilityNotification.frontend.securityVerification')"
        />

        <UiButton
          type="submit"
          size="lg"
          class="w-full"
          :disabled="!email || submitDisabled"
          :aria-busy="isLoading"
          :aria-label="t('itemAvailabilityNotification.frontend.subscribeButton')"
        >
          <template v-if="isLoading" #prefix>
            <SfLoaderCircular size="sm" aria-hidden="true" />
          </template>
          <template v-else #prefix>
            <SfIconEmail size="sm" aria-hidden="true" />
          </template>
          {{ t('itemAvailabilityNotification.frontend.submitLabel') }}
        </UiButton>
      </form>
  </div>
</template>

<script setup lang="ts">
import {
  SfIconEmail,
  SfInput,
  SfCheckbox,
  SfLoaderCircular,
} from '@storefront-ui/vue';
import { productGetters, type Product } from '@plentymarkets/shop-api';
import type { ConditionType } from './types';

const props = withDefaults(defineProps<{
    visibility?: ConditionType;
    comparison?: ConditionType;
    showPrivacyPolicy?: boolean;
    readOnlyPrivacyPolicy?: boolean;
    product?: Product;
}>(), {
  visibility: () => ({ field: 'availability', operator: 'gt', value: 6 }),
  comparison: () => ({ field: 'availability', operator: 'lte', value: 2 }),
  showPrivacyPolicy: true,
  readOnlyPrivacyPolicy: true,
  product: undefined,
});

const { subscribe } = useItemAvailabilityNotification();
const { currentProduct } = useProducts();
const { isEditMode } = useEditorState()

const { user } = useCustomer();
const { getSetting } = useSiteSettings('cloudflareTurnstileApiSiteKey');
const { send } = useNotification();
const localePath = useLocalizedPath();

const turnstileSiteKey = getSetting() ?? '';

const email = ref(user.value?.email || user.value?.guestMail || '');
const agreedToPolicy = ref(false);
const turnstileLoad = ref(false);
const turnstileToken = ref('');
const isLoading = ref(false);

const formInteraction = () => {
  if (!turnstileLoad.value) {
    turnstileLoad.value = true;
  }
};

const submitDisabled = computed(() => {
  return isLoading.value || (props.showPrivacyPolicy && !props.readOnlyPrivacyPolicy && !agreedToPolicy.value);
});

const product = computed(() => props.product || currentProduct.value);

const productName = productGetters.getName(product.value);
const productAvailabilityId = productGetters.getAvailabilityId(product.value);
const productItemId = productGetters.getItemId(product.value);
const productVariationId = productGetters.getVariationId(product.value);
const productPreviewImage = productGetters.getPreviewImage(product.value);
const productVariation = productGetters.getVariariationById(product.value, productVariationId);

const getCurrentValueForCondition = (condition: ConditionType) =>{
    if (condition.field === 'availability') {
        return productAvailabilityId;
    } else {
        return 0;
    }
};

const getComparisonValue = (condition: ConditionType) => {
    return condition.value === -1 ? getCurrentValueForCondition(condition) : condition.value;
};

const isVisible = computed(() => {
    if (isEditMode.value) {
        return true;
    }

    const currentValue = getCurrentValueForCondition(props.visibility);
    const comparisonValue = getComparisonValue(props.visibility);

    switch (props.visibility.operator) {
        case 'eq':
            return currentValue === comparisonValue;
        case 'gt':
            return currentValue > comparisonValue;
        case 'gte':
            return currentValue >= comparisonValue;
        case 'lt':
            return currentValue < comparisonValue;
        case 'lte':
            return currentValue <= comparisonValue;
        default:
            return currentValue === comparisonValue;
    }
});

const isValid = () => {
    const mailRegEx = new RegExp(/^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return mailRegEx.test(email.value);
};

const submit = async () => {
    if (turnstileSiteKey && !turnstileToken.value) {
        send({
            type: 'negative',
            message: t('itemAvailabilityNotification.turnstileFailed'),
        });
        return;
    }

    if (!!productVariation && isValid() && !isLoading.value) {
        isLoading.value = true;
        try {
            const { error } = await subscribe({
                mail: email.value,
                articleId: productItemId,
                variationId: productVariationId,
                name: productName,
                image: productPreviewImage ?? '',
                comparisonField: props.comparison.field,
                comparisonType: props.comparison.operator,
                comparisonValue: getComparisonValue(props.comparison),
            });
            if (error) {
                send({
                    type: 'negative',
                    message: t('itemAvailabilityNotification.frontend.subscriptionFailed'),
                });
                return;
            }
            email.value = '';
            agreedToPolicy.value = false;
            send({
                type: 'positive',
                message: t('itemAvailabilityNotification.frontend.subscriptionSucceed'),
            });
        } catch {
            send({
                type: 'negative',
                message: t('itemAvailabilityNotification.frontend.subscriptionFailed'),
            });
        } finally {
            isLoading.value = false;
        }
    }
};

if (turnstileSiteKey.length > 0) {
  const turnstileWatcher = watch([email], (data) => {
    if (data.some((field) => field && field.length > 0)) {
      turnstileLoad.value = true;
      turnstileWatcher();
    }
  });
}
</script>
