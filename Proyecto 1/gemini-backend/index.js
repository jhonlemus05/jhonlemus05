import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
Eres un asistente de viajes experto en Colombia. Tu tarea es responder a la consulta del usuario y, al mismo tiempo, identificar los lugares turísticos mencionados en tu propia respuesta.

Debes devolver SIEMPRE una respuesta en formato JSON estricto, sin ninguna explicación adicional, texto o marcadores de formato como \`\`\`json.

El objeto JSON debe tener la siguiente estructura:
{
  "reply": "Aquí va tu respuesta conversacional, amigable y útil para el usuario, usando emojis y párrafos cortos.",
  "placesInfo": [
    {
      "name": "Nombre del lugar",
      "city": "Ciudad donde se encuentra (o la más cercana)",
      "department": "Departamento donde se encuentra"
    }
  ]
}

Ejemplo de respuesta para la consulta "Qué puedo hacer en Bogotá?":
{
  "reply": "¡Bogotá es una ciudad increíble! 🇨🇴 Puedes explorar el centro histórico de La Candelaria, visitar el impresionante Museo del Oro y subir a Monserrate para tener una vista panorámica. ⛰️",
  "placesInfo": [
    { "name": "La Candelaria", "city": "Bogotá", "department": "Cundinamarca" },
    { "name": "Museo del Oro", "city": "Bogotá", "department": "Cundinamarca" },
    { "name": "Monserrate", "city": "Bogotá", "department": "Cundinamarca" }
  ]
}

Si en tu respuesta no mencionas ningún lugar específico, el campo "placesInfo" debe ser un array vacío [].
Analiza la consulta del usuario y genera una respuesta útil que incluya lugares relevantes para poder extraerlos.
`,
});

/**
 * Extracts a JSON object from a string, which might be wrapped in markdown.
 * @param {string} str The string to extract JSON from.
 * @returns {object | null} The parsed JSON object or null if not found.
 */
function extractJson(str) {
    // Match JSON block inside ```json ... ```
    const codeBlockMatch = str.match(/```json\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
        try {
            return JSON.parse(codeBlockMatch[1]);
        } catch (error) {
            console.error("Failed to parse JSON from code block:", error);
            // Fall through to try parsing the whole string
        }
    }

    // Match a standalone JSON object
    const jsonObjectMatch = str.match(/{\s*[\s\S]*\s*}/);
    if (jsonObjectMatch && jsonObjectMatch[0]) {
        try {
            return JSON.parse(jsonObjectMatch[0]);
        } catch (error) {
            console.error("Failed to parse JSON from string:", error);
        }
    }
    
    return null;
}

/**
 * Fetches an image URL from Wikimedia based on a place name.
 * @param {string} placeName The name of the place to search for.
 * @param {string} city The city of the place for context.
 * @returns {Promise<string|null>} The URL of the image or null if not found.
 */
async function getWikimediaImage(placeName, city) {
    const searchTerm = `${placeName} ${city}`;
    const searchUrl = `https://api.wikimedia.org/core/v1/wikipedia/en/search/page`;
    const imageUrlBase = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=500&titles=`;

    try {
        // 1. Search for the page to get the exact title
        const searchResponse = await axios.get(searchUrl, {
            headers: { 'User-Agent': 'ColombiaTravelAssistant/1.0 (https://your-app-url.com)' },
            params: { q: searchTerm, limit: 1 }
        });

        if (!searchResponse.data.pages || searchResponse.data.pages.length === 0) {
            console.log(`No Wikimedia page found for: ${searchTerm}`);
            return null;
        }

        const pageTitle = searchResponse.data.pages[0].key;

        // 2. Get the main image of the page using the title
        const imageResponse = await axios.get(`${imageUrlBase}${pageTitle}`);
        const pages = imageResponse.data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
            return pages[pageId].thumbnail.source;
        }

        return null;
    } catch (error) {
        console.error(`Error fetching image for ${searchTerm}:`, error.message);
        return null;
    }
}


app.post("/api/chat", async (req, res) => {
  let responseText = ''; // To store the raw response for logging
  try {
    const { message } = req.body;

    const result = await model.generateContent(message);
    responseText = result.response.text();

    const parsedResponse = extractJson(responseText);

    if (!parsedResponse) {
      throw new Error("Failed to extract valid JSON from model response.");
    }

    // If there are places, fetch images for them
    if (parsedResponse.placesInfo && parsedResponse.placesInfo.length > 0) {
        const placesWithImages = await Promise.all(
            parsedResponse.placesInfo.map(async (place) => {
                const imageUrl = await getWikimediaImage(place.name, place.city);
                return { ...place, imageUrl: imageUrl || null };
            })
        );
        parsedResponse.placesInfo = placesWithImages;
    }

    res.json(parsedResponse);
  } catch (error) {
    console.error("Backend Error:", error);
    console.error("Raw model response that caused the error:", responseText);
    res.status(500).json({ error: "Error procesando la respuesta de la IA. Revisa el formato JSON y la respuesta del modelo." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Backend en puerto " + port));
