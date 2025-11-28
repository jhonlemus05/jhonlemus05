# Gemini Backend para Asistente Turístico de Colombia

Este es el backend para el Asistente Turístico de Colombia. Proporciona una API de chat que utiliza la IA Generativa de Google (Gemini) para responder a las consultas de los usuarios sobre viajes en Colombia y extrae información de los lugares turísticos mencionados en la respuesta.

## Características

- **API de Chat:** Un endpoint `/api/chat` que procesa las consultas de los usuarios.
- **Integración con Gemini:** Utiliza el modelo `gemini-2.5-flash` para generar respuestas de chat inteligentes y contextuales.
- **Extracción de Entidades:** Identifica automáticamente los lugares turísticos en las respuestas de la IA y devuelve sus detalles.
- **Servidor Express:** Construido con Express.js, un framework de aplicación web Node.js robusto y minimalista.

## Despliegue

Este backend está desplegado como un servicio web y se puede acceder a través del siguiente enlace:
[https://gemini-backend-ca0r.onrender.com](https://gemini-backend-ca0r.onrender.com)

## Instalación y Uso Local

Para ejecutar este backend localmente, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd gemini-backend
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade tu clave de API de Gemini:
    ```
    GEMINI_API_KEY=TU_API_KEY_DE_GEMINI
    ```

4.  **Inicia el servidor:**
    ```bash
    npm start
    ```
    El servidor se iniciará en el puerto 3000 por defecto.

## API

### `POST /api/chat`

Este endpoint acepta una solicitud JSON con un mensaje del usuario y devuelve una respuesta generada por la IA.

**Request Body:**

```json
{
  "message": "Qué puedo hacer en Medellín?"
}
```

**Response Body (Ejemplo):**

```json
{
  "reply": "¡Medellín es una ciudad vibrante con mucho que ofrecer! 🌆 Puedes tomar el Metrocable hasta el Parque Arví para disfrutar de la naturaleza, explorar la Comuna 13 y sus famosos grafitis, o visitar la Plaza Botero para ver las esculturas de Fernando Botero. 🎨",
  "placesInfo": [
    {
      "name": "Parque Arví",
      "city": "Medellín",
      "department": "Antioquia",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Parque_Arvi_Medellin.jpg"
    },
    {
      "name": "Comuna 13",
      "city": "Medellín",
      "department": "Antioquia",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Comuna_13_Medellin.jpg"
    },
    {
      "name": "Plaza Botero",
      "city": "Medellín",
      "department": "Antioquia",
      "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/32/Plaza_Botero_Medellin.jpg"
    }
  ]
}
```

## Dependencias Principales

-   [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai): Cliente de Node.js para la API de IA Generativa de Google.
-   [axios](https://www.npmjs.com/package/axios): Cliente HTTP basado en promesas para el navegador y node.js.
-   [cors](https://www.npmjs.com/package/cors): Middleware de Express para habilitar CORS.
-   [dotenv](https://www.npmjs.com/package/dotenv): Carga variables de entorno desde un archivo `.env`.
-   [express](https://www.npmjs.com/package/express): Framework de aplicación web para Node.js.
