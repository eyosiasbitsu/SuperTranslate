const express = require('express');
const router = express.Router();
const { unifiedTranslateEndpoint } = require('../controllers/translateController');

router.post('/', unifiedTranslateEndpoint);

module.exports = router;
