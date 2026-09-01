export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    return;
  }

  const config = useRuntimeConfig().public as any;
  const isGtmEnabled = config.enableGoogleGtm === true || config.enableGoogleGtm === 'true';
  const trackingId = (config.googleGtmTrackingId as string)?.trim();

  // 1. Früher Abbruch, wenn GTM deaktiviert ist oder keine ID existiert
  if (!isGtmEnabled || !trackingId) {
    return;
  }

  // Helper zum sprach- und gruppenunabhängigen Prüfen von Consents
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

      // Falls die Gruppe als Ganzes als boolean gespeichert ist
      if (group === true) {
        return true;
      }

      if (typeof group === 'object') {
        // Prüfung der einzelnen Cookies innerhalb der Gruppe
        for (const [cookieName, isGranted] of Object.entries(group)) {
          if (isGranted === true) {
            const lowerName = cookieName.toLowerCase();
            if (serviceKeywords.some((kw) => lowerName.includes(kw.toLowerCase()))) {
              return true;
            }
          }
        }

        // Fallback: Wenn in der Zielgruppe überhaupt ein Cookie akzeptiert wurde
        if (Object.values(group).some((val) => val === true)) {
          return true;
        }
      }
    }

    return false;
  };

  // 2. Consent-Cookie serverseitig lesen
  const rawCookie = useCookie<string | Record<string, any> | null>('consent-cookie').value;

  let gaStatus = 'denied';
  let adsStatus = 'denied';

  if (rawCookie) {
    try {
      const consent = typeof rawCookie === 'string' ? JSON.parse(decodeURIComponent(rawCookie)) : rawCookie;
      const groups = consent?.groups || {};

      // Google Analytics prüfen (DE, EN und konfigurierbare Gruppen)
      const hasGA = isServiceConsentGranted(
        groups,
        config.googleCytGACookieGroup,
        ['Cyt.cookieBar.statistics.label', 'CookieBar.statistics.label', 'statistics'],
        ['Google Analytics', 'analytics', 'ga4']
      );
      if (hasGA) {
        gaStatus = 'granted';
      }

      // Google Ads prüfen (DE, EN und konfigurierbare Gruppen)
      const hasAds = isServiceConsentGranted(
        groups,
        config.googleAdsCookieGroup,
        ['CookieBar.marketing.label', 'Cyt.cookieBar.marketing.label', 'marketing'],
        ['Google Ads', 'ads', 'remarketing', 'conversion']
      );
      if (hasAds) {
        adsStatus = 'granted';
      }
    } catch (e) {
      // Bei Parsing-Fehlern bleibt es sicher auf 'denied'
    }
  }

  // 3. Consent Default Script + GTM Container rendern
  useHead({
    script: [
      {
        type: 'text/javascript',
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': '${adsStatus}',
            'ad_user_data': '${adsStatus}',
            'ad_personalization': '${adsStatus}',
            'analytics_storage': '${gaStatus}',
            'personalization_storage': 'granted',
            'functionality_storage': 'granted',
            'security_storage': 'granted',
            'wait_for_update': 500
          });
        `,
        tagPosition: 'bodyOpen',
        tagPriority: 'critical',
        id: 'gtm-consent-default',
      },
      {
        type: 'text/javascript',
        innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer', '${trackingId}');`,
        tagPosition: 'bodyOpen',
        tagPriority: 'low',
        id: 'gtm',
      },
    ],
  });
});
