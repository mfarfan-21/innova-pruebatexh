/**
 * Cliente OCR - Adaptador para comunicación con el backend de reconocimiento de matrículas
 * Arquitectura Hexagonal - Infrastructure Layer
 */

import type {
  OCRResponse,
  OCRDetailedResponse,
  PlateImage,
  ExternalAPIPayload,
} from '../../domain/types/ocr.types';
import { API_BASE_URL, API_ENDPOINTS, EXTERNAL_API_URL, EXTERNAL_API_KEY } from '../config/api.config';

// Re-exportar tipos para compatibilidad
export type { OCRResponse, OCRDetailedResponse, PlateImage, ExternalAPIPayload };

export const ocrClient = {
  /**
   * Reconoce la matrícula en una imagen (respuesta simple)
   */
  async recognizePlate(imageName: string): Promise<OCRResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OCR.RECOGNIZE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_name: imageName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al reconocer la matrícula');
    }

    return response.json();
  },

  /**
   * Reconoce la matrícula con información detallada completa
   */
  async recognizePlateDetailed(imageName: string): Promise<OCRDetailedResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OCR.RECOGNIZE_DETAILED}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_name: imageName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al reconocer la matrícula');
    }

    return response.json();
  },

  /**
   * Verifica si existe información OCR para una imagen
   */
  async imageExists(imageName: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OCR.EXISTS}/${imageName}`);
    const data = await response.json();
    return data.exists;
  },

  /**
   * Obtiene la lista de todas las imágenes disponibles
   */
  async getAllPlates(limit?: number): Promise<Array<{ image_name: string; plate_number: string; num_characters: number }>> {
    const url = limit ? `${API_BASE_URL}${API_ENDPOINTS.OCR.PLATES}?limit=${limit}` : `${API_BASE_URL}${API_ENDPOINTS.OCR.PLATES}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.plates;
  },

  /**
   * Obtiene la URL de una imagen
   */
  getImageUrl(imageName: string): string {
    return `${API_BASE_URL}${API_ENDPOINTS.OCR.IMAGE}/${imageName}`;
  },

  /**
   * Envía los datos de lectura de matrícula a una API externa (simulado)
   */
  async sendToExternalAPI(data: ExternalAPIPayload): Promise<void> {
    try {
      console.log('Enviando a API externa:', EXTERNAL_API_URL);
      console.log('Payload:', JSON.stringify(data, null, 2));
      
      // Simulación de envío a API externa (siempre fallará porque es ficticia)
      await fetch(EXTERNAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': EXTERNAL_API_KEY,
        },
        body: JSON.stringify(data),
      }).catch(() => {
        // Esperado que falle, es una URL ficticia
        console.log('Intento de envío completado (URL ficticia)');
      });
    } catch (error) {
      console.log('INFO: API externa no disponible (simulación)');
    }
  },
};
