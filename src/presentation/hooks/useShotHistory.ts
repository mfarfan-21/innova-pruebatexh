/**
 * Custom Hook: useShotHistory
 * Gestiona el historial de lecturas OCR realizadas
 */
import { useState, useCallback } from 'react';

export interface ShotHistoryEntry {
  id: string;
  imageName: string;
  plateNumber: string;
  timestamp: string;
  isValid: boolean;
}

interface UseShotHistoryReturn {
  history: ShotHistoryEntry[];
  addEntry: (entry: Omit<ShotHistoryEntry, 'id'>) => void;
  clearHistory: () => void;
  getEntryById: (id: string) => ShotHistoryEntry | undefined;
}

export const useShotHistory = (): UseShotHistoryReturn => {
  const [history, setHistory] = useState<ShotHistoryEntry[]>([]);

  const addEntry = useCallback((entry: Omit<ShotHistoryEntry, 'id'>) => {
    const newEntry: ShotHistoryEntry = {
      ...entry,
      id: `${entry.imageName}-${entry.timestamp}`,
    };
    setHistory((prev) => [newEntry, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getEntryById = useCallback((id: string) => {
    return history.find((entry) => entry.id === id);
  }, [history]);

  return {
    history,
    addEntry,
    clearHistory,
    getEntryById,
  };
};
