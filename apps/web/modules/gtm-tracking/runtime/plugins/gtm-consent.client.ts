export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public as any;
  const isGtmEnabled = config.enableGoogleGtm === true || config.enableGoogleGtm === 'true';
  const trackingId = (config.googleGtmTrackingId as string)?.trim();

  // 1. Nur ausführen, wenn GTM aktiv ist und eine ID existiert
  if (!isGtmEnabled || !trackingId) {
    return;
  }

  // Helper-Funktion zum sprach- und gruppenunabhängigen Prüfen von Consents
  const isServiceConsentGranted = (
    groups: Record<string, any>,
    configuredGroupKey: string | undefined,
    fallbackGroupKeys: string[],
    serviceKeywords: string[]
  ): boolean => {
    const candidateKeys = [configuredGroupKey, ...fallbackGroupKeys].filter(Boolean) as string[];

    for (const key of candidateKeys) {
      const group = groups[key];
      if (!group) continue;

      if (group === true) {
        return true;
      }

      if (typeof group === 'object') {
        for (const [cookieName, isGranted] of Object.entries(group)) {
          if (isGranted === true) {
            const lowerName = cookieName.toLowerCase();
            if (serviceKeywords.some((kw) => lowerName.includes(kw.toLowerCase()))) {
              return true;
            }
          }
        }

        if (Object.values(group).some((val) => val === true)) {
          return true;
        }
      }
    }

    return false;
  };

  // Auswertung und Senden des Google Consent Mode Updates
  const updateGtmConsent = (cookieVal: any) => {
    let gaGranted = false;
    let adsGranted = false;

    if (cookieVal) {
      try {
        const consent = typeof cookieVal === 'string' ? JSON.parse(decodeURIComponent(cookieVal)) : cookieVal;
        const groups = consent?.groups || {};

        gaGranted = isServiceConsentGranted(
          groups,
          config.googleCytGACookieGroup,
          ['Cyt.cookieBar.statistics.label', 'CookieBar.statistics.label', 'statistics'],
          ['Google Analytics', 'analytics', 'ga4']
        );

        adsGranted = isServiceConsentGranted(
          groups,
          config.googleAdsCookieGroup,
          ['CookieBar.marketing.label', 'Cyt.cookieBar.marketing.label', 'marketing'],
          ['Google Ads', 'ads', 'remarketing', 'conversion']
        );
      } catch (e) {
        // Parsing-Fehler ignorieren
      }
    }

    const w = window as any;
    w.dataLayer = w.dataLayer || [];

    // Google Consent Mode v2 dynamisch im Browser aktualisieren
    w.dataLayer.push([
      'consent',
      'update',
      {
        ad_storage: adsGranted ? 'granted' : 'denied',
        ad_user_data: adsGranted ? 'granted' : 'denied',
        ad_personalization: adsGranted ? 'granted' : 'denied',
        analytics_storage: gaGranted ? 'granted' : 'denied',
      },
    ]);

    // Custom Event für GTM Trigger pushen
    w.dataLayer.push({
      event: 'consent_update',
      consent_analytics: gaGranted,
      consent_ads: adsGranted,
    });
  };

  // Reaktiv auf Änderungen des Consent-Cookies hören (beim Speichern im Banner)
  const consentCookie = useCookie('consent-cookie');
  watch(
    consentCookie,
    (newVal) => {
      if (newVal) {
        updateGtmConsent(newVal);
      }
    },
    { deep: true }
  );
});
