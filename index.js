
const express = require('express');
const bodyParser = require('body-parser');
const { processSceneJob, initDb, getSceneById } = require('./worker');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

const PORT = process.env.PORT || 8000;

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'microdor.db');
const JSON_PATH = process.env.JSON_PATH || path.join(__dirname, 'data', 'micro_doramas.json');

// Initialize DB (simple JSON store)
initDb(JSON_PATH, DB_PATH);

app.get('/', (req, res) => {
  res.json({ message: 'WinstonDoramaAI Node backend running' });
});

app.post('/api/process_scene', async (req, res) => {
  const payload = req.body;
  if (!payload || !payload.project_id || !payload.scene) {
    return res.status(400).json({ error: 'project_id and scene required' });
  }
  // process asynchronously but respond quickly
  processSceneJob(payload)
    .then(result => {
      res.json({ status: 'queued', project_id: payload.project_id, scene_id: payload.scene.id, result });
    })
    .catch(err => {
      console.error('Processing error', err);
      res.status(500).json({ error: 'processing failed', details: err.message });
    });
});

app.get('/api/scene/:id', async (req, res) => {
  const id = req.params.id;
  const row = await getSceneById(id);
  if (!row) return res.status(404).json({ error: 'scene not found' });
  res.json(row);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
