const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Crear cliente OpenAI con tu API Key
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Ruta para probar que el backend está vivo
app.get("/", (req, res) => {
    res.send("Backend Winston Dorama AI está activo ✅");
});

// ✅ RUTA REAL para generar AUDIO IA
app.post("/api/tts", async (req, res) => {
    try {
        const { text, voice } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Debe enviar el texto." });
        }

        const response = await client.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: voice || "alloy",
            input: text
        });

        // Convertir audio a Base64 para enviarlo
        const audioBuffer = Buffer.from(await response.arrayBuffer());
        const base64Audio = audioBuffer.toString("base64");

        res.json({
            success: true,
            audio: base64Audio
        });

    } catch (err) {
        console.error("Error generando TTS:", err);
        res.status(500).json({ error: "Error generando audio." });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
