export default async (request, context) => {
    if (request.method === "OPTIONS") {
        return new Response("OK", { status: 200 });
    }
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await request.json();
        const promptText = body.prompt;

        if (!promptText) {
            return new Response(JSON.stringify({ error: "No prompt provided" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Get API Keys from Deno.env (available in Edge Functions)
        const keys = [
            Deno.env.get("GEMINI_API_KEY_1"),
            Deno.env.get("GEMINI_API_KEY_2"),
            Deno.env.get("GEMINI_API_KEY_3")
        ].filter(Boolean);

        if (keys.length === 0) {
            return new Response(JSON.stringify({ error: "No hay API Keys configuradas en .env" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
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
                    return new Response(JSON.stringify(data), {
                        status: 200,
                        headers: { "Content-Type": "application/json" }
                    });
                } else {
                    const errText = await response.text();
                    lastErrorDetails = errText;

                    if (response.status === 429 || response.status >= 500) {
                        console.warn(`Intento ${attempts + 1} fallido con status ${response.status}. Rotando...`);
                        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
                        attempts++;
                        continue;
                    } else {
                        return new Response(JSON.stringify({ error: "Gemini API error", details: errText }), {
                            status: response.status,
                            headers: { "Content-Type": "application/json" }
                        });
                    }
                }
            } catch (error) {
                console.warn(`Intento ${attempts + 1} fallido por error de red/timeout. Detalle: ${error.message}. Rotando...`);
                lastErrorDetails = error.message;
                currentKeyIndex = (currentKeyIndex + 1) % keys.length;
                attempts++;
            }
        }

        console.error(`Todos los intentos fallaron. Último error: ${lastErrorDetails}`);
        return new Response(JSON.stringify({ error: "Service Unavailable: Todas las API keys fallaron.", details: lastErrorDetails }), {
            status: 503,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Function error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config = { path: "/api/generate-pdc" };
