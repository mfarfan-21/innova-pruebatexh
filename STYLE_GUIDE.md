# Guía de Estilos - Proyecto INNOVA

## 📋 Principios de Arquitectura CSS

### 1. **Jerarquía de Estilos**
```
global.css (base)
  ↓
variables.css (design tokens)
  ↓
[Page].css (estilos específicos de página)
```

### 2. **Nomenclatura BEM (Block Element Modifier)**
```css
/* ✅ Correcto */
.card { }
.card__header { }
.card__title { }
.card--featured { }

/* ❌ Incorrecto */
.cardHeader { }
.card-header-title { }
```

### 3. **Uso de Variables CSS**
```css
/* ✅ Correcto - Usar variables del design system */
.button {
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-blue-primary);
  border-radius: var(--radius-md);
}

/* ❌ Incorrecto - Valores hardcodeados */
.button {
  padding: 12px 24px;
  color: #009ece;
  border-radius: 8px;
}
```

### 4. **Evitar !important**
```css
/* ✅ Correcto - Usar especificidad adecuada */
.dashboard-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

/* ❌ Incorrecto - Abusar de !important */
.dashboard-title {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
}
```

### 5. **Responsive Design**
```css
/* ✅ Correcto - Mobile first */
.container {
  padding: var(--spacing-base);
}

@media (min-width: 768px) {
  .container {
    padding: var(--spacing-xl);
  }
}

/* ❌ Incorrecto - Desktop first */
.container {
  padding: var(--spacing-xl);
}

@media (max-width: 768px) {
  .container {
    padding: var(--spacing-base);
  }
}
```

## 🎨 Design Tokens (Variables CSS)

### Colores
- **INNOVA Brand**: `--color-innova-cyan`, `--color-innova-navy`, `--color-innova-green`
- **Grises**: `--color-gray-[50-900]`
- **Estados**: `--color-success`, `--color-error`, `--color-warning`

### Espaciado
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **base**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 40px
- **3xl**: 48px

### Tipografía
- **Familia**: `var(--font-primary)` (System fonts)
- **Tamaños**: `var(--font-size-[xs|sm|base|md|lg|xl|2xl|3xl|4xl])`
- **Pesos**: `var(--font-weight-[light|normal|medium|semibold|bold])`

### Sombras
- **xs, sm, base**: Sutiles
- **md, lg, xl**: Pronunciadas
- **blue, cyan, green, coral**: Con color de marca

## 📐 Estructura de Archivos CSS

### Orden de Propiedades
```css
.elemento {
  /* 1. Posicionamiento */
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;

  /* 2. Box Model */
  display: flex;
  width: 100%;
  height: auto;
  margin: 0;
  padding: var(--spacing-base);
  border: var(--border-thin) solid var(--color-gray-300);
  border-radius: var(--radius-md);

  /* 3. Tipografía */
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  color: var(--color-gray-900);
  text-align: left;

  /* 4. Visual */
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  opacity: 1;

  /* 5. Transiciones y Animaciones */
  transition: all var(--transition-base);
  cursor: pointer;
}
```

### Organización de Secciones
```css
/**
 * [Nombre del Componente/Página]
 * Descripción breve
 */

/* ========== LAYOUT PRINCIPAL ========== */
.componente-container { }

/* ========== HEADER ========== */
.componente-header { }
.componente-title { }

/* ========== CONTENT ========== */
.componente-content { }

/* ========== FOOTER ========== */
.componente-footer { }

/* ========== ESTADOS ========== */
.componente--loading { }
.componente--error { }

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  .componente-container { }
}
```

## 🚀 Mejores Prácticas

### 1. **Consistencia en Nombres**
- Prefijo claro para cada componente
- Usar kebab-case
- Evitar abreviaciones confusas

### 2. **Reutilización**
- Crear clases utilitarias en `global.css`
- Extraer patrones repetidos a variables
- Usar mixins (si se usa SCSS/SASS)

### 3. **Performance**
- Evitar selectores muy específicos
- Minimizar el uso de `*` selector
- Usar transform y opacity para animaciones

### 4. **Accesibilidad**
- Garantizar contraste adecuado
- Proporcionar focus states visibles
- Usar rem/em para tamaños de fuente

### 5. **Mantenibilidad**
- Comentar secciones claramente
- Agrupar estilos relacionados
- Documentar magic numbers

## 🔍 Checklist de Revisión

- [ ] ¿Usa variables CSS del design system?
- [ ] ¿Evita valores hardcodeados?
- [ ] ¿Minimiza el uso de !important?
- [ ] ¿Tiene comentarios claros?
- [ ] ¿Sigue nomenclatura consistente?
- [ ] ¿Es responsive?
- [ ] ¿Está ordenado lógicamente?
- [ ] ¿No tiene código duplicado?

## 📚 Referencias

- [CSS Guidelines](https://cssguidelin.es/)
- [BEM Methodology](http://getbem.com/)
- [CSS Architecture](https://www.smashingmagazine.com/2016/06/css-architecture-for-scalable-long-lived-projects/)
