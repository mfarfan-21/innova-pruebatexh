import type { Conversation, Message } from '../../shared/types';
import type { ChatRequest, ChatResponse } from '../../domain/entities/ChatbotInterfaces';
import { conversationStorage } from './conversationStorage';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';

export const chatbotClient = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHATBOT.CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Error al conectar con el chatbot');
    }

    return response.json();
  },

  // Gestión de conversaciones - Local Storage
  async getConversations(userId: string): Promise<Conversation[]> {
    return Promise.resolve(conversationStorage.getConversations(userId));
  },

  async createConversation(userId: string, title: string): Promise<Conversation> {
    return Promise.resolve(conversationStorage.createConversation(userId, title));
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return Promise.resolve(conversationStorage.getMessages(conversationId));
  },

  async saveMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<Message> {
    return Promise.resolve(conversationStorage.saveMessage(conversationId, role, content));
  },

  async deleteConversation(conversationId: string): Promise<void> {
    return Promise.resolve(conversationStorage.deleteConversation(conversationId));
  },
};

