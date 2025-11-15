export default async function handler(request, response) {
    response.setHeader(
        "Access-Control-Allow-Origin",
        "https://feelincamatosee.github.io"
    );
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
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