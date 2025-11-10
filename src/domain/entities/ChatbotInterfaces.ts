import type { Language } from '../../shared/types';

export interface ChatRequest {
  message: string;
  language: Language;
}

export interface ChatResponse {
  response: string;
  language: Language;
}
