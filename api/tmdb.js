// Vercel serverless function to proxy TMDB API calls
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { endpoint, ...params } = req.query;
    
    if (!endpoint) {
      res.status(400).json({ error: 'Missing endpoint parameter' });
      return;
    }

    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    if (!API_KEY) {
      res.status(500).json({ error: 'API key not configured' });
      return;
    }

    const BASE_URL = 'https://api.themoviedb.org/3';
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    // Add API key
    url.searchParams.set('api_key', API_KEY);
    
    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'endpoint') {
        url.searchParams.set(key, value);
      }
    });

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('TMDB API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}