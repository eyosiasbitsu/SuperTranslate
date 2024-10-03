// controllers/translateController.js
const { openaiTranslate } = require('../services/openaiService');
const { azureTranslateText } = require('../services/azureTranslateService');
const { deeplTranslateText } = require('../services/deeplService');
const { rateTranslation } = require('../utils/accuracyCalculator');

const translateText = async (req, res) => {
  try {
    const { text, source_language, target_language } = req.body;

    if (!text || !source_language || !target_language) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const translations = [];

    // OpenAI Translation
    const openaiTranslation = await openaiTranslate(text, source_language, target_language);
    const openaiSatisfaction = await rateTranslation(text, source_language, openaiTranslation, target_language);
    translations.push({
      model: 'openai',
      translation: openaiTranslation,
      satisfaction: openaiSatisfaction
    });

    // Azure Translation
    const azureTranslation = await azureTranslateText(text, target_language); // Pass the target language name
    const azureSatisfaction = await rateTranslation(text, source_language, azureTranslation, target_language);
    translations.push({
      model: 'azure_translator',
      translation: azureTranslation,
      satisfaction: azureSatisfaction
    });

    // DeepL Translation
    const deeplTranslation = await deeplTranslateText(text, target_language);
    const deeplSatisfaction = await rateTranslation(text, source_language, deeplTranslation, target_language);
    translations.push({
      model: 'deepl',
      translation: deeplTranslation,
      satisfaction: deeplSatisfaction
    });

    // Send the response
    res.json(translations);
  } catch (error) {
    console.error('Error during translation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  translateText,
};
