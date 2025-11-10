import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LinearProgress } from '@mui/material';
import { useLanguage } from '../../application/services/useLanguage';
import { ocrClient, type OCRDetailedResponse } from '../../infrastructure/adapters/ocrClient';
import { LanguageSelector } from '../components/LanguageSelector';
import './OCR.css';

interface ShotHistory {
  id: string;
  imageName: string;
  plateNumber: string;
  timestamp: string;
  isValid: boolean;
}

export const OCR = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [plateResult, setPlateResult] = useState<string | null>(null);
  const [detailedResult, setDetailedResult] = useState<OCRDetailedResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [lastShotTime, setLastShotTime] = useState<string | null>(null);
  const [autoChangeEnabled, setAutoChangeEnabled] = useState(false);
  const [shotHistory, setShotHistory] = useState<ShotHistory[]>([]);
  const [progress, setProgress] = useState<number>(0);

  // Cargar lista de imágenes disponibles al montar el componente
  useEffect(() => {
    const loadAvailableImages = async () => {
      try {
        const plates = await ocrClient.getAllPlates(); // Todas las imágenes disponibles
        const imageNames = plates.map(p => p.image_name);
        setAvailableImages(imageNames);
      } catch (err) {
        console.error('Error cargando imágenes:', err);
        setError('Error al cargar la lista de imágenes');
      } finally {
        setIsLoadingImages(false);
      }
    };

    loadAvailableImages();
  }, []);

  // Cambio automático de imagen cada 20 segundos con barra de progreso
  useEffect(() => {
    if (!autoChangeEnabled || availableImages.length === 0) {
      setProgress(0);
      return;
    }

    const INTERVAL_DURATION = 20000; // 20 segundos
    const UPDATE_INTERVAL = 100; // Actualizar cada 100ms
    let elapsed = 0;

    // Reset progress al inicio
    setProgress(0);

    const progressInterval = setInterval(() => {
      elapsed += UPDATE_INTERVAL;
      const newProgress = (elapsed / INTERVAL_DURATION) * 100;
      
      if (newProgress >= 100) {
        setProgress(100);
      } else {
        setProgress(newProgress);
      }
    }, UPDATE_INTERVAL);

    const changeInterval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % availableImages.length;
        console.log(`🔄 Cambio automático de imagen: ${availableImages[nextIndex]}`);
        // Limpiar resultado al cambiar de imagen
        setPlateResult(null);
        setDetailedResult(null);
        setError(null);
        return nextIndex;
      });
      // Reset progress después del cambio
      elapsed = 0;
      setProgress(0);
    }, INTERVAL_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearInterval(changeInterval);
    };
  }, [autoChangeEnabled, availableImages]);

  const handleShoot = async () => {
    if (availableImages.length === 0) return;

    const selectedImage = availableImages[currentImageIndex];
    setIsProcessing(true);
    setError(null);
    setPlateResult(null);
    setDetailedResult(null);

    try {
      // Simular delay de "procesamiento" para efecto visual
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Obtener información detallada de la matrícula
      const result = await ocrClient.recognizePlateDetailed(selectedImage);
      setPlateResult(result.plate_number);
      setDetailedResult(result);

      // Timestamp de la lectura
      const timestamp = new Date().toISOString();
      setLastShotTime(timestamp);

      // Agregar al historial
      const newShot: ShotHistory = {
        id: `${result.image_name}-${timestamp}`,
        imageName: result.image_name,
        plateNumber: result.plate_number,
        timestamp: timestamp,
        isValid: result.is_valid
      };
      setShotHistory(prev => [newShot, ...prev]); // Agregar al inicio

      console.log('✅ Lectura completada:', result.plate_number);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.ocrError);
      console.error('❌ Error en lectura:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualChange = (direction: 'prev' | 'next') => {
    setCurrentImageIndex((prev) => {
      let nextIndex;
      if (direction === 'next') {
        nextIndex = (prev + 1) % availableImages.length;
      } else {
        nextIndex = prev === 0 ? availableImages.length - 1 : prev - 1;
      }
      setPlateResult(null);
      setDetailedResult(null);
      setError(null);
      return nextIndex;
    });
  };

  const getImageUrl = (imageName: string) => {
    // Cargar imagen desde el backend usando ocrClient
    return ocrClient.getImageUrl(imageName);
  };

  const currentImage = availableImages[currentImageIndex] || '';

  return (
    <div className="ocr-container">
      {/* Fixed header con controles */}
      <div className="ocr-fixed-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← {t.welcome}
        </button>
        
        <div className="ocr-language-selector">
          <LanguageSelector />
        </div>
      </div>

      <div className="ocr-content">
        {/* Control de auto-cambio encerrado en contenedor elegante */}
        <div className="auto-change-container">
          <label className="auto-change-label">
            <input
              type="checkbox"
              checked={autoChangeEnabled}
              onChange={(e) => setAutoChangeEnabled(e.target.checked)}
            />
            <span>{t.ocrAutoChange}</span>
          </label>
          
          {/* Barra de progreso */}
          {autoChangeEnabled && availableImages.length > 0 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <span style={{ fontSize: '0.875rem', color: '#666' }}>
                  {t.ocrNextChange} {Math.ceil((100 - progress) / 5)} {t.ocrSeconds}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#009ece', fontWeight: 500 }}>
                  {Math.round(progress)}%
                </span>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: '#009ece',
                  }
                }}
              />
            </Box>
          )}
        </div>

        <div className="ocr-card">
          {/* Título dentro del card */}
          <h2 className="ocr-card-title">{t.ocrSubtitle}</h2>
          
          {/* Info de imagen actual */}
          <div className="ocr-image-info">
            <span className="ocr-image-counter">
              {t.ocrImageCounter} {currentImageIndex + 1} {t.ocrOf} {availableImages.length}
            </span>
            <span className="ocr-image-name">{currentImage}</span>
          </div>

          {/* Layout principal: imagen a la izquierda, detalles a la derecha */}
          <div className="ocr-main-layout">
            {/* Sección izquierda: Imagen y controles */}
            <div className="ocr-image-section">
              {/* Contenedor de imagen */}
              <div className="ocr-image-container">
                {isLoadingImages ? (
                  <div className="ocr-placeholder">{t.ocrLoadingImages}</div>
                ) : currentImage ? (
                  <img
                    src={getImageUrl(currentImage)}
                    alt={currentImage}
                    className="ocr-image"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/800x450/0071e3/ffffff?text=${encodeURIComponent(currentImage)}`;
                    }}
                  />
                ) : (
                  <div className="ocr-placeholder">{t.ocrSelectImage}</div>
                )}
              </div>

              {/* Controles de navegación */}
              <div className="ocr-navigation">
                <button
                  onClick={() => handleManualChange('prev')}
                  disabled={isLoadingImages || availableImages.length === 0}
                  className="ocr-button ocr-button-secondary"
                >
                  ← {t.ocrPrevious}
                </button>
                
                <button
                  onClick={handleShoot}
                  disabled={!currentImage || isProcessing}
                  className="ocr-button ocr-button-primary"
                >
                  {isProcessing ? t.ocrProcessing : t.ocrShoot}
                </button>

                <button
                  onClick={() => handleManualChange('next')}
                  disabled={isLoadingImages || availableImages.length === 0}
                  className="ocr-button ocr-button-secondary"
                >
                  {t.ocrNext} →
                </button>
              </div>
            </div>

            {/* Panel lateral derecho con información */}
            <div className="ocr-info-panel">
              {plateResult && detailedResult ? (
                <div className="ocr-result-card">
                  <p className="ocr-result-label">{t.ocrResult}</p>
                  <p className="ocr-result-value">{plateResult}</p>
                  
                  {/* Tabla formal estilo Apple */}
                  <div className="apple-table">
                    <div className="apple-table-row">
                      <div className="apple-table-cell apple-table-header">{t.ocrDetailsImage}</div>
                      <div className="apple-table-cell">{detailedResult.image_name}</div>
                    </div>
                    <div className="apple-table-row">
                      <div className="apple-table-cell apple-table-header">{t.ocrDetailsCharacters}</div>
                      <div className="apple-table-cell">{detailedResult.num_characters}</div>
                    </div>
                    <div className="apple-table-row">
                      <div className="apple-table-cell apple-table-header">{t.ocrDetailsValidation}</div>
                      <div className="apple-table-cell">
                        <span className={`validation-badge ${detailedResult.is_valid ? 'valid' : 'invalid'}`}>
                          {detailedResult.is_valid ? t.ocrValidationValid : t.ocrValidationInvalid}
                        </span>
                      </div>
                    </div>
                    {lastShotTime && (
                      <div className="apple-table-row">
                        <div className="apple-table-cell apple-table-header">{t.ocrDetailsTimestamp}</div>
                        <div className="apple-table-cell">
                          {new Date(lastShotTime).toLocaleString('es-ES')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="ocr-placeholder-panel">
                  <p>{t.ocrClickShoot}</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="ocr-error">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historial de Shots debajo de todo el card */}
        {shotHistory.length > 0 && (
          <div className="shot-history shot-history-bottom">
            <div className="shot-history-header">
              <h3 className="shot-history-title">{t.ocrShotHistory} ({shotHistory.length})</h3>
              <button 
                onClick={() => setShotHistory([])} 
                className="clear-history-btn"
                title={t.ocrClearHistory}
              >
                {t.ocrClearHistory}
              </button>
            </div>
            <div className="shot-history-grid">
              {shotHistory.map((shot) => (
                <div key={shot.id} className="shot-history-item">
                  <div className="shot-thumbnail">
                    <img
                      src={getImageUrl(shot.imageName)}
                      alt={shot.plateNumber}
                      className="shot-thumbnail-img"
                    />
                    <div className="shot-overlay">
                      <span className="shot-plate">{shot.plateNumber}</span>
                    </div>
                  </div>
                  <div className="shot-info">
                    <span className="shot-time">
                      {new Date(shot.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                    <span className={`shot-status ${shot.isValid ? 'valid' : 'invalid'}`}>
                      {shot.isValid ? t.ocrValidationValid : t.ocrValidationInvalid}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
