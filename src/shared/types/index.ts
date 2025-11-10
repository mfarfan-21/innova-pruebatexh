import type { User } from '../../domain/entities/User';

export type { Language, Translation } from '../constants/translations';
export type { User } from '../../domain/entities/User';
export type { Message, Conversation } from '../../domain/entities/Conversation';
export type { ChatRequest, ChatResponse } from '../../domain/entities/ChatbotInterfaces';
export type { ChatbotPopupProps, ConversationListProps } from '../../domain/entities/ComponentInterfaces';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

