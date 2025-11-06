
const axios = require('axios');
const API = process.env.API || 'http://localhost:8000/api/process_scene';
const payload = {
  project_id: 'dorama_001',
  scene: {
    id: 'test_scene_1',
    duracion: 15,
    fondo: 'calle_prueba',
    camara: 'close',
    lineas: [
      { actor: 'A', texto: 'Hola desde test script.' },
      { actor: 'B', texto: 'Recibido.' }
    ]
  }
};
axios.post(API, payload).then(r => {
  console.log('Status', r.status, 'data', r.data);
}).catch(e => {
  console.error('Error', e.response ? e.response.data : e.message);
});
