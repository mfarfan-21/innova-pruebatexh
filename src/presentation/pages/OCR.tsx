import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../application/services/useLanguage';
import { ocrClient, type OCRDetailedResponse } from '../../infrastructure/adapters/ocrClient';
import { LanguageSelector } from '../components/LanguageSelector';
import InnovaLogo from '../../assets/logo/Inova-logo.svg';
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
  const [autoChangeEnabled, setAutoChangeEnabled] = useState(true);
  const [shotHistory, setShotHistory] = useState<ShotHistory[]>([]);

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

  // Cambio automático de imagen cada 20 segundos
  useEffect(() => {
    if (!autoChangeEnabled || availableImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % availableImages.length;
        console.log(`🔄 Cambio automático de imagen: ${availableImages[nextIndex]}`);
        // Limpiar resultado al cambiar de imagen
        setPlateResult(null);
        setDetailedResult(null);
        setError(null);
        return nextIndex;
      });
    }, 20000); // 20 segundos

    return () => clearInterval(interval);
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

      // Enviar a API externa ficticia
      await ocrClient.sendToExternalAPI({
        plate_number: result.plate_number,
        image_name: result.image_name,
        timestamp: timestamp,
        coordinates: result.coordinates,
      });

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
      {/* Language selector in top right */}
      <div className="ocr-language-selector">
        <LanguageSelector />
      </div>

      <button onClick={() => navigate('/')} className="back-button">
        ← {t.welcome}
      </button>

      <div className="ocr-content">
        <div className="ocr-header">
          <h1 className="ocr-title">{t.ocrTitle}</h1>
          <p className="ocr-subtitle">{t.ocrSubtitle}</p>
          
          {/* Control de auto-cambio */}
          <div className="ocr-auto-toggle">
            <label>
              <input
                type="checkbox"
                checked={autoChangeEnabled}
                onChange={(e) => setAutoChangeEnabled(e.target.checked)}
              />
              <span style={{ marginLeft: '8px' }}>
                Cambio automático cada 20s
              </span>
            </label>
          </div>
        </div>

        {/* Historial de Shots en la parte superior */}
        {shotHistory.length > 0 && (
          <div className="shot-history shot-history-top">
            <div className="shot-history-header">
              <h3 className="shot-history-title">Shot History ({shotHistory.length})</h3>
              <button 
                onClick={() => setShotHistory([])} 
                className="clear-history-btn"
                title="Clear history"
              >
                Clear All
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
                      {shot.isValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ocr-card">
          {/* Info de imagen actual */}
          <div className="ocr-image-info">
            <span className="ocr-image-counter">
              Imagen {currentImageIndex + 1} de {availableImages.length}
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
                  <div className="ocr-placeholder">Cargando imágenes...</div>
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
                  ← Anterior
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
                  Siguiente →
                </button>
              </div>
            </div>

            {/* Panel lateral derecho con información */}
            <div className="ocr-info-panel">
              {plateResult && detailedResult ? (
                <div className="ocr-result-card">
                  <p className="ocr-result-label">{t.ocrResult}</p>
                  <p className="ocr-result-value">{plateResult}</p>
                  
                  {/* Información adicional */}
                  <div className="ocr-details">
                    <div className="ocr-detail-row">
                      <span className="ocr-detail-label">Image</span>
                      <span className="ocr-detail-value">{detailedResult.image_name}</span>
                    </div>
                    <div className="ocr-detail-row">
                      <span className="ocr-detail-label">Characters</span>
                      <span className="ocr-detail-value">{detailedResult.num_characters}</span>
                    </div>
                    <div className="ocr-detail-row">
                      <span className="ocr-detail-label">Validation</span>
                      <span className="ocr-detail-value">{detailedResult.is_valid ? 'Valid' : 'Invalid'}</span>
                    </div>
                    {lastShotTime && (
                      <div className="ocr-detail-row">
                        <span className="ocr-detail-label">Timestamp</span>
                        <span className="ocr-detail-value">
                          {new Date(lastShotTime).toLocaleString('es-ES')}
                        </span>
                      </div>
                    )}
                    <div className="ocr-detail-row">
                      <span className="ocr-detail-label">External API</span>
                      <span className="ocr-detail-value ocr-api-status">
                        Sent to external-api.example.com
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ocr-placeholder-panel">
                  <p>Click "Disparar" to recognize a plate</p>
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
      </div>
    </div>
  );
};
