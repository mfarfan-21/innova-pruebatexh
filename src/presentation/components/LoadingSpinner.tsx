/**
 * Loading Spinner Component
 * Componente de carga profesional y reutilizable
 * 
 * @example
 * // Loading básico
 * <LoadingSpinner />
 * 
 * @example
 * // Loading con mensaje personalizado
 * <LoadingSpinner message="Cargando datos..." />
 * 
 * @example
 * // Loading pantalla completa
 * <LoadingSpinner fullscreen message="Iniciando sesión..." />
 * 
 * @example
 * // Loading pequeño inline
 * <LoadingSpinner size="small" message="Guardando..." />
 */

import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  /**
   * Mensaje a mostrar debajo del spinner
   */
  message?: string;
  
  /**
   * Tamaño del spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Si es true, ocupa toda la pantalla con overlay
   * @default false
   */
  fullscreen?: boolean;
  
  /**
   * Clase CSS adicional
   */
  className?: string;
}

export const LoadingSpinner = ({ 
  message = 'Cargando...', 
  size = 'medium',
  fullscreen = false,
  className = ''
}: LoadingSpinnerProps) => {
  const containerClass = [
    'loading-spinner-container',
    fullscreen ? 'fullscreen' : '',
    className
  ].filter(Boolean).join(' ');

  const spinnerClass = [
    'loading-spinner',
    size !== 'medium' ? size : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      <div className={spinnerClass} role="status" aria-label="Loading" />
      {message && <p className="loading-text">{message}</p>}
    </div>
  );
};
