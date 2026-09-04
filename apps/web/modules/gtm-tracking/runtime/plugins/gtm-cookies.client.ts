export default defineNuxtPlugin({
  name: 'gtm-register-cookies',
  dependsOn: ['init-cookie-bar'],
  setup() {
    const { cookieGroups } = useCookieBar();
    const config = useRuntimeConfig().public as any;

    // Helper: String aus dem Editor parsen und als Cookies in die Gruppe pushen
    const registerCookiesToGroup = (
      groupNameOrId: string,
      cookieString: string,
      provider: string,
      privacyPolicy: string
    ) => {
      if (!cookieString || cookieString.trim() === '' || cookieString.trim() === 'no-cookies') {
        return;
      }

      // Passende Gruppe finden (nach Name oder ID) mit automatischer Gruppenerstellung als Fallback
      let group = cookieGroups.value?.find(
        (g: any) =>
          g.name === groupNameOrId ||
          String(g.id) === String(groupNameOrId) ||
          (typeof groupNameOrId === 'string' && g.name?.toLowerCase().includes(groupNameOrId.toLowerCase()))
      );

      // Falls die Gruppe noch nicht in Plenty existiert: einfach automatisch anlegen!
      if (!group && cookieGroups.value) {
        group = {
          id: cookieGroups.value.length + 1,
          name: groupNameOrId,
          showMore: false,
          description: groupNameOrId.replace('.label', '.description'),
          cookies: [],
          accepted: false,
        };
        cookieGroups.value.push(group);
      }

      group.cookies = group.cookies || [];

      // Komma-getrennte Cookies aus deinem Editor-Eingabefeld parsen
      const cookieNames = cookieString
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      cookieNames.forEach((name) => {
        const alreadyExists = group.cookies.some((c: any) => c.name === name);
        if (!alreadyExists) {
          group.cookies.push({
            name: name,
            Provider: provider,
            Status: 'Aktiv',
            PrivacyPolicy: privacyPolicy,
            Lifespan: 'VARIABEL',
            accepted: false,
          });
        }
      });
    };

    // 1. Google Analytics Cookies registrieren
    const gaGroup = useSiteSettings('googleCytGACookieGroup').getSetting() || config.googleCytGACookieGroup || 'Cyt.cookieBar.statistics.label';
    const gaCookies = useSiteSettings('googleCytGACookiesToRegister').getSetting() || config.googleCytGACookiesToRegister || '';
    registerCookiesToGroup(gaGroup, gaCookies, 'Google LLC', 'https://policies.google.com/privacy');

    // 2. Google Ads Cookies registrieren
    const adsGroup = useSiteSettings('googleAdsCookieGroup').getSetting() || config.googleAdsCookieGroup || 'CookieBar.marketing.label';
    const adsCookies = useSiteSettings('googleAdsCookiesToRegister').getSetting() || config.googleAdsCookiesToRegister || '';
    registerCookiesToGroup(adsGroup, adsCookies, 'Google LLC', 'https://policies.google.com/privacy/ads');

    // 3. Google Tag Manager Cookies registrieren (falls vorhanden)
    const gtmGroup = useSiteSettings('googleGtmCookieGroup').getSetting() || config.googleGtmCookieGroup || 'CookieBar.functional.label';
    const gtmCookies = useSiteSettings('googleGtmCookiesToRegister').getSetting() || config.googleGtmCookiesToRegister || '';
    registerCookiesToGroup(gtmGroup, gtmCookies, 'Google LLC', 'https://policies.google.com/privacy');
  },
});
