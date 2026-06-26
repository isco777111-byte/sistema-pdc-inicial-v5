exports.handler = async (event, context) => {
    // Solo permitir peticiones POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const promptText = body.prompt;

        if (!promptText) {
            return { statusCode: 400, body: JSON.stringify({ error: "No prompt provided" }) };
        }

        const keys = [
            process.env.GEMINI_API_KEY_1,
            process.env.GEMINI_API_KEY_2,
            process.env.GEMINI_API_KEY_3
        ].filter(Boolean);

        if (keys.length === 0) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "No hay API Keys (GEMINI_API_KEY_1, 2, 3) configuradas en las variables de entorno." }),
            };
        }

        let currentKeyIndex = 0;
        let attempts = 0;
        const maxRetries = 6;
        let lastErrorDetails = null;

        while (attempts < maxRetries) {
            const API_KEY = keys[currentKeyIndex];
            const maskedKey = API_KEY.length > 8 ? API_KEY.substring(0, 4) + '...' + API_KEY.substring(API_KEY.length - 4) : '***';

            console.log(`Intento ${attempts + 1}: Usando API Key ${maskedKey}`);

            try {
                // Realizamos la solicitud a la API de Gemini
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }],
                        generationConfig: {
                            temperature: 0.7,
                            responseMimeType: "application/json"
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (attempts > 0) {
                        console.log(`Éxito en el intento ${attempts + 1} tras haber rotado.`);
                    }
                    return {
                        statusCode: 200,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    };
                } else {
                    const errText = await response.text();
                    lastErrorDetails = errText;

                    // Errores recuperables: 429 (Too Many Requests), 500, 503, 504, etc.
                    if (response.status === 429 || response.status >= 500) {
                        console.warn(`Intento ${attempts + 1} fallido con status ${response.status} (Motivo: Cuota o error del servidor). Rotando...`);
                        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
                        attempts++;
                        continue; // Continuar al siguiente intento
                    } else {
                        // Error no recuperable (ej. 400 Bad Request por prompt inválido)
                        return { statusCode: response.status, body: JSON.stringify({ error: "Gemini API error", details: errText }) };
                    }
                }
            } catch (error) {
                // Errores de red o de timeout caen aquí
                console.warn(`Intento ${attempts + 1} fallido por error de red/timeout. Detalle: ${error.message}. Rotando...`);
                lastErrorDetails = error.message;
                currentKeyIndex = (currentKeyIndex + 1) % keys.length;
                attempts++;
            }
        } // Fin del while

        // Si salimos del bucle es porque se superaron los intentos máximos (maxRetries)
        console.error(`Todos los intentos fallaron. Último error: ${lastErrorDetails}`);
        return {
            statusCode: 503,
            body: JSON.stringify({ error: "Service Unavailable: Todas las API keys fallaron.", details: lastErrorDetails })
        };

    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message })
        };
    }
};
