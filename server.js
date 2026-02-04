// Proxy Server for Real Estate Practice Tool
// This server handles API calls to avoid CORS issues
const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files (HTML, JS)
app.use(express.static('.'));

// Proxy endpoint for Anthropic API
app.post('/api/anthropic', async (req, res) => {
    try {
        const { model, max_tokens, system, messages } = req.body; // Remove apiKey from destructuring

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_KEY, // Use server key
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({ model, max_tokens, system, messages })
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('Anthropic API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for ElevenLabs voices
// Proxy endpoint for ElevenLabs voices
app.get('/api/elevenlabs/voices', async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key'];
        
        // DEBUG LOGGING:
        console.log('=== ELEVENLABS VOICES REQUEST ===');
        console.log('API Key received:', ELEVENLABS_KEY ? 'YES (length: ' + ELEVENLABS_KEY.length + ')' : 'NO');
        console.log('API Key first 10 chars:', ELEVENLABS_KEY ? ELEVENLABS_KEY.substring(0, 10) : 'none');

        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: {
                'xi-api-key': ELEVENLABS_KEY
            }
        });

        console.log('ElevenLabs response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('ElevenLabs error:', errorText);
            return res.status(response.status).json({ error: 'ElevenLabs API error', details: errorText });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('ElevenLabs API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for ElevenLabs text-to-speech
// Proxy endpoint for ElevenLabs text-to-speech
app.post('/api/elevenlabs/tts/:voiceId', async (req, res) => {
    try {
        const { voiceId } = req.params;
        const apiKey = req.headers['x-api-key'];

        // DEBUG LOGGING:
        console.log('=== ELEVENLABS TTS REQUEST ===');
        console.log('Voice ID:', voiceId);
        console.log('API Key received:', ELEVENLABS_KEY ? 'YES (length: ' + ELEVENLABS_KEY.length + ')' : 'NO');
        console.log('API Key first 10 chars:', ELEVENLABS_KEY ? ELEVENLABS_KEY.substring(0, 10) : 'none');

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_KEY
            },
            body: JSON.stringify(req.body)
        });

        console.log('ElevenLabs TTS response status:', response.status);

        if (!response.ok) {
            const error = await response.text();
            console.log('ElevenLabs TTS error:', error);
            return res.status(response.status).json({ error: 'ElevenLabs TTS error', details: error });
        }

        // Forward the audio blob
        const buffer = await response.buffer();
        res.set('Content-Type', 'audio/mpeg');
        res.send(buffer);
    } catch (error) {
        console.error('ElevenLabs TTS Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════════╗
    ║  🏠 Real Estate Practice Tool Server Running  ║
    ╠════════════════════════════════════════════════╣
    ║                                                ║
    ║  ✅ Server: http://localhost:${PORT}                ║
    ║                                                ║
    ║  📝 Open your browser to:                      ║
    ║     http://localhost:${PORT}                       ║
    ║                                                ║
    ║  🛑 Press Ctrl+C to stop the server           ║
    ║                                                ║
    ╚════════════════════════════════════════════════╝
    `);
});
