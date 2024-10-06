
const express = require('express');
const router = express.Router();
const { translateText, translateTextByModel } = require('../controllers/translateController');

router.post('/', translateText);

// by specific model
router.post('/bymodel', translateTextByModel);

module.exports = router;
