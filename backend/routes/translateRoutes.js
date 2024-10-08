const express = require('express');
const router = express.Router();
const { 
  openaiTranslateEndpoint,
  azureTranslateEndpoint,
  deeplTranslateEndpoint,
  googleTranslateV2Endpoint,
  googleTranslateV3Endpoint,
  modelTranslateEndpoint
} = require('../controllers/translateController');

// Individual Translation Endpoints
router.post('/openai', openaiTranslateEndpoint);
router.post('/azure', azureTranslateEndpoint);
router.post('/deepl', deeplTranslateEndpoint);
router.post('/googleV2', googleTranslateV2Endpoint);
router.post('/googleV3', googleTranslateV3Endpoint);

// Model-Specific Endpoint for multiple texts
router.post('/validate', modelTranslateEndpoint);

module.exports = router;
