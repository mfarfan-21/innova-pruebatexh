/**
 * Tests para LoadingSpinner Component
 * 
 * ESTRATEGIA DE TESTING:
 * - Test de renderizado básico
 * - Test de diferentes tamaños
 * - Test de modo fullscreen
 * - Test de mensajes personalizados
 * - Test de accesibilidad
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('debe renderizar con configuración por defecto', () => {
    const { container, getByText } = render(<LoadingSpinner />);
    
    expect(getByText('Cargando...')).toBeInTheDocument();
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
    expect(container.querySelector('.loading-spinner-container')).toBeInTheDocument();
  });

  it('debe renderizar con mensaje personalizado', () => {
    const { getByText } = render(<LoadingSpinner message="Procesando datos..." />);
    
    expect(getByText('Procesando datos...')).toBeInTheDocument();
  });

  it('debe renderizar sin mensaje cuando message es vacío', () => {
    const { container } = render(<LoadingSpinner message="" />);
    
    expect(container.querySelector('.loading-text')).not.toBeInTheDocument();
  });

  it('debe aplicar clase small correctamente', () => {
    const { container } = render(<LoadingSpinner size="small" />);
    
    expect(container.querySelector('.loading-spinner.small')).toBeInTheDocument();
  });

  it('debe aplicar clase large correctamente', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    
    expect(container.querySelector('.loading-spinner.large')).toBeInTheDocument();
  });

  it('debe aplicar clase fullscreen correctamente', () => {
    const { container } = render(<LoadingSpinner fullscreen />);
    
    expect(container.querySelector('.loading-spinner-container.fullscreen')).toBeInTheDocument();
  });

  it('debe aplicar clases CSS adicionales', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    
    expect(container.querySelector('.loading-spinner-container.custom-class')).toBeInTheDocument();
  });

  it('debe tener atributos de accesibilidad correctos', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('.loading-spinner');
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('debe combinar múltiples props correctamente', () => {
    const { container, getByText } = render(
      <LoadingSpinner 
        size="large" 
        fullscreen 
        message="Cargando aplicación..." 
        className="app-loader"
      />
    );
    
    expect(getByText('Cargando aplicación...')).toBeInTheDocument();
    expect(container.querySelector('.loading-spinner.large')).toBeInTheDocument();
    expect(container.querySelector('.loading-spinner-container.fullscreen.app-loader')).toBeInTheDocument();
  });
});
