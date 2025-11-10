import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../application/services/useLanguage';
import { useAuth } from '../../application/services/AuthContext';
import { Card, CardContent, CardActions, Button, Box, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InnovaLogo from '../../assets/logo/Inova-logo.svg';
import { LanguageSelector } from '../components/LanguageSelector';
import './Home.css';

export const Home = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="home-container">
      {/* Header Dashboard */}
      <div className="dashboard-header">
        <img src={InnovaLogo} alt="INNOVA" className="dashboard-logo" />
        
        <div className="dashboard-title-section">
          <Typography variant="h4" className="dashboard-title">
            {t.welcome}, {user?.username}
          </Typography>
          <Typography variant="body2" className="dashboard-subtitle">
            {t.subtitle}
          </Typography>
        </div>

        <div className="dashboard-actions">
          <LanguageSelector variant="minimal" />
          <button onClick={handleLogout} className="logout-btn" title={t.logout}>
            <LogoutIcon />
            <span className="logout-text">{t.logout}</span>
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <Box sx={{ maxWidth: 1400, width: '100%', margin: '0 auto' }}>
          {/* Cards Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            {/* Chatbot Card */}
            <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
                  background: 'white',
                  minHeight: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  },
                }}
                onClick={() => navigate('/chatbot')}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', p: 4 }}>
                  <SmartToyIcon sx={{ fontSize: 64, mb: 2, mx: 'auto', color: '#1c3967' }} />
                  <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1c3967' }}>
                    {t.chatbotTitle}
                  </h2>
                  <p style={{ fontSize: '1rem', margin: 0, color: '#3b3635' }}>
                    {t.chatbotDescription}
                  </p>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ChatIcon />}
                    sx={{
                      background: '#1c3967',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#2a4a7c',
                        boxShadow: '0 4px 12px rgba(28, 57, 103, 0.3)',
                      },
                    }}
                  >
                    {t.chatbotOpenButton}
                  </Button>
                </CardActions>
              </Card>

            {/* OCR Card */}
            <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
                  background: 'white',
                  minHeight: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  },
                }}
                onClick={() => navigate('/ocr')}
              >
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', p: 4 }}>
                  <CameraAltIcon sx={{ fontSize: 64, mb: 2, mx: 'auto', color: '#87bc37' }} />
                  <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', fontWeight: 700, color: '#1c3967' }}>
                    {t.ocrTitle}
                  </h2>
                  <p style={{ fontSize: '1rem', margin: 0, color: '#3b3635' }}>
                    {t.ocrSubtitle}
                  </p>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CameraAltIcon />}
                    sx={{
                      background: '#87bc37',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#9acc4a',
                        boxShadow: '0 4px 12px rgba(135, 188, 55, 0.3)',
                      },
                    }}
                  >
                    {t.ocrOpenButton}
                  </Button>
                </CardActions>
              </Card>
          </Box>
        </Box>
      </div>
    </div>
  );
};
