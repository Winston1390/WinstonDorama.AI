
# WinstonDoramaAI - Node.js Backend (MVP)

This repo contains a simple Node.js (Express) backend to process micro-dorama scenes.
It is designed for quick deployment to Render.com (or similar) and to be connected to the Flutter frontend.

## Quick start (local)

1. Install dependencies:
```
npm install
```

2. Place your `micro_doramas.json` inside `data/` (an example file may be present).

3. Run the server:
```
node index.js
```

4. Test the API:
```
node test_send_scene.js
```

## Environment variables

- `PORT` - port to run (default 8000)
- `DB_PATH` - (optional) path to DB file (not used in this simple JSON store)
- `JSON_PATH` - path to `micro_doramas.json`
- `ELEVENLABS_API_KEY` - (optional) key for ElevenLabs TTS
- `RUNWAY_API_KEY` - (optional) key for video provider
- `RUNWAY_API_ENDPOINT` - (optional) video provider endpoint

## Deploy to Render

1. Create a new repository on GitHub and push this code.
2. In Render, create a new Web Service -> Connect GitHub -> choose this repo.
3. Set env vars (if needed) and deploy.
