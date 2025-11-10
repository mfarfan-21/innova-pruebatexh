/**
 * Error Boundary Component
 * Captura errores de React y muestra UI de fallback
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error para debugging (en producción usar servicio de logging)
    if (import.meta.env.DEV) {
      console.error('🚨 ErrorBoundary capturó un error:', error, errorInfo);
    }

    this.setState({ errorInfo });

    // Callback opcional para enviar a servicio de monitoreo
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Usar fallback personalizado si se provee
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback por defecto
      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Oops! Algo salió mal</h1>
            <p className="error-message">
              {this.state.error?.message || 'Ha ocurrido un error inesperado'}
            </p>
            
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="error-details">
                <summary>Detalles técnicos (solo en desarrollo)</summary>
                <pre className="error-stack">
                  {this.state.error?.stack}
                  {'\n\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button onClick={this.handleReset} className="btn-primary">
                Reintentar
              </button>
              <button onClick={() => window.location.href = '/'} className="btn-secondary">
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
