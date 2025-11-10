# Sistema de Diseño - Design System

Sistema de diseño corporativo profesional para Innova con variables CSS y componentes reutilizables.

## 📁 Estructura

```
src/presentation/styles/
├── variables.css    # Variables CSS (colores, tipografía, espaciado, etc.)
└── global.css      # Estilos globales y componentes base
```

## 🎨 Variables Disponibles

### Colores

#### Grises Corporativos
```css
--color-gray-50   → #fafafa  /* Muy claro */
--color-gray-100  → #f5f5f7  /* Claro */
--color-gray-200  → #e5e5e7  /* Bordes */
--color-gray-300  → #d2d2d7  
--color-gray-400  → #c7c7cc
--color-gray-500  → #aeaeb2  /* Muted */
--color-gray-600  → #86868b  /* Secundario */
--color-gray-700  → #6e6e73
--color-gray-800  → #3a3a3c
--color-gray-900  → #1d1d1f  /* Texto principal */
```

#### Azul Corporativo
```css
--color-blue-primary    → #0071e3
--color-blue-hover      → #0077ed
--color-blue-light      → rgba(0, 113, 227, 0.1)
```

#### Estados
```css
--color-success-bg      → #e8f5e9
--color-success-text    → #2e7d32
--color-error-bg        → #ffebee
--color-error-text      → #c62828
```

### Tipografía

#### Font Families
```css
--font-primary → -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
--font-mono    → 'SF Mono', 'Monaco', 'Courier New', monospace
```

#### Font Sizes
```css
--font-size-xs    → 0.65rem   /* 10.4px */
--font-size-sm    → 0.75rem   /* 12px */
--font-size-base  → 0.875rem  /* 14px */
--font-size-md    → 0.95rem   /* 15.2px */
--font-size-lg    → 1.125rem  /* 18px */
--font-size-xl    → 1.25rem   /* 20px */
--font-size-2xl   → 1.5rem    /* 24px */
--font-size-3xl   → 2rem      /* 32px */
--font-size-4xl   → 3rem      /* 48px */
```

#### Font Weights
```css
--font-weight-light     → 300
--font-weight-normal    → 400
--font-weight-medium    → 500
--font-weight-semibold  → 600
--font-weight-bold      → 700
```

#### Letter Spacing
```css
--letter-spacing-tight   → -0.02em
--letter-spacing-normal  → 0
--letter-spacing-wide    → 0.05em
--letter-spacing-wider   → 0.08em
--letter-spacing-widest  → 0.12em
```

### Espaciado

```css
--spacing-xs   → 0.25rem  /* 4px */
--spacing-sm   → 0.5rem   /* 8px */
--spacing-md   → 0.75rem  /* 12px */
--spacing-base → 1rem     /* 16px */
--spacing-lg   → 1.5rem   /* 24px */
--spacing-xl   → 2rem     /* 32px */
--spacing-2xl  → 2.5rem   /* 40px */
--spacing-3xl  → 3rem     /* 48px */
--spacing-4xl  → 4rem     /* 64px */
```

### Border Radius

```css
--radius-sm   → 4px
--radius-base → 6px
--radius-md   → 8px
--radius-lg   → 10px
--radius-xl   → 12px
--radius-2xl  → 16px
--radius-3xl  → 20px
--radius-full → 9999px
```

### Sombras

```css
--shadow-xs   → 0 1px 2px rgba(0, 0, 0, 0.04)
--shadow-sm   → 0 1px 3px rgba(0, 0, 0, 0.04)
--shadow-base → 0 2px 8px rgba(0, 0, 0, 0.06)
--shadow-md   → 0 2px 16px rgba(0, 0, 0, 0.06)
--shadow-lg   → 0 4px 12px rgba(0, 0, 0, 0.1)
--shadow-xl   → 0 8px 24px rgba(0, 0, 0, 0.12)
```

### Transiciones

```css
--transition-fast   → 150ms ease
--transition-base   → 200ms ease
--transition-slow   → 300ms ease
--transition-slower → 500ms ease
```

### Z-Index

```css
--z-base           → 1
--z-dropdown       → 10
--z-sticky         → 20
--z-fixed          → 30
--z-modal-backdrop → 40
--z-modal          → 50
```

## 🧩 Componentes Base

### Botones

```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-ghost">Ghost Button</button>
```

### Cards

```html
<div class="card">Card Content</div>
<div class="card card-hover">Hover Effect</div>
```

### Inputs

```html
<input type="text" class="input" placeholder="Enter text..." />
```

### Badges

```html
<span class="badge badge-success">Success</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-warning">Warning</span>
```

## 📖 Uso en Componentes

### Ejemplo con Variables CSS

```css
/* Antes (valores hardcoded) */
.my-component {
  background: #f5f5f7;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  color: #1d1d1f;
  font-size: 0.875rem;
}

/* Después (usando variables) */
.my-component {
  background: var(--bg-secondary);
  padding: var(--spacing-xl);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
  color: var(--color-gray-900);
  font-size: var(--font-size-base);
}
```

### Clases Utilitarias

```html
<!-- Tipografía -->
<p class="text-lg font-bold tracking-wide text-uppercase">Título</p>

<!-- Colores -->
<span class="text-primary">Texto principal</span>
<span class="text-secondary">Texto secundario</span>
<span class="text-blue">Texto azul</span>

<!-- Animaciones -->
<div class="animate-fadeIn">Aparece con fade</div>
<div class="animate-slideInRight">Desliza desde la derecha</div>
```

## 🎯 Beneficios

1. **Consistencia**: Todos los componentes usan los mismos valores
2. **Mantenibilidad**: Cambiar un color actualiza toda la app
3. **Escalabilidad**: Fácil añadir nuevos componentes
4. **Profesionalismo**: Diseño corporativo coherente
5. **Performance**: Variables CSS nativas (no requiere preprocesador)
6. **Documentación**: Nombres semánticos y autodocumentados

## 🔧 Personalización

Para personalizar el tema, edita `/src/presentation/styles/variables.css`:

```css
:root {
  /* Cambiar color principal */
  --color-blue-primary: #yourcolor;
  
  /* Cambiar font */
  --font-primary: 'Your Font', sans-serif;
  
  /* Ajustar espaciado */
  --spacing-base: 1.25rem; /* Aumentar espaciado base */
}
```

## 📱 Responsive

Los breakpoints recomendados:

```css
/* Mobile First */
@media (max-width: 768px) { /* Tablet y móvil */ }
@media (max-width: 640px) { /* Solo móvil */ }

/* Desktop First */
@media (min-width: 769px) { /* Desktop */ }
@media (min-width: 1024px) { /* Desktop grande */ }
```

## 🚀 Migración de Componentes Existentes

1. Identifica valores hardcoded (colores, tamaños, espaciado)
2. Busca la variable CSS equivalente
3. Reemplaza el valor por `var(--nombre-variable)`
4. Verifica en el navegador que se vea igual
5. Commit los cambios

Ejemplo:
```css
/* Antes */
background: #0071e3;
padding: 2rem;

/* Después */
background: var(--color-blue-primary);
padding: var(--spacing-xl);
```

## 📚 Recursos

- [CSS Variables (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://material.io/design)

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025
