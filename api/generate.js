export default async function handler(request, response) {
    const origin = request.headers.origin;
    const allowedOrigins = [
        "https://feelincamatosee.github.io",
        "http://localhost:5173",
    ];

    if (allowedOrigins.includes(origin)) {
        response.setHeader("Access-Control-Allow-Origin", origin);
    }

    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
        return response.status(200).end();
    }

    try {
        const { modelName, contents, generationConfig } = request.body;

        if (!modelName) {
            return response.status(400).json({ error: "modelName is required" });
        }

        const GOOGLE_API_KEY = process.env.GOOGLE_AI_API_KEY;
        if (!GOOGLE_API_KEY) {
            return response.status(500).json({ error: 'API key is not configured.' });
        }

        const originalPath = `models/${modelName}:generateContent`;
        const GOOGLE_URL = `https://generativelanguage.googleapis.com/v1beta/${originalPath}?key=${GOOGLE_API_KEY}`;

        const googlePayload = { contents, generationConfig };

        const googleResponse = await fetch(GOOGLE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(googlePayload),
        });

        const data = await googleResponse.json();
        return response.status(googleResponse.status).json(data);

    } catch (error) {
        console.error('Proxy error:', error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}