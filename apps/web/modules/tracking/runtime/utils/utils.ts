import type { AddressOption } from "@plentymarkets/shop-api";

export const toBool = (val?: string | boolean): boolean => {
  return val === '1' || val === 'true' || val === true;
}

export const findPhoneOptionValue = (options: AddressOption[]|undefined):string => options?.find((option) => option.typeId === 4)?.value || '';

export const getCountryName = (countryId: number|undefined):string => {
  const { data: shippingCountries } = useActiveShippingCountries();

  return shippingCountries.value.find((c) => c.id === countryId)?.currLangName ?? '';
}
