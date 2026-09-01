import type { AddressOption } from "@plentymarkets/shop-api";

/**
 * Wandelt Strings/Booleans/Numbers sicher in einen boolean um.
 */
export const toBool = (val?: string | boolean | number | null): boolean => {
  return val === '1' || val === 'true' || val === true || val === 1;
};

/**
 * Liest die Telefonnummer (typeId: 4) sicher aus den Adress-Optionen aus.
 */
export const findPhoneOptionValue = (options?: AddressOption[]): string => {
  return options?.find((option) => option.typeId === 4)?.value ?? '';
};

/**
 * Ermittelt den Ländernamen anhand der countryId.
 * Verhindert Abstürze durch Optional Chaining und Try/Catch bei Composable-Aufrufen.
 */
export const getCountryName = (
  countryId: number | undefined,
  countriesList?: Array<{ id: number; currLangName?: string }>
): string => {
  if (!countryId) {
    return '';
  }

  // 1. Wenn Länderliste bereits vorliegt, diese bevorzugt verwenden
  if (countriesList && Array.isArray(countriesList)) {
    return countriesList.find((c) => c.id === countryId)?.currLangName ?? '';
  }

  // 2. Composable sicher mit Fallback abrufen
  try {
    const { data: shippingCountries } = useActiveShippingCountries();
    return shippingCountries.value?.find((c) => c.id === countryId)?.currLangName ?? '';
  } catch (e) {
    // Falls das Composable außerhalb des Nuxt-Kontexts aufgerufen wird
    return '';
  }
};
