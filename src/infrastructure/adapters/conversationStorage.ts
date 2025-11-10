/**
 * Conversation Storage - Local Persistence
 * Almacenamiento local de conversaciones usando localStorage
 */
import type { Conversation, Message } from '../../shared/types';

const STORAGE_KEY = 'innova_conversations';

interface StorageData {
  conversations: Conversation[];
}

const getStorage = (): StorageData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return { conversations: [] };
  }
  try {
    return JSON.parse(data);
  } catch {
    return { conversations: [] };
  }
};

const saveStorage = (data: StorageData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const conversationStorage = {
  // Obtener todas las conversaciones de un usuario
  getConversations(userId: string): Conversation[] {
    const storage = getStorage();
    return storage.conversations
      .filter(conv => conv.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  // Crear nueva conversación
  createConversation(userId: string, title: string): Conversation {
    const storage = getStorage();
    const now = new Date();
    
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      userId,
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    storage.conversations.push(newConversation);
    saveStorage(storage);
    
    return newConversation;
  },

  // Obtener mensajes de una conversación
  getMessages(conversationId: string): Message[] {
    const storage = getStorage();
    const conversation = storage.conversations.find(c => c.id === conversationId);
    return conversation?.messages || [];
  },

  // Guardar mensaje en una conversación
  saveMessage(conversationId: string, role: 'user' | 'assistant', content: string): Message {
    const storage = getStorage();
    const conversation = storage.conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      createdAt: new Date(),
    };

    conversation.messages.push(newMessage);
    conversation.updatedAt = new Date();
    saveStorage(storage);
    
    return newMessage;
  },

  // Eliminar una conversación
  deleteConversation(conversationId: string): void {
    const storage = getStorage();
    storage.conversations = storage.conversations.filter(c => c.id !== conversationId);
    saveStorage(storage);
  },

  // Limpiar todas las conversaciones de un usuario
  clearUserConversations(userId: string): void {
    const storage = getStorage();
    storage.conversations = storage.conversations.filter(c => c.userId !== userId);
    saveStorage(storage);
  },
};
