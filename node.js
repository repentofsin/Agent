// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.static('public')); // serve your HTML
app.use(express.json());

app.post('/api/speak', async (req, res) => {
  const apiKey = "sk_a13fbb21a6f0a38089f2653f722e4bee4a0f939c96d4572e";
  const voiceId = "VOICE_ID";

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    }
  );

  const audioBuffer = await response.arrayBuffer();
  res.set('Content-Type', 'audio/mpeg');
  res.send(Buffer.from(audioBuffer));
});

app.listen(3000);