# Backend - Asistente Turístico Colombia 🇨🇴

Este es el backend para la aplicación de Asistente Turístico. Está construido con **Python** y **Flask**, y utiliza la inteligencia artificial de **Google Gemini** para proporcionar recomendaciones turísticas personalizadas.

## 🚀 Características

*   **API REST**: Proporciona un endpoint `/api/chat` para interactuar con el chatbot.
*   **Google Gemini**: Utiliza el modelo `gemini-2.5-flash` para generar respuestas naturales y útiles.
*   **Respuestas Estructuradas**: Devuelve las respuestas en formato JSON, separando el texto conversacional de la lista de lugares recomendados.
*   **CORS**: Configurado para permitir peticiones desde el frontend.
*   **Producción**: Listo para despliegue con `gunicorn`.

## 📂 Estructura del Proyecto

```text
backend/
├── chatbot/             # Lógica del chatbot (si aplica)
├── static/              # Archivos estáticos
├── templates/           # Plantillas HTML (si aplica)
├── .env                 # Variables de entorno (API Keys)
├── main.py              # Punto de entrada de la aplicación Flask
├── requirements.txt     # Dependencias del proyecto
└── README.md            # Documentación
```

## 🛠️ Instalación y Configuración

1.  **Clonar el repositorio** (si no lo has hecho):
    ```bash
    git clone <tu-repo>
    cd backend
    ```

2.  **Crear un entorno virtual** (opcional pero recomendado):
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```

3.  **Instalar dependencias**:
    ```bash
    pip install -r requirements.txt
    ```
    *Principales dependencias:* `Flask`, `flask-cors`, `google-generativeai`, `python-dotenv`, `gunicorn`.

4.  **Variables de Entorno**:
    Crea un archivo `.env` en la raíz de la carpeta `backend` y añade tu API Key de Google:
    ```env
    GOOGLE_API_KEY=tu_api_key_aqui
    PORT=5000
    ```

## ▶️ Ejecución Local

Para desarrollo:
```bash
python main.py
```
El servidor correrá en `http://localhost:5000`.

Para producción (local):
```bash
gunicorn main:app
```

## ☁️ Despliegue en Render

Este proyecto incluye un archivo `render.yaml` en la raíz del repositorio para facilitar el despliegue.

1.  Sube tu código a GitHub.
2.  En Render, crea un nuevo **Blueprint**.
3.  Conecta tu repositorio.
4.  Render detectará la configuración.
5.  Proporciona tu `GOOGLE_API_KEY` cuando se te solicite.

El servicio se desplegará como un **Web Service** con Python.

## 📡 Endpoints

### `POST /api/chat`

Envía un mensaje al chatbot.

**Body (JSON):**
```json
{
  "message": "Recomiéndame playas en Santa Marta"
}
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:5000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Recomiéndame playas en Santa Marta"}'
```

**Respuesta (JSON):**
```json
{
  "response": "¡Claro! Te recomiendo visitar el Parque Tayrona...",
  "placesInfo": [
    { "name": "Parque Tayrona", "city": "Santa Marta", "department": "Magdalena" },
    { "name": "Playa Blanca", "city": "Santa Marta", "department": "Magdalena" }
  ]
}
```

## ❓ Solución de Problemas

*   **Error 500 al enviar mensaje**: Verifica que tu `GOOGLE_API_KEY` en el archivo `.env` sea correcta y tenga permisos activos.
*   **CORS Error**: Asegúrate de que estás accediendo desde el frontend permitido o que `CORS(app)` está habilitado en `main.py`.
*   **Gemini no responde**: Revisa tu conexión a internet y que la API de Google no esté caída.
