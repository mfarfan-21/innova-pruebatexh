/**
 * Custom Hook: useOCRProcess
 * Gestiona el proceso de reconocimiento OCR
 */
import { useState, useCallback } from 'react';
import { ocrClient } from '../../infrastructure/adapters/ocrClient';
import { API_CONFIG } from '../../infrastructure/config/api.config';
import type { OCRDetailedResponse } from '../../infrastructure/adapters/ocrClient';

interface UseOCRProcessReturn {
  plateResult: string | null;
  detailedResult: OCRDetailedResponse | null;
  isProcessing: boolean;
  error: string | null;
  lastShotTime: string | null;
  recognizePlate: (imageName: string) => Promise<OCRDetailedResponse | null>;
  reset: () => void;
}

export const useOCRProcess = (): UseOCRProcessReturn => {
  const [plateResult, setPlateResult] = useState<string | null>(null);
  const [detailedResult, setDetailedResult] = useState<OCRDetailedResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastShotTime, setLastShotTime] = useState<string | null>(null);

  const recognizePlate = useCallback(async (imageName: string): Promise<OCRDetailedResponse | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Delay para efecto visual
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.OCR_PROCESSING_DELAY));
      
      const result = await ocrClient.recognizePlateDetailed(imageName);
      const timestamp = new Date().toISOString();
      
      setPlateResult(result.plate_number);
      setDetailedResult(result);
      setLastShotTime(timestamp);

      // Enviar a API externa
      await ocrClient.sendToExternalAPI({
        plate_number: result.plate_number,
        image_name: result.image_name,
        timestamp: timestamp,
        coordinates: result.coordinates,
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error processing image';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPlateResult(null);
    setDetailedResult(null);
    setError(null);
  }, []);

  return {
    plateResult,
    detailedResult,
    isProcessing,
    error,
    lastShotTime,
    recognizePlate,
    reset,
  };
};
