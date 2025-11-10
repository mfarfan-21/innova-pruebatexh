# Backend - Innova API

FastAPI backend con autenticación Supabase y chatbot simple.

## 🚀 Instalación

```bash
cd backend
pip install -r requirements.txt
```

## ⚙️ Configuración

Crear `.env`:

```bash
SUPABASE_URL=tu_url_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_key_aqui
```

## 🏃 Ejecutar

```bash
cd backend/src
python main.py
```

El servidor estará en: `http://localhost:8000`

## 📚 Endpoints

### Autenticación
- `POST /auth/login` - Login de usuario
- `POST /auth/logout` - Logout
- `GET /auth/me` - Info del usuario actual

### Chatbot
- `POST /chatbot/message` - Enviar mensaje al chatbot

Ver [CHATBOT_README.md](./CHATBOT_README.md) para detalles del chatbot.

## 🧪 Probar Chatbot

```bash
cd backend
python test_chatbot.py
```

## 📖 Documentación API

Una vez ejecutando, ve a:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
