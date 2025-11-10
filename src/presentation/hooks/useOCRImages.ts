/**
 * Custom Hook: useOCRImages
 * Gestiona la carga y navegación de imágenes para OCR
 */
import { useState, useEffect, useCallback } from 'react';
import { ocrClient } from '../../infrastructure/adapters/ocrClient';

interface UseOCRImagesReturn {
  availableImages: string[];
  currentImageIndex: number;
  currentImage: string;
  isLoadingImages: boolean;
  error: string | null;
  navigateToNext: () => void;
  navigateToPrevious: () => void;
  setImageIndex: (index: number) => void;
}

export const useOCRImages = (): UseOCRImagesReturn => {
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar lista de imágenes al montar
  useEffect(() => {
    const loadImages = async () => {
      try {
        const plates = await ocrClient.getAllPlates();
        const imageNames = plates.map(p => p.image_name);
        setAvailableImages(imageNames);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading images';
        setError(errorMessage);
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadImages();
  }, []);

  // Navegar a siguiente imagen
  const navigateToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
  }, [availableImages.length]);

  // Navegar a imagen anterior
  const navigateToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? availableImages.length - 1 : prev - 1
    );
  }, [availableImages.length]);

  // Establecer índice específico
  const setImageIndex = useCallback((index: number) => {
    if (index >= 0 && index < availableImages.length) {
      setCurrentImageIndex(index);
    }
  }, [availableImages.length]);

  const currentImage = availableImages[currentImageIndex] || '';

  return {
    availableImages,
    currentImageIndex,
    currentImage,
    isLoadingImages,
    error,
    navigateToNext,
    navigateToPrevious,
    setImageIndex,
  };
};
