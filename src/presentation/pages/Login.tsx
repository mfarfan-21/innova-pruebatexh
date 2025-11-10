import { useState } from 'react';
import { useAuth } from '../../application/services/AuthContext';
import { useLanguage } from '../../application/services/useLanguage';
import { LanguageSelector } from '../components/LanguageSelector';
import LoginIcon from '@mui/icons-material/Login';
import InnovaLogo from '../../assets/logo/Inova-logo.svg';
import './Login.css';

export const Login = () => {
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login({ username, password });

    if (!result.success) {
      setError(result.error || t.loginError);
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* Language selector in top right */}
      <div className="login-language-selector">
        <LanguageSelector />
      </div>

      <div className="login-card">
        <img src={InnovaLogo} alt="INNOVA" className="login-logo" />
        
        <div className="login-icon">
          <LoginIcon sx={{ fontSize: 60 }} />
        </div>
        
        <h1 className="login-title">{t.login}</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">{t.email}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : t.loginButton}
          </button>
        </form>
      </div>
    </div>
  );
};
