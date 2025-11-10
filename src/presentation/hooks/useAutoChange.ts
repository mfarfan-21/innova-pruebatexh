/**
 * Custom Hook: useAutoChange
 * Gestiona el cambio automático de imágenes con intervalo configurable
 */
import { useEffect, useState, useCallback } from 'react';

interface UseAutoChangeOptions {
  enabled?: boolean;
  intervalMs?: number;
  onNext?: () => void;
}

interface UseAutoChangeReturn {
  isEnabled: boolean;
  toggleEnabled: () => void;
  setEnabled: (enabled: boolean) => void;
}

export const useAutoChange = ({
  enabled = true,
  intervalMs = 20000,
  onNext,
}: UseAutoChangeOptions): UseAutoChangeReturn => {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const toggleEnabled = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isEnabled || !onNext) return;

    const interval = setInterval(() => {
      onNext();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isEnabled, intervalMs, onNext]);

  return {
    isEnabled,
    toggleEnabled,
    setEnabled: setIsEnabled,
  };
};
