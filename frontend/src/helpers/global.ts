export const localStorageHelper = {
  set: (key: string, value: string) => localStorage.setItem(key, value),
  get: (key: string) => localStorage.getItem(key),
  delete: (key: string) => localStorage.removeItem(key),
};
