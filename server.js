const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 150 * 1024 * 1024 } });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── AssemblyAI: upload audio file ──────────────────────────────────────────
app.post('/api/upload', upload.single('audio'), async (req, res) => {
  try {
    const apiKey = req.headers['x-assemblyai-key'];
    if (!apiKey) return res.status(400).json({ error: 'Missing AssemblyAI key' });

    const fileBuffer = fs.readFileSync(req.file.path);
    const response = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: { authorization: apiKey, 'content-type': 'application/octet-stream' },
      body: fileBuffer
    });
    fs.unlinkSync(req.file.path);
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── AssemblyAI: submit transcript ──────────────────────────────────────────
app.post('/api/transcript', async (req, res) => {
  try {
    const apiKey = req.headers['x-assemblyai-key'];
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

// ── AssemblyAI: poll transcript status ────────────────────────────────────
app.get('/api/transcript/:id', async (req, res) => {
  try {
    const apiKey = req.headers['x-assemblyai-key'];
    const response = await fetch(`https://api.assemblyai.com/v2/transcript/${req.params.id}`, {
      headers: { authorization: apiKey }
    });
    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Anthropic Claude: analyse call ────────────────────────────────────────
app.post('/api/analyse', async (req, res) => {
  try {
    const apiKey = req.headers['x-anthropic-key'];
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Call Analysis Tool running at: http://localhost:${PORT}\n`);
  console.log('   Open this URL in your browser to use the tool.');
  console.log('   Press Ctrl+C to stop.\n');
});
