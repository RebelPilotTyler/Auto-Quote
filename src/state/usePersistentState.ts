import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export const usePersistentState = <T,>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const raw = window.localStorage.getItem(key);
    if (raw) {
      try {
        setState(JSON.parse(raw) as T);
      } catch {
        setState(initialValue);
      }
    }
  }, [initialValue, key]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
};
