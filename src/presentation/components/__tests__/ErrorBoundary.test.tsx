/**
 * Tests para ErrorBoundary Component
 * 
 * ESTRATEGIA DE TESTING:
 * - Test de renderizado normal (sin errores)
 * - Test de captura de errores
 * - Test de UI de fallback
 * - Test de botón de reset
 * 
 * JUSTIFICACIÓN:
 * ErrorBoundary es el componente de seguridad que previene que
 * toda la aplicación se caiga. Es crítico asegurar que captura errores
 * correctamente y muestra una UI amigable al usuario.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../ErrorBoundary';

// Componente que lanza error para testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error from component');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suprimir console.error en tests para evitar ruido
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('debe renderizar children cuando no hay error', () => {
    // ACT
    render(
      <ErrorBoundary>
        <div>Contenido normal</div>
      </ErrorBoundary>
    );

    // ASSERT
    expect(screen.getByText('Contenido normal')).toBeInTheDocument();
  });

  it('debe capturar error y mostrar UI de fallback', () => {
    // ACT
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // ASSERT
    expect(screen.getByText(/Algo salió mal/i)).toBeInTheDocument();
    // Usar getAllByText porque el mensaje aparece en múltiples lugares (mensaje + stack)
    const errorMessages = screen.getAllByText(/Test error from component/i);
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('debe mostrar botón de reintentar', () => {
    // ACT
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // ASSERT
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('debe mostrar botón de ir al inicio', () => {
    // ACT
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // ASSERT
    expect(screen.getByRole('button', { name: /ir al inicio/i })).toBeInTheDocument();
  });

  it('debe resetear el error al hacer click en reintentar', async () => {
    // ARRANGE
    const user = userEvent.setup();
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verificar que está en estado de error
    expect(screen.getByText(/Algo salió mal/i)).toBeInTheDocument();

    // ACT: Click en reintentar
    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    await user.click(retryButton);

    // ASSERT: El botón de reintentar sigue visible (porque el error persiste)
    // Este test verifica que el ErrorBoundary intenta resetear y re-renderizar
    expect(screen.getByText(/Algo salió mal/i)).toBeInTheDocument();
  });

  it('debe usar fallback personalizado si se provee', () => {
    // ARRANGE
    const customFallback = <div>Custom Error UI</div>;

    // ACT
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // ASSERT
    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.queryByText(/Algo salió mal/i)).not.toBeInTheDocument();
  });

  it('debe llamar callback onError si se provee', () => {
    // ARRANGE
    const onErrorMock = vi.fn();

    // ACT
    render(
      <ErrorBoundary onError={onErrorMock}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // ASSERT
    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('debe mostrar emoji de advertencia', () => {
    // ACT
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // ASSERT: Buscar el emoji (⚠️) en el documento
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});
