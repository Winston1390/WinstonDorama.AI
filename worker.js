
const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const DB_FILE = path.join(DATA_DIR, 'scenes_db.json');
const DEFAULT_JSON = path.join(__dirname, 'data', 'micro_doramas.json');

function initDb(jsonPath = DEFAULT_JSON, dbPath = DB_FILE) {
  if (!fs.existsSync(dbPath) || fs.readFileSync(dbPath,'utf8').trim()==='') {
    const db = { scenes: {} };
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath,'utf8'));
      for (const proj of data.micro_doramas || []) {
        for (const s of proj.escenas || []) {
          db.scenes[s.id] = { id: s.id, project_id: proj.id, payload: s, clip_url: null, audio_url: null };
        }
      }
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  }
  console.log('DB initialized at', dbPath);
}

async function generateTtsElevenLabs(text) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ElevenLabs API key not configured');
  // Placeholder: user should replace with real API call
  const fakePath = path.join(DATA_DIR, `tts_${Date.now()}.mp3`);
  fs.writeFileSync(fakePath, '');
  return fakePath;
}

async function callVideoProvider(scene, audioPath) {
  const key = process.env.RUNWAY_API_KEY;
  const endpoint = process.env.RUNWAY_API_ENDPOINT || '';
  if (!key || !endpoint) {
    return `https://storage.example.com/clips/${scene.id}.mp4`;
  }
  return `https://provider.example.com/results/${scene.id}.mp4`;
}

async function markSceneResult(sceneId, clipUrl, audioUrl) {
  const db = JSON.parse(fs.readFileSync(DB_FILE,'utf8'));
  if (db.scenes[sceneId]) {
    db.scenes[sceneId].clip_url = clipUrl;
    db.scenes[sceneId].audio_url = audioUrl;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  }
  return db.scenes[sceneId];
}

async function getSceneById(id) {
  if (!fs.existsSync(DB_FILE)) return null;
  const db = JSON.parse(fs.readFileSync(DB_FILE,'utf8'));
  return db.scenes[id] || null;
}

async function processSceneJob(payload) {
  const projectId = payload.project_id;
  const scene = payload.scene;
  console.log('Processing scene', scene.id, 'project', projectId);
  const lines = scene.lineas || [];
  const text = lines.map(l => l.texto).join(' ');

  let audioPath = null;
  try {
    audioPath = await generateTtsElevenLabs(text);
    console.log('TTS generated at', audioPath);
  } catch (e) {
    console.warn('ElevenLabs not configured or failed - using local placeholder', e.message);
    audioPath = path.join(DATA_DIR, `tts_placeholder_${Date.now()}.mp3`);
    fs.writeFileSync(audioPath, '');
  }

  let clipUrl = null;
  try {
    clipUrl = await callVideoProvider(scene, audioPath);
    console.log('Clip URL', clipUrl);
  } catch (e) {
    console.warn('Video provider failed - using placeholder', e.message);
    clipUrl = `https://storage.example.com/clips/${scene.id}.mp4`;
  }

  await markSceneResult(scene.id, clipUrl, audioPath);
  return { clip_url: clipUrl, audio_url: audioPath };
}

module.exports = { initDb, processSceneJob, getSceneById };
