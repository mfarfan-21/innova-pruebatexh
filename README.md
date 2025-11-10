# Innova - Prueba Técnica

Webapp React con TypeScript, Vite y Material UI. Incluye autenticación con Supabase, reconocimiento OCR de matrículas y chatbot conversacional.

## Requisitos

- Node.js 18 o superior
- Cuenta en Supabase (gratis)

### ¿Por qué necesitas Node.js?

Node.js es el motor que ejecuta JavaScript fuera del navegador. Sin él, no puedes correr React ni ninguna aplicación JavaScript moderna. Cuando instalas Node.js, también te viene npm (Node Package Manager), que es como un app store para código: te permite descargar e instalar todas las librerías que usa el proyecto (React, Material UI, TypeScript, etc.) con un solo comando.

En este proyecto uso Node.js v24.11.0, pero cualquier versión 18+ funciona perfectamente. npm es fundamental porque gestiona las 40+ dependencias del proyecto automáticamente.

## Instalación

### Paso 1: Descomprimir el proyecto

Después de descargar el zip, descomprímelo donde quieras. Luego abre una terminal y navega hasta esa carpeta:

```bash
cd /ruta/donde/descomprimiste/innova
```

Por ejemplo, si lo descomprimiste en Descargas:

```bash
cd ~/Downloads/innova
```

### Paso 2: Instalar dependencias

Una vez dentro de la carpeta del proyecto, ejecuta:

```bash
npm install
```

Esto descargará todas las librerías necesarias

### Paso 3: Configurar variables de entorno

Debes tener la version mas nueva de node, en este caso la  v24.11.0

Antes de arrancar, necesitas tener el archivo `.env` con las credenciales de Supabase

### Paso 4: Ejecutar el proyecto

Ya tienes todo listo. Para arrancar el servidor de desarrollo, ejecuta:

```bash
npm start
```

Se abrirá automáticamente en tu navegador en `http://localhost:5173`. Si no se abre solo, copia esa URL en tu navegador.

Credenciales de prueba:
- Usuario: `mfarfan`
- Contraseña: `Mafer1234`


## Configuración de Supabase

He integrado Supabase como base de datos porque permite hasta 200 usuarios gratis, perfecto para una prueba técnica, lo consideraria como un primo hermano de PHPmyadmin. Como Supabase requiere correos electrónicos reales para la autenticación, creé una tabla `users` adicional para manejar usuarios con nombres de usuario normales sin necesidad de emails

### Paso 3: Configurar la base de datos

Ejecuta este SQL en el editor de Supabase (SQL Editor):

```sql
-- Tabla de usuarios personalizada
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);
```

## Scripts disponibles en PJ

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Genera el build de producción
- `npm run preview` - Vista previa del build de producción
- `npm test` - Ejecuta los tests
- `npm run test:ui` - Interfaz visual de tests
- `npm run test:coverage` - Cobertura de tests

## Estructura del proyecto

El proyecto sigue arquitectura hexagonal:

```
src/
├── domain/            - Lógica de negocio (entidades, traducciones)
├── application/       - Casos de uso (servicios de auth, idiomas)
├── infrastructure/    - Conexiones externas (Supabase, APIs)
├── presentation/      - UI (páginas, componentes, estilos)
└── shared/           - Utilidades compartidas
```

## Funcionalidades

- Autenticación con Supabase
- Rutas protegidas
- Multiidioma: Español, Inglés, Catalán
- Reconocimiento OCR de matrículas
- Chatbot conversacional con historial
- Design system con variables CSS

## Tecnologías principales

- React 19 con TypeScript
- Vite como build tool
- Material UI para componentes
- Supabase para autenticación y base de datos

## Notas técnicas

### Por qué estas tecnologías

Elegí React en lugar de Angular porque me resulta más natural y directo. React tiene un ecosistema enorme y encontrar soluciones es muy rápido, además de que los hooks hacen que el código quede limpio y fácil de entender. Angular está genial para proyectos empresariales grandes, pero para esta prueba técnica React me da más agilidad

TypeScript fue una decisión automática. Me encanta tener el autocompletado y que el editor me avise de los errores antes de ejecutar el código. Tambien lo uso para angular.

Para los componentes, Material UI es mi librería favorita (tambien porque lo enlazo con figma muy rapido). Ya trae todo hecho y con un diseño profesional: botones, inputs, modales, todo. Puedo personalizarlos con mi design system de variables CSS y me queda una interfaz consistente en toda la aplicación sin tener que diseñar cada componente desde cero.

### Arquitectura hexagonal

La aplicación usa arquitectura hexagonal para separar la lógica de negocio de la infraestructura, facilitando el testing y el mantenimiento. Esto hace que el código sea más organizado y escalable.
