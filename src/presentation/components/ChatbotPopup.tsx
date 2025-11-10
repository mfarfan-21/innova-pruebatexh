import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { chatbotClient } from '../../infrastructure/adapters/chatbotClient';
import { ConversationList } from './ConversationList';
import type { Conversation, Message } from '../../shared/types';
import type { ChatbotPopupProps } from '../../domain/entities/ComponentInterfaces';
import { translations } from '../../shared/constants/translations';

export const ChatbotPopup = ({ open, onClose, currentLanguage, userId }: ChatbotPopupProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar conversaciones al abrir
  useEffect(() => {
    if (open) {
      loadConversations();
    }
  }, [open, userId]);

  // Cargar mensajes cuando cambia la conversación seleccionada
  useEffect(() => {
    if (selectedConvId) {
      loadMessages(selectedConvId);
    } else {
      setMessages([]);
    }
  }, [selectedConvId]);

  const loadConversations = async () => {
    try {
      const data = await chatbotClient.getConversations(userId);
      setConversations(data);
      if (data.length > 0 && !selectedConvId) {
        setSelectedConvId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const data = await chatbotClient.getMessages(convId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const createNewConversation = async () => {
    try {
      const title = `Conversación ${new Date().toLocaleDateString()}`;
      const newConv = await chatbotClient.createConversation(userId, title);
      setConversations([newConv, ...conversations]);
      setSelectedConvId(newConv.id);
      
      // Enviar mensaje de bienvenida automático
      const t = translations[currentLanguage];
      const welcomeMsg = await chatbotClient.saveMessage(newConv.id, 'assistant', t.chatbotWelcome);
      setMessages([welcomeMsg]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const deleteConversation = async (convId: string) => {
    try {
      await chatbotClient.deleteConversation(convId);
      const updatedConvs = conversations.filter(c => c.id !== convId);
      setConversations(updatedConvs);
      
      // Si se eliminó la conversación activa, seleccionar otra
      if (selectedConvId === convId) {
        setSelectedConvId(updatedConvs.length > 0 ? updatedConvs[0].id : null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || !selectedConvId) return;

    if (!messageText) {
      setInput('');
    }
    setIsLoading(true);

    try {
      // Guardar mensaje del usuario
      const userMsg = await chatbotClient.saveMessage(selectedConvId, 'user', textToSend);
      setMessages((prev) => [...prev, userMsg]);

      // Crear delay mínimo para mostrar animación de carga
      const startTime = Date.now();
      const minDelay = 1500; // 1.5 segundos mínimo

      // Obtener respuesta del chatbot
      const data = await chatbotClient.sendMessage({
        message: textToSend,
        language: currentLanguage,
      });

      // Calcular tiempo transcurrido y esperar si es necesario
      const elapsed = Date.now() - startTime;
      if (elapsed < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
      }

      // Guardar respuesta del bot
      const botMsg = await chatbotClient.saveMessage(selectedConvId, 'assistant', data.response);
      setMessages((prev) => [...prev, botMsg]);

      // Actualizar timestamp de la conversación
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedOption = (option: string) => {
    sendMessage(option);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          height: '80vh',
          maxHeight: '700px',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, background: '#0071e3', color: 'white' }}> {/* Azul Apple sólido */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon />
          <Typography variant="h6">Chatbot Poético</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, display: 'flex', height: 'calc(100% - 64px)' }}>
        {/* Sidebar: Lista de conversaciones */}
        <ConversationList
          conversations={conversations}
          selectedId={selectedConvId}
          onSelect={setSelectedConvId}
          onNew={createNewConversation}
          onDelete={deleteConversation}
        />

        {/* Área de chat */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Mensajes */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              backgroundColor: '#f5f5f5',
            }}
          >
            {!selectedConvId ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                <SmartToyIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography>Crea una nueva conversación para empezar</Typography>
              </Box>
            ) : messages.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                <SmartToyIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography>¡Pregúntame sobre poesía y matrículas!</Typography>
              </Box>
            ) : (
              <>
                {messages.map((msg) => (
                  <Paper
                    key={msg.id}
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      backgroundColor: msg.role === 'user' ? '#667eea' : 'white',
                      color: msg.role === 'user' ? 'white' : 'black',
                      borderRadius: 2,
                      display: 'flex',
                      gap: 1,
                      alignItems: 'flex-start',
                    }}
                  >
                    {msg.role === 'assistant' && <SmartToyIcon sx={{ fontSize: 20, mt: 0.5 }} />}
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', flex: 1 }}>
                      {msg.content}
                    </Typography>
                    {msg.role === 'user' && <PersonIcon sx={{ fontSize: 20, mt: 0.5 }} />}
                  </Paper>
                ))}
                
                {/* Opciones sugeridas solo si solo hay el mensaje de bienvenida */}
                {messages.length === 1 && messages[0].role === 'assistant' && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
                    <Chip
                      label={translations[currentLanguage].chatbotOption1}
                      onClick={() => handleSuggestedOption(translations[currentLanguage].chatbotOption1)}
                      sx={{ 
                        backgroundColor: '#0071e3',
                        color: 'white',
                        '&:hover': { backgroundColor: '#0077ed' },
                        cursor: 'pointer'
                      }}
                    />
                    <Chip
                      label={translations[currentLanguage].chatbotOption2}
                      onClick={() => handleSuggestedOption(translations[currentLanguage].chatbotOption2)}
                      sx={{ 
                        backgroundColor: '#0071e3',
                        color: 'white',
                        '&:hover': { backgroundColor: '#0077ed' },
                        cursor: 'pointer'
                      }}
                    />
                    <Chip
                      label={translations[currentLanguage].chatbotOption3}
                      onClick={() => handleSuggestedOption(translations[currentLanguage].chatbotOption3)}
                      sx={{ 
                        backgroundColor: '#0071e3',
                        color: 'white',
                        '&:hover': { backgroundColor: '#0077ed' },
                        cursor: 'pointer'
                      }}
                    />
                  </Box>
                )}
              </>
            )}
            {isLoading && (
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  maxWidth: '80%', 
                  alignSelf: 'flex-start', 
                  backgroundColor: 'white', 
                  borderRadius: 2, 
                  display: 'flex', 
                  gap: 1, 
                  alignItems: 'center' 
                }}
              >
                <SmartToyIcon sx={{ fontSize: 20, color: '#0071e3' }} />
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#0071e3',
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '0s',
                      '@keyframes bounce': {
                        '0%, 80%, 100%': {
                          transform: 'scale(0)',
                          opacity: 0.5,
                        },
                        '40%': {
                          transform: 'scale(1)',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#0071e3',
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '0.2s',
                      '@keyframes bounce': {
                        '0%, 80%, 100%': {
                          transform: 'scale(0)',
                          opacity: 0.5,
                        },
                        '40%': {
                          transform: 'scale(1)',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#0071e3',
                      animation: 'bounce 1.4s infinite ease-in-out both',
                      animationDelay: '0.4s',
                      '@keyframes bounce': {
                        '0%, 80%, 100%': {
                          transform: 'scale(0)',
                          opacity: 0.5,
                        },
                        '40%': {
                          transform: 'scale(1)',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            )}
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || !selectedConvId}
                multiline
                maxRows={3}
              />
              <Button
                variant="contained"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading || !selectedConvId}
                sx={{ 
                  background: '#0071e3', 
                  minWidth: '50px',
                  '&:hover': {
                    background: '#0077ed',
                  },
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
