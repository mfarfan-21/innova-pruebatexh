import { Select, MenuItem, FormControl } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '../../application/services/useLanguage';
import type { Language } from '../../shared/constants/translations';

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal';
}

export const LanguageSelector = ({ variant = 'default' }: LanguageSelectorProps) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  if (variant === 'minimal') {
    return (
      <FormControl size="small" sx={{ minWidth: 80 }}>
        <Select
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value as Language)}
          startAdornment={<LanguageIcon sx={{ fontSize: 18, mr: 0.5, color: '#86868b' }} />}
          sx={{
            fontSize: '0.875rem',
            borderRadius: '8px',
            background: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover': {
              background: '#f5f5f7',
            },
          }}
        >
          {availableLanguages.map((lang) => (
            <MenuItem key={lang} value={lang}>
              {lang.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 100 }}>
      <Select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value as Language)}
        startAdornment={<LanguageIcon sx={{ fontSize: 20, mr: 1 }} />}
        sx={{
          fontSize: '0.875rem',
          borderRadius: '8px',
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {availableLanguages.map((lang) => (
          <MenuItem key={lang} value={lang}>
            {lang.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
