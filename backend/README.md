# Backend de Innova - Servidor FastAPI

## Introducción

Este es el servidor backend de la aplicación Innova, construido con FastAPI y siguiendo una arquitectura hexagonal. El sistema proporciona tres funcionalidades principales: autenticación de usuarios mediante Supabase, un chatbot conversacional multiidioma, y reconocimiento OCR de matrículas vehiculares

## Arquitectura del Proyecto

### Por qué Arquitectura Hexagonal

He implementado una arquitectura hexagonal que separa claramente las responsabilidades del sistema. Esta arquitectura permite que la lógica de negocio sea independiente de los frameworks y tecnologías específicas, facilitando el mantenimiento y las futuras modificaciones

```
backend/
├── src/
│   ├── domain/          # Capa de dominio: entidades y reglas de negocio
│   ├── application/     # Capa de aplicación: casos de uso y servicios
│   ├── infrastructure/  # Capa de infraestructura: adaptadores y conexiones externas
│   └── presentation/    # Capa de presentación: DTOs y contratos de API
```

### Estructura Detallada

**Domain (Dominio)**
- `entities/`: Modelos de datos puros (User, Plate, Message, Conversation)
- `repositories/`: Interfaces que definen contratos para acceso a datos
- `responses/`: Respuestas predefinidas del chatbot en español, inglés y catalán

**Application (Aplicación)**
- `services/`: Lógica de negocio (AuthService, ChatbotService, OCRService, ConversationService)
- `use_cases/`: Casos de uso específicos como login_user

**Infrastructure (Infraestructura)**
- `adapters/inbound/api/routes/`: Endpoints de FastAPI (auth, chatbot, conversation, ocr)
- `adapters/outbound/database/`: Implementación de repositorios con Supabase
- `adapters/outbound/file/`: Lectura del archivo plates.dat

**Presentation (Presentación)**
- `dto/`: Data Transfer Objects para requests y responses

## Decisiones Técnicas

### Almacenamiento de Imágenes: Cloudinary


La solución implementada fue alojar todas las imágenes en **Cloudinary**, un servicio de almacenamiento y gestión de imágenes en la nube. Cloudinary proporciona:

- Almacenamiento persistente que no se pierde con reinicios del servidor
- URLs públicas para acceder a las imágenes desde cualquier cliente


### Deployment: Render

Para mantener el servidor disponible 24/7 sin necesidad de mantener una máquina local en ejecución constante, el backend está desplegado en **Render**
El servidor en producción está disponible en: `https://innova-pruebatexh.onrender.com`

### Sistema OCR

El sistema OCR no realiza reconocimiento en tiempo real. Las imágenes ya fueron procesadas previamente y los resultados están almacenados en el archivo `assets/plates.dat`. Este archivo contiene:

- Nombre de cada imagen procesada
- Coordenadas de la matrícula detectada (4 puntos)
- Caracteres reconocidos con sus posiciones y nivel de confianza

Este enfoque tiene varias ventajas:
- Respuestas instantáneas sin procesamiento pesado
- Menor consumo de recursos del servidor
- Resultados consistentes y verificados
- Costos operacionales reducidos

## Instalación Local en Windows

### Requisitos Previos

Necesita tener **Python 3.9 o superior** instalado en su sistema. Para verificar si ya lo tiene:

```bash
python --version
```

### Paso 1: Obtener el Código

Navegue a la carpeta del backend usando la terminal de Windows (CMD o PowerShell):

```bash
cd C:\ruta\donde\descargó\innova\backend
```

Por ejemplo:
```bash
cd C:\Users\TuUsuario\Downloads\innova\backend
```

### Paso 2: Crear Entorno Virtual

Un entorno virtual es un espacio aislado donde se instalarán las dependencias del proyecto sin afectar la instalación global de Python. Ejecute:

```bash
python -m venv venv
```

Esto creará una carpeta `venv` con una instalación independiente de Python.

### Paso 3: Activar el Entorno Virtual

Cuando el entorno esté activo, verá `(venv)` al inicio de la línea de comandos:
```
(venv) C:\Users\TuUsuario\Downloads\innova\backend>
```

### Paso 4: Instalar Dependencias

Con el entorno virtual activo, instale todas las bibliotecas necesarias:

```bash
pip install -r requirements.txt
```

### Paso 5: Configuración de Variables de Entorno

El proyecto incluye un archivo `.env` con las credenciales necesarias para Supabase y Cloudinary. Normalmente este archivo no debería estar en el repositorio por seguridad, pero se incluye en este caso para facilitar la ejecución inmediata del proyecto

### Paso 6: Iniciar el Servidor

Navegue a la carpeta `src` y ejecute el servidor:

```bash
cd src
python main.py
```

Alternativamente, puede usar uvicorn directamente:

```bash
cd src
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

La opción `--reload` hace que el servidor se reinicie automáticamente cuando detecta cambios en el código, útil durante el desarrollo.

### Paso 7: Verificar Funcionamiento

Si el servidor se inició correctamente, verá una salida similar a:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Abra su navegador web y visite: `http://localhost:8000`

Debería ver una respuesta JSON:
```json
{
  "status": "ok",
  "message": "Innova API",
  "version": "1.0.0"
}
```

### Paso 8: Explorar la Documentación Interactiva

FastAPI genera automáticamente documentación interactiva de la API. Puede acceder a ella en:

**Swagger UI:**
```
http://localhost:8000/docs
```

**ReDoc:**
```
http://localhost:8000/redoc
```

Desde la interfaz de Swagger puede:
- Ver todos los endpoints disponibles
- Leer la documentación de cada endpoint
- Probar las llamadas directamente desde el navegador
- Ver ejemplos de requests y responses

## Endpoints Disponibles

### Autenticación

**POST /auth/login**
```json
{
  "username": "mfarfan",
  "password": "Mafer1234"
}
```
Verifica credenciales y devuelve un token JWT para autenticación.

### Chatbot

**POST /chatbot/chat**
```json
{
  "user_id": "f4692f36-65e4-40ac-bc0f-3e0e7be6e5fa",
  "message": "¿Qué es la poesía?",
  "conversation_id": "123",
  "language": "es"
}
```
Envía un mensaje al chatbot y recibe una respuesta. El chatbot tiene conocimientos sobre poesía y matrículas vehiculares en tres idiomas: español, inglés y catalán.

### Conversaciones

**GET /conversations/{user_id}**

Lista todas las conversaciones de un usuario específico.

**POST /conversations**
```json
{
  "user_id": "f4692f36-65e4-40ac-bc0f-3e0e7be6e5fa",
  "title": "Nueva conversación"
}
```
Crea una nueva conversación para el usuario.

**DELETE /conversations/{conversation_id}**

Elimina una conversación y todos sus mensajes asociados.

### OCR

**GET /ocr/plates**

Devuelve la lista completa de matrículas disponibles en el sistema.

**POST /ocr/recognize**
```json
{
  "image_name": "MD7193_lane1_97_20221102_145250.jpg"
}
```
Procesa una imagen específica y devuelve la matrícula reconocida junto con información detallada sobre caracteres y coordenadas.

## Comandos Útiles

### Detener el Servidor

Presione `Ctrl + C` en la terminal donde está ejecutándose el servidor.

### Desactivar el Entorno Virtual

Cuando termine de trabajar:

```bash
deactivate
```

### Actualizar Dependencias

Si agrega nuevas bibliotecas al proyecto:

```bash
pip install nombre-biblioteca
pip freeze > requirements.txt
```

### Verificar Dependencias Instaladas

Para ver todas las bibliotecas instaladas en el entorno virtual:

```bash
pip list
```

## Solución de Problemas Comunes

### Error: "ModuleNotFoundError"

Este error indica que el entorno virtual no está activado o las dependencias no están instaladas.

**Solución:**
```bash
# Activar entorno virtual
venv\Scripts\activate.bat  # CMD
# o
venv\Scripts\Activate.ps1  # PowerShell

# Instalar dependencias
pip install -r requirements.txt
```

### Error: "Address already in use"

El puerto 8000 ya está siendo utilizado por otro proceso.

**Solución:** Cambiar el puerto de ejecución:
```bash
uvicorn main:app --reload --port 8001
```

O terminar el proceso que está usando el puerto 8000:
```bash
# En PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

# En CMD
netstat -ano | findstr :8000
taskkill /PID [número_de_PID] /F
```

### Error: "Cannot connect to Supabase"

Verifique que el archivo `.env` existe en la carpeta `backend` y contiene las variables necesarias.

**Solución:**
```bash
# Verificar que el archivo existe
dir .env

# Verificar contenido (PowerShell)
Get-Content .env

# Verificar contenido (CMD)
type .env
```


### Error de permisos en PowerShell

Si recibe "cannot be loaded because running scripts is disabled":

**Solución:**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

