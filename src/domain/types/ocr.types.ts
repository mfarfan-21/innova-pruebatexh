/**
 * Domain Types: OCR
 * Tipos TypeScript para el sistema de reconocimiento de matrículas
 */

/**
 * Información de un carácter individual detectado en la matrícula
 */
export interface CharacterInfo {
  char: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Coordenadas de la matrícula en la imagen
 */
export interface PlateCoordinates {
  top_left: [number, number];
  top_right: [number, number];
  bottom_right: [number, number];
  bottom_left: [number, number];
}

/**
 * Respuesta simple del reconocimiento OCR
 */
export interface OCRResponse {
  plate_number: string;
  image_name: string;
}

/**
 * Respuesta detallada del reconocimiento OCR
 */
export interface OCRDetailedResponse {
  plate_number: string;
  image_name: string;
  num_characters: number;
  num_plates_in_image: number;
  characters: CharacterInfo[];
  coordinates: PlateCoordinates;
  is_valid: boolean;
}

/**
 * Datos de imagen disponible en el sistema
 */
export interface PlateImage {
  image_name: string;
  plate_number: string;
}

/**
 * Payload para enviar a API externa
 */
export interface ExternalAPIPayload {
  plate_number: string;
  image_name: string;
  timestamp: string;
  coordinates?: PlateCoordinates;
}

/**
 * Estados posibles del proceso OCR
 */
export const OCRProcessStatus = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type OCRProcessStatusType = typeof OCRProcessStatus[keyof typeof OCRProcessStatus];

/**
 * Resultado de validación de matrícula
 */
export interface PlateValidation {
  is_valid: boolean;
  reason?: string;
}
