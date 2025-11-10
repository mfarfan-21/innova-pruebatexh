import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../application/services/useLanguage';
import { useAuth } from '../../application/services/AuthContext';
import { Card, CardContent, CardActions, Button, Box } from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import LogoutIcon from '@mui/icons-material/Logout';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InnovaLogo from '../../assets/logo/Inova-logo.svg';
import { ChatbotPopup } from '../components/ChatbotPopup';
import { LanguageSelector } from '../components/LanguageSelector';
import './Home.css';

export const Home = () => {
  const { t, currentLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="home-container">
      {/* Logo */}
      <img src={InnovaLogo} alt="INNOVA" className="home-logo" />

      {/* User Info Bar */}
      {user && (
        <div className="user-info">
          <LanguageSelector variant="minimal" />
          <span className="user-email">{user.username}</span>
          <button onClick={handleLogout} className="logout-btn" title={t.logout}>
            <LogoutIcon />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="content">
        <Box sx={{ maxWidth: 1200, width: '100%' }}>
          {/* Cards Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {/* Welcome Card */}
            <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
                  background: '#009ece', /* Azul cyan INNOVA */
                  color: 'white',
                  minHeight: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 158, 206, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', p: 4 }}>
                  <WavingHandIcon sx={{ fontSize: 64, mb: 2, mx: 'auto' }} />
                  <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', fontWeight: 700 }}>{t.welcome}</h2>
                  <p style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', opacity: 0.9 }}>{t.subtitle}</p>
                  <p style={{ fontSize: '1rem', margin: 0, opacity: 0.8 }}>{t.description}</p>
                </CardContent>
              </Card>

            {/* Chatbot Card */}
            <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
                  background: 'white',
                  minHeight: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', p: 4 }}>
                  <SmartToyIcon sx={{ fontSize: 64, mb: 2, mx: 'auto', color: '#1c3967' }} /> {/* Azul marino INNOVA */}
                  <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1c3967' }}> {/* Azul marino INNOVA */}
                    {currentLanguage === 'es' && 'Chatbot Poético'}
                    {currentLanguage === 'en' && 'Poetic Chatbot'}
                    {currentLanguage === 'ca' && 'Chatbot Poètic'}
                  </h2>
                  <p style={{ fontSize: '1rem', margin: 0, color: '#3b3635' }}> {/* Gris carbón INNOVA */}
                    {currentLanguage === 'es' && 'Habla conmigo sobre poesía y reconocimiento de matrículas'}
                    {currentLanguage === 'en' && 'Talk to me about poetry and license plate recognition'}
                    {currentLanguage === 'ca' && 'Parla amb mi sobre poesia i reconeixement de matrícules'}
                  </p>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ChatIcon />}
                    onClick={() => setChatbotOpen(true)}
                    sx={{
                      background: '#1c3967', /* Azul marino INNOVA */
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(28, 57, 103, 0.2)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#2a4a7c',
                        boxShadow: '0 4px 12px rgba(28, 57, 103, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {currentLanguage === 'es' && 'Abrir Chat'}
                    {currentLanguage === 'en' && 'Open Chat'}
                    {currentLanguage === 'ca' && 'Obrir Xat'}
                  </Button>
                </CardActions>
              </Card>

            {/* OCR Card */}
            <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
                  background: 'white',
                  minHeight: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', p: 4 }}>
                  <CameraAltIcon sx={{ fontSize: 64, mb: 2, mx: 'auto', color: '#87bc37' }} /> {/* Verde INNOVA */}
                  <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1c3967' }}> {/* Azul marino INNOVA */}
                    {t.ocrTitle}
                  </h2>
                  <p style={{ fontSize: '1rem', margin: 0, color: '#3b3635' }}> {/* Gris carbón INNOVA */}
                    {t.ocrSubtitle}
                  </p>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CameraAltIcon />}
                    onClick={() => navigate('/ocr')}
                    sx={{
                      background: '#87bc37', /* Verde INNOVA */
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(135, 188, 55, 0.2)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#9acc4a',
                        boxShadow: '0 4px 12px rgba(135, 188, 55, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {currentLanguage === 'es' && 'Abrir OCR'}
                    {currentLanguage === 'en' && 'Open OCR'}
                    {currentLanguage === 'ca' && 'Obrir OCR'}
                  </Button>
                </CardActions>
              </Card>
          </Box>
        </Box>
      </div>

      {/* Chatbot Popup */}
      {user && (
        <ChatbotPopup
          open={chatbotOpen}
          onClose={() => setChatbotOpen(false)}
          currentLanguage={currentLanguage}
          userId={user.id}
        />
      )}
    </div>
  );
};
