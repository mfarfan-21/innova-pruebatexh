/**
 * API Configuration
 * Configuración centralizada de URLs y constantes de API
 */

import { ENV } from './env.config';

// Backend API URL - validado desde variables de entorno
export const API_BASE_URL = ENV.apiUrl;

// Endpoints específicos
export const API_ENDPOINTS = {
  OCR: {
    RECOGNIZE: '/ocr/recognize',
    RECOGNIZE_DETAILED: '/ocr/recognize/detailed',
    EXISTS: '/ocr/exists',
    PLATES: '/ocr/plates',
    IMAGE: '/ocr/image',
  },
  CHATBOT: {
    CHAT: '/chatbot/message',
  },
  AUTH: {
    LOGIN: '/auth/login',
  },
} as const;

// Timeouts y delays
export const API_CONFIG = {
  OCR_PROCESSING_DELAY: 800, // ms - delay visual para efecto de procesamiento
  DEFAULT_TIMEOUT: 30000, // ms
} as const;

// URL externa (ficticia) para envío de datos
export const EXTERNAL_API_URL = 'https://external-api.example.com/plate-readings';
export const EXTERNAL_API_KEY = 'fake-api-key-12345';
