import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Paper, Typography, Chip, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useLanguage } from '../../application/services/useLanguage';
import { useAuth } from '../../application/services/AuthContext';
import { chatbotClient } from '../../infrastructure/adapters/chatbotClient';
import { ConversationList } from '../components/ConversationList';
import { LanguageSelector } from '../components/LanguageSelector';
import type { Conversation, Message } from '../../shared/types';
import './Chatbot.css';

export const Chatbot = () => {
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cargar conversaciones al montar
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Cargar mensajes cuando cambia la conversación seleccionada
  useEffect(() => {
    if (selectedConvId) {
      loadMessages(selectedConvId);
    } else {
      setMessages([]);
    }
  }, [selectedConvId]);

  // Auto-scroll a los nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const data = await chatbotClient.getConversations(user.id);
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
    if (!user) return;

    try {
      const title = `Conversación ${new Date().toLocaleDateString()}`;
      const newConv = await chatbotClient.createConversation(user.id, title);
      setConversations([newConv, ...conversations]);
      setSelectedConvId(newConv.id);
      
      // Enviar mensaje de bienvenida automático
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
      const minDelay = 1500;

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
    <div className="chatbot-container">
      {/* Fixed header */}
      <div className="chatbot-fixed-header">
        <div className="header-left">
          <button onClick={() => navigate('/')} className="back-button">
            ← {t.welcome}
          </button>
        </div>
        
        <div className="chatbot-language-selector">
          <LanguageSelector />
        </div>
      </div>

      {/* Botón flotante de menú (móvil) */}
      <button 
        className="mobile-menu-fab" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <MenuIcon className="mobile-menu-fab-icon" fontSize="small" />
        <span className="mobile-menu-fab-text">Historial</span>
      </button>

      <div className="chatbot-content">
        <div className="chatbot-card">
          <h2 className="chatbot-card-title">
            <SmartToyIcon sx={{ mr: 1 }} />
            Chatbot Poético
          </h2>

          <div className="chatbot-main-layout">
            {/* Sidebar: Historial de conversaciones */}
            <div className={`chatbot-sidebar ${sidebarOpen ? 'open' : ''}`}>
              {sidebarOpen && (
                <IconButton 
                  className="close-sidebar-button"
                  onClick={() => setSidebarOpen(false)}
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              )}
              <ConversationList
                conversations={conversations}
                selectedId={selectedConvId}
                onSelect={(id) => {
                  setSelectedConvId(id);
                  setSidebarOpen(false);
                }}
                onNew={createNewConversation}
                onDelete={deleteConversation}
              />
            </div>

            {/* Área de chat */}
            <div className="chatbot-chat-area">
              {/* Mensajes */}
              <div className="chatbot-messages">
                {!selectedConvId ? (
                  <div className="chatbot-empty-state">
                    <SmartToyIcon sx={{ fontSize: 60, mb: 2, color: '#999' }} />
                    <Typography color="#999">Crea una nueva conversación para empezar</Typography>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="chatbot-empty-state">
                    <SmartToyIcon sx={{ fontSize: 60, mb: 2, color: '#999' }} />
                    <Typography color="#999">¡Pregúntame sobre poesía y matrículas!</Typography>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <Paper
                        key={msg.id}
                        elevation={1}
                        className={`message-bubble ${msg.role}`}
                      >
                        {msg.role === 'assistant' && <SmartToyIcon className="message-icon" />}
                        <Typography variant="body2" className="message-content">
                          {msg.content}
                        </Typography>
                        {msg.role === 'user' && <PersonIcon className="message-icon" />}
                      </Paper>
                    ))}
                    
                    {/* Opciones sugeridas */}
                    {messages.length === 1 && messages[0].role === 'assistant' && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
                        <Chip
                          label={t.chatbotOption1}
                          onClick={() => handleSuggestedOption(t.chatbotOption1)}
                          className="suggested-chip"
                        />
                        <Chip
                          label={t.chatbotOption2}
                          onClick={() => handleSuggestedOption(t.chatbotOption2)}
                          className="suggested-chip"
                        />
                        <Chip
                          label={t.chatbotOption3}
                          onClick={() => handleSuggestedOption(t.chatbotOption3)}
                          className="suggested-chip"
                        />
                      </Box>
                    )}
                  </>
                )}
                
                {/* Loading indicator */}
                {isLoading && (
                  <Paper elevation={1} className="message-bubble assistant">
                    <SmartToyIcon className="message-icon" />
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </Paper>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="chatbot-input-area">
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
                  className="chatbot-input"
                />
                <Button
                  variant="contained"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading || !selectedConvId}
                  className="chatbot-send-button"
                >
                  <SendIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
