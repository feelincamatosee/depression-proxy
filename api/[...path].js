export default async function handler(request, response) {
    const allowedOrigins = [
        'https://feelincamatosee.github.io',
        'http://localhost:5173'
    ];

    const origin = request.headers.origin;
    if (allowedOrigins.includes(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_AI_API_KEY;
    if (!GOOGLE_API_KEY) {
        return response.status(500).json({ error: 'API key is not configured.' });
    }

    const originalPath = request.url.replace('/api/', '');

    const GOOGLE_URL = `https://generativelanguage.googleapis.com/v1beta/${originalPath}?key=${GOOGLE_API_KEY}`;

    try {
        const googleResponse = await fetch(GOOGLE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body),
        });

        const data = await googleResponse.json();
        return response.status(googleResponse.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}