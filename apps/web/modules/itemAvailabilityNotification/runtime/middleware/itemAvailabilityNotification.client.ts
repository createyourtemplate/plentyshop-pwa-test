export default defineNuxtRouteMiddleware(async (to) => {
  // addRouteMiddleware ignores the .client suffix, so skip the SSR run (otherwise confirm is called twice)
  if (import.meta.server) {
    return;
  }

  const { query } = to;
  const subscription = query.subscription?.toString();
  const hash = query.hash?.toString();

  if (!subscription || !hash) {
    return;
  }

  const { confirm } = useItemAvailabilityNotification();
  const { send } = useNotification();

  const success = await confirm({ subscription, hash });

  send({
    message: t(
      success
        ? 'itemAvailabilityNotification.frontend.confirmationSucceed'
        : 'itemAvailabilityNotification.frontend.confirmationFailed',
    ),
    type: success ? 'positive' : 'negative',
    persist: success ? true : false,
  });

  // remove the confirmation params so later navigations don't trigger confirm again
  const { subscription: _subscription, hash: _hash, ...restQuery } = query;
  return navigateTo({ path: to.path, query: restQuery, hash: to.hash }, { replace: true });
});
