const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 150 * 1024 * 1024 } });

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const ASSEMBLYAI_KEY = process.env.ASSEMBLYAI_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;

app.post('/api/upload', upload.single('audio'), async (req, res) => {
  try {
    const apiKey = ASSEMBLYAI_KEY;
    if (!apiKey) return res.status(400).json({ error: 'Missing AssemblyAI key' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const response = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: { authorization: apiKey, 'content-type': 'application/octet-stream' },
      body: req.file.buffer
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transcript', async (req, res) => {
  try {
    const apiKey = ASSEMBLYAI_KEY;
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: { authorization: apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({ ...req.body, speech_models: ["universal-2"] })
    });
    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/transcript/:id', async (req, res) => {
  try {
    const apiKey = ASSEMBLYAI_KEY;
    const response = await fetch(`https://api.assemblyai.com/v2/transcript/${req.params.id}`, {
      headers: { authorization: apiKey }
    });
    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/analyse', async (req, res) => {
  try {
    const apiKey = ANTHROPIC_KEY;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Call Analysis Tool running at http://localhost:${PORT}`);
});
