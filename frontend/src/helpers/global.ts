export const localStorageHelper = {
  set: (key: string, value: string) => localStorage.setItem(key, value),
  get: (key: string) => localStorage.getItem(key),
  delete: (key: string) => localStorage.removeItem(key),
};

export const areTokensExpired = () => {
  // Get current time in UTC
  const nowUTC = new Date(new Date().toISOString());

  const refreshTokenExpiration = localStorageHelper.get(
    "refresh_token_expires_at"
  );
  const accessTokenExpiration = localStorageHelper.get(
    "access_token_expires_at"
  );

  let isRefreshExpired = true;
  let isAccessExpired = true;

  // Convert expiration times to UTC Date objects
  if (refreshTokenExpiration) {
    const refreshExpiration = new Date(refreshTokenExpiration);
    isRefreshExpired = nowUTC >= refreshExpiration;
  }
  if (accessTokenExpiration) {
    const accessExpiration = new Date(accessTokenExpiration);
    isAccessExpired = nowUTC >= accessExpiration;
  }

  return { isRefreshExpired, isAccessExpired };
};
