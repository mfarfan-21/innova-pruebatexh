/**
 * Tests para useOCRProcess Hook
 * 
 * ESTRATEGIA DE TESTING:
 * - Test de proceso OCR exitoso
 * - Test de manejo de errores
 * - Test de estados de loading
 * - Test de reset de estado
 * - Test de integración con API externa
 * 
 * JUSTIFICACIÓN:
 * Este hook gestiona el core del negocio: el reconocimiento OCR.
 * Es crítico asegurar que maneja correctamente los estados de carga,
 * errores, y que envía los datos a la API externa.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useOCRProcess } from '../useOCRProcess';
import { ocrClient } from '@/infrastructure/adapters/ocrClient';
import type { OCRDetailedResponse } from '@/infrastructure/adapters/ocrClient';

// Mock del ocrClient
vi.mock('@/infrastructure/adapters/ocrClient', () => ({
  ocrClient: {
    recognizePlateDetailed: vi.fn(),
    sendToExternalAPI: vi.fn(),
  },
}));

describe('useOCRProcess', () => {
  beforeEach(() => {
    // Solo limpiar los calls, no restaurar los mocks
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debe inicializar con valores por defecto', () => {
    // ACT
    const { result } = renderHook(() => useOCRProcess());

    // ASSERT
    expect(result.current.plateResult).toBeNull();
    expect(result.current.detailedResult).toBeNull();
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.lastShotTime).toBeNull();
  });

  it('debe procesar matrícula exitosamente', async () => {
    // ARRANGE
    const mockResult: OCRDetailedResponse = {
      plate_number: 'ABC123',
      image_name: 'test.jpg',
      num_characters: 6,
      num_plates_in_image: 1,
      is_valid: true,
      characters: [
        { char: 'A', left: 0.1, top: 0.2, width: 0.05, height: 0.1 },
        { char: 'B', left: 0.2, top: 0.2, width: 0.05, height: 0.1 },
        { char: 'C', left: 0.3, top: 0.2, width: 0.05, height: 0.1 },
      ],
      coordinates: {
        top_left: [100, 200],
        top_right: [500, 200],
        bottom_right: [500, 300],
        bottom_left: [100, 300],
      },
    };

    vi.mocked(ocrClient.recognizePlateDetailed).mockResolvedValue(mockResult);
    vi.mocked(ocrClient.sendToExternalAPI).mockResolvedValue();

    const { result } = renderHook(() => useOCRProcess());

    // ACT: Iniciar proceso y avanzar timer
    await act(async () => {
      const promise = result.current.recognizePlate('test.jpg');
      vi.advanceTimersByTime(800);
      await promise;
    });

    // ASSERT: Debe tener el resultado
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.plateResult).toBe('ABC123');
    expect(result.current.detailedResult).toEqual(mockResult);
    expect(result.current.lastShotTime).toBeTruthy();
    expect(result.current.error).toBeNull();

    // Verificar que se llamó a la API externa
    expect(ocrClient.sendToExternalAPI).toHaveBeenCalledWith(
      expect.objectContaining({
        plate_number: 'ABC123',
        image_name: 'test.jpg',
        coordinates: mockResult.coordinates,
      })
    );
  });

  it('debe manejar errores del servicio OCR', async () => {
    // ARRANGE
    const errorMessage = 'Error de conexión';
    vi.mocked(ocrClient.recognizePlateDetailed).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useOCRProcess());

    // ACT
    await act(async () => {
      const promise = result.current.recognizePlate('test.jpg');
      vi.advanceTimersByTime(800);
      await promise;
    });

    // ASSERT
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.plateResult).toBeNull();
    expect(result.current.detailedResult).toBeNull();
  });

  it('debe manejar errores no-Error (string genérico)', async () => {
    // ARRANGE: Error que no es instancia de Error
    vi.mocked(ocrClient.recognizePlateDetailed).mockRejectedValue(
      'String error genérico'
    );

    const { result } = renderHook(() => useOCRProcess());

    // ACT
    await act(async () => {
      const promise = result.current.recognizePlate('test.jpg');
      vi.advanceTimersByTime(800);
      await promise;
    });

    // ASSERT: Debe usar mensaje por defecto
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBe('Error processing image');
    expect(result.current.plateResult).toBeNull();
  });

  it('debe resetear el estado correctamente', async () => {
    // ARRANGE: Primero procesamos una imagen
    const mockResult: OCRDetailedResponse = {
      plate_number: 'XYZ789',
      image_name: 'car.jpg',
      num_characters: 6,
      num_plates_in_image: 1,
      is_valid: true,
      characters: [],
      coordinates: {
        top_left: [0, 0],
        top_right: [100, 0],
        bottom_right: [100, 50],
        bottom_left: [0, 50],
      },
    };

    vi.mocked(ocrClient.recognizePlateDetailed).mockResolvedValue(mockResult);
    vi.mocked(ocrClient.sendToExternalAPI).mockResolvedValue();

    const { result } = renderHook(() => useOCRProcess());

    await act(async () => {
      const promise = result.current.recognizePlate('car.jpg');
      vi.advanceTimersByTime(800);
      await promise;
    });

    // Verificar que hay datos
    expect(result.current.plateResult).toBe('XYZ789');
    expect(result.current.detailedResult).toBeTruthy();

    // ACT: Resetear
    act(() => {
      result.current.reset();
    });

    // ASSERT: Todo debe volver a null
    expect(result.current.plateResult).toBeNull();
    expect(result.current.detailedResult).toBeNull();
    expect(result.current.error).toBeNull();
    // lastShotTime NO se resetea (comportamiento actual del hook)
  });

  it('debe retornar el resultado detallado en la promesa', async () => {
    // ARRANGE
    const mockResult: OCRDetailedResponse = {
      plate_number: 'TEST123',
      image_name: 'test.jpg',
      num_characters: 7,
      num_plates_in_image: 1,
      is_valid: true,
      characters: [],
      coordinates: {
        top_left: [0, 0],
        top_right: [100, 0],
        bottom_right: [100, 50],
        bottom_left: [0, 50],
      },
    };

    vi.mocked(ocrClient.recognizePlateDetailed).mockResolvedValue(mockResult);
    vi.mocked(ocrClient.sendToExternalAPI).mockResolvedValue();

    const { result } = renderHook(() => useOCRProcess());

    // ACT
    let returnedResult: OCRDetailedResponse | null = null;

    await act(async () => {
      const promise = result.current.recognizePlate('test.jpg');
      vi.advanceTimersByTime(800);
      returnedResult = await promise;
    });

    // ASSERT
    expect(returnedResult).toEqual(mockResult);
  });

  it('debe retornar null cuando hay error', async () => {
    // ARRANGE
    vi.mocked(ocrClient.recognizePlateDetailed).mockRejectedValue(
      new Error('Test error')
    );

    const { result } = renderHook(() => useOCRProcess());

    // ACT
    let returnedResult: OCRDetailedResponse | null = 'placeholder' as any;

    await act(async () => {
      const promise = result.current.recognizePlate('test.jpg');
      vi.advanceTimersByTime(800);
      returnedResult = await promise;
    });

    // ASSERT
    expect(returnedResult).toBeNull();
  });

  it('debe limpiar error al iniciar nuevo proceso', async () => {
    // ARRANGE: Primero generamos un error
    vi.mocked(ocrClient.recognizePlateDetailed).mockRejectedValue(
      new Error('Primer error')
    );

    const { result } = renderHook(() => useOCRProcess());

    await act(async () => {
      const promise = result.current.recognizePlate('error.jpg');
      vi.advanceTimersByTime(800);
      await promise;
    });

    expect(result.current.error).toBe('Primer error');

    // ACT: Ahora procesamos con éxito
    const mockResult: OCRDetailedResponse = {
      plate_number: 'SUCCESS',
      image_name: 'success.jpg',
      num_characters: 7,
      num_plates_in_image: 1,
      is_valid: true,
      characters: [],
      coordinates: {
        top_left: [0, 0],
        top_right: [100, 0],
        bottom_right: [100, 50],
        bottom_left: [0, 50],
      },
    };

    vi.mocked(ocrClient.recognizePlateDetailed).mockResolvedValue(mockResult);
    vi.mocked(ocrClient.sendToExternalAPI).mockResolvedValue();

    await act(async () => {
      const promise = result.current.recognizePlate('success.jpg');
      vi.advanceTimersByTime(800);
      await promise;
    });

    // ASSERT: El error debe estar limpio
    expect(result.current.error).toBeNull();
    expect(result.current.plateResult).toBe('SUCCESS');
  });
});
