type Store = {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => void;
}

// TODO: migrate to jotai atoms?

/**
 * Simple persistent key (string) -> value (json object) store 
 */
export const localStore: Store = {
  get: <T>(key: string): T | null => {
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value);
  },

  set: <T>(key: string, value: T) => {
    if (!value) {
      return localStorage.removeItem(key);
    }

    localStorage.setItem(key, JSON.stringify(value));
  },
};


/**
 * Simple session key (string) -> value (json object) store 
 */
export const sessionStore: Store = {
  get: <T>(key: string): T | null => {
    const value = sessionStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value) as T;
  },

  set: <T>(key: string, value: T) => {
    if (!value) {
      return sessionStorage.removeItem(key);
    }

    sessionStorage.setItem(key, JSON.stringify(value));
  },
};
