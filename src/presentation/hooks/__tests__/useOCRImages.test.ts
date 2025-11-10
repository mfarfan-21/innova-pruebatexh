/**
 * Tests para useOCRImages Hook
 * 
 * ESTRATEGIA DE TESTING:
 * - Test de carga inicial de imágenes
 * - Test de navegación (siguiente/anterior)
 * - Test de manejo de errores
 * - Test de estados de loading
 * 
 * JUSTIFICACIÓN:
 * Este hook es crítico porque gestiona la lista completa de imágenes disponibles
 * y la navegación entre ellas. Un fallo aquí rompería toda la funcionalidad del OCR.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useOCRImages } from '../useOCRImages';
import { ocrClient } from '@/infrastructure/adapters/ocrClient';

// Mock del ocrClient
vi.mock('@/infrastructure/adapters/ocrClient', () => ({
  ocrClient: {
    getAllPlates: vi.fn(),
  },
}));

describe('useOCRImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar imágenes correctamente al montar', async () => {
    // ARRANGE: Preparar datos mock
    const mockPlates = [
      { image_name: 'car001.jpg', plate_number: 'ABC123', num_characters: 6 },
      { image_name: 'car002.jpg', plate_number: 'XYZ789', num_characters: 6 },
      { image_name: 'car003.jpg', plate_number: 'DEF456', num_characters: 6 },
    ];

    vi.mocked(ocrClient.getAllPlates).mockResolvedValue(mockPlates);

    // ACT: Renderizar el hook
    const { result } = renderHook(() => useOCRImages());

    // ASSERT: Verificar estado inicial
    expect(result.current.isLoadingImages).toBe(true);
    expect(result.current.availableImages).toEqual([]);

    // Esperar a que termine la carga
    await waitFor(() => {
      expect(result.current.isLoadingImages).toBe(false);
    });

    // ASSERT: Verificar estado después de cargar
    expect(result.current.availableImages).toHaveLength(3);
    expect(result.current.availableImages).toEqual([
      'car001.jpg',
      'car002.jpg',
      'car003.jpg',
    ]);
    expect(result.current.currentImage).toBe('car001.jpg');
    expect(result.current.currentImageIndex).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('debe navegar a la siguiente imagen correctamente', async () => {
    // ARRANGE
    const mockPlates = [
      { image_name: 'img1.jpg', plate_number: 'ABC123', num_characters: 6 },
      { image_name: 'img2.jpg', plate_number: 'XYZ789', num_characters: 6 },
      { image_name: 'img3.jpg', plate_number: 'DEF456', num_characters: 6 },
    ];

    vi.mocked(ocrClient.getAllPlates).mockResolvedValue(mockPlates);

    const { result } = renderHook(() => useOCRImages());

    await waitFor(() => {
      expect(result.current.isLoadingImages).toBe(false);
    });

    // ACT: Navegar a siguiente
    act(() => {
      result.current.navigateToNext();
    });

    // ASSERT
    expect(result.current.currentImageIndex).toBe(1);
    expect(result.current.currentImage).toBe('img2.jpg');

    // ACT: Navegar a siguiente otra vez
    act(() => {
      result.current.navigateToNext();
    });

    // ASSERT
    expect(result.current.currentImageIndex).toBe(2);
    expect(result.current.currentImage).toBe('img3.jpg');
  });

  it('debe hacer wrap around al navegar después de la última imagen', async () => {
    // ARRANGE
    const mockPlates = [
      { image_name: 'img1.jpg', plate_number: 'ABC123', num_characters: 6 },
      { image_name: 'img2.jpg', plate_number: 'XYZ789', num_characters: 6 },
    ];

    vi.mocked(ocrClient.getAllPlates).mockResolvedValue(mockPlates);

    const { result } = renderHook(() => useOCRImages());

    await waitFor(() => {
      expect(result.current.isLoadingImages).toBe(false);
    });

    // ACT: Navegar hasta el final y uno más
    act(() => {
      result.current.navigateToNext(); // índice 1
      result.current.navigateToNext(); // debe volver a 0
    });

    // ASSERT: Debe volver al inicio
    expect(result.current.currentImageIndex).toBe(0);
    expect(result.current.currentImage).toBe('img1.jpg');
  });

  it('debe navegar a la imagen anterior correctamente', async () => {
    // ARRANGE
    const mockPlates = [
      { image_name: 'img1.jpg', plate_number: 'ABC123', num_characters: 6 },
      { image_name: 'img2.jpg', plate_number: 'XYZ789', num_characters: 6 },
      { image_name: 'img3.jpg', plate_number: 'DEF456', num_characters: 6 },
    ];

    vi.mocked(ocrClient.getAllPlates).mockResolvedValue(mockPlates);

    const { result } = renderHook(() => useOCRImages());

    await waitFor(() => {
      expect(result.current.isLoadingImages).toBe(false);
    });

    // ACT: Primero avanzar a img2, luego retroceder
    act(() => {
      result.current.navigateToNext();
    });

    expect(result.current.currentImageIndex).toBe(1);

    act(() => {
      result.current.navigateToPrevious();
    });

    // ASSERT
    expect(result.current.currentImageIndex).toBe(0);
    expect(result.current.currentImage).toBe('img1.jpg');
  });

  it('debe hacer wrap around al navegar antes de la primera imagen', async () => {
    // ARRANGE
    const mockPlates = [
      { image_name: 'img1.jpg', plate_number: 'ABC123', num_characters: 6 },
      { image_name: 'img2.jpg', plate_number: 'XYZ789', num_characters: 6 },
      { image_name: 'img3.jpg', plate_number: 'DEF456', num_characters: 6 },
    ];

    vi.mocked(ocrClient.getAllPlates).mockResolvedValue(mockPlates);

    const { result } = renderHook(() => useOCRImages());

    await waitFor(() => {
      expect(result.current.isLoadingImages).toBe(false);
    });

    // ACT: Navegar hacia atrás desde el índice 0
    act(() => {
      result.current.navigateToPrevious();
    });

    // ASSERT: Debe ir al final
    expect(result.current.currentImageIndex).toBe(2);
    expect(result.current.currentImage).toBe('img3.jpg');
  });

  it('debe manejar errores al cargar imágenes', async () => {
    // ARRANGE: Simular error en la API
    const errorMessage = 'Error de conexión con el servidor';
    vi.mocked(ocrClient.getAllPlates).mockRejectedValue(new Error(errorMessage));

    // ACT
    const { result } = renderHook(() => useOCRImages());

    // ASSERT: Verificar estado inicial
    expect(result.current.isLoadingImages).toBe(true);

    // Esperar a que termine (con error)
    await waitFor(() => {
      expect(result.current.isLoadingImages).toBe(false);
    });

    // ASSERT: Verificar manejo de error
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.availableImages).toEqual([]);
    expect(result.current.currentImage).toBe('');
  });

  it('debe permitir establecer un índice específico', async () => {
    // ARRANGE
    const mockPlates = [
      { image_name: 'img1.jpg', plate_number: 'ABC123', num_characters: 6 },
      { image_name: 'img2.jpg', plate_number: 'XYZ789', num_characters: 6 },
      { image_name: 'img3.jpg', plate_number: 'DEF456', num_characters: 6 },
    ];

    vi.mocked(ocrClient.getAllPlates).mockResolvedValue(mockPlates);

    const { result } = renderHook(() => useOCRImages());

    await waitFor(() => {
      expect(result.current.isLoadingImages).toBe(false);
    });

    // ACT: Establecer índice específico
    act(() => {
      result.current.setImageIndex(2);
    });

    // ASSERT
    expect(result.current.currentImageIndex).toBe(2);
    expect(result.current.currentImage).toBe('img3.jpg');
  });

  it('debe ignorar índices inválidos', async () => {
    // ARRANGE
    const mockPlates = [
      { image_name: 'img1.jpg', plate_number: 'ABC123', num_characters: 6 },
      { image_name: 'img2.jpg', plate_number: 'XYZ789', num_characters: 6 },
    ];

    vi.mocked(ocrClient.getAllPlates).mockResolvedValue(mockPlates);

    const { result } = renderHook(() => useOCRImages());

    await waitFor(() => {
      expect(result.current.isLoadingImages).toBe(false);
    });

    const initialIndex = result.current.currentImageIndex;

    // ACT: Intentar establecer índices inválidos
    act(() => {
      result.current.setImageIndex(-1); // Índice negativo
    });

    // ASSERT: No debe cambiar
    expect(result.current.currentImageIndex).toBe(initialIndex);

    act(() => {
      result.current.setImageIndex(999); // Índice fuera de rango
    });

    // ASSERT: No debe cambiar
    expect(result.current.currentImageIndex).toBe(initialIndex);
  });
});
