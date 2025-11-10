# Innova - Prueba Técnica

Aplicación React con TypeScript, Vite y Material UI. Incluye autenticación con Supabase, reconocimiento OCR de matrículas y chatbot conversacional.

## Requisitos

- Node.js 18 o superior
- Cuenta en Supabase (gratis)

## Instalación

Después de descargar el proyecto, instala las dependencias:

```bash
npm install
```

## Configuración de Supabase

He integrado Supabase como base de datos porque permite hasta 200 usuarios gratis, perfecto para una prueba técnica. Como Supabase requiere correos electrónicos reales para la autenticación, creé una tabla `users` adicional para manejar usuarios con nombres de usuario normales sin necesidad de emails.

### Paso 1: Crear cuenta en Supabase

Entra a [supabase.com](https://supabase.com) y crea una cuenta gratuita.

### Paso 2: Crear proyecto

- Crea un nuevo proyecto
- Anota la URL y la API Key (las necesitarás después)

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

### Paso 4: Crear usuario de prueba

En Supabase:

1. Ve a Authentication > Users > Add user
2. Crea un usuario:
   - Email: `test@example.com`
   - Password: `test123456`
   - Marca "Auto Confirm User"

3. Copia el UUID del usuario creado

4. Ve a Table Editor > users > Insert row
   - id: (pega el UUID copiado)
   - username: `testuser`
   - email: `test@example.com`

### Paso 5: Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

Las encuentras en tu proyecto de Supabase: Settings > API

## Ejecutar la aplicación

```bash
npm start
```

La aplicación estará disponible en `http://localhost:5173`

Credenciales de prueba:
- Usuario: `testuser`
- Contraseña: `test123456`

## Scripts disponibles

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

Por qué Supabase: Elegí Supabase porque ofrece 200 usuarios gratis, perfecto para esta prueba técnica. Como requiere emails para autenticación, implementé una tabla `users` adicional para permitir login con username en lugar de email, más apropiado para este contexto.

La aplicación usa arquitectura hexagonal para separar la lógica de negocio de la infraestructura, facilitando el testing y el mantenimiento.
