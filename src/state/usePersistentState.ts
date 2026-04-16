import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export const usePersistentState = <T,>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      hydratedRef.current = true;
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

    hydratedRef.current = true;
  }, [key]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !hydratedRef.current) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
};
