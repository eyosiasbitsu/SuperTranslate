const express = require('express');
const router = express.Router();
const { unifiedTranslateEndpoint, translateDocument } = require('../controllers/translateController');

// Unified translation endpoint for text
router.post('/', unifiedTranslateEndpoint);

// New endpoint for translating PDF or DOCX files
router.post('/document', translateDocument);

module.exports = router;
