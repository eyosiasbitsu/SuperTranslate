
const openaiService = require('../services/openaiService');
const googleTranslateService = require('../services/googleTranslateService');
const googleAutoMLService = require('../services/googleAutoMLService');
const { rateTranslation } = require('../utils/accuracyCalculator');

const translateText = async (req, res) => {
  try {
    const { text, source_language, target_languages } = req.body;

    if (!text || !source_language || !target_languages) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const translations = [];

    // OpenAI Translation
    const openaiTranslation = await openaiService.translate(text, source_language, target_languages);
    const openaiSatisfaction = await rateTranslation(text, source_language, openaiTranslation, target_languages[0]);
    translations.push({
      model: 'openai',
      translation: openaiTranslation,
      satisfaction: openaiSatisfaction
    });

    // // Google Cloud Translate API
    // const googleTranslate = await googleTranslateService.translate(text, source_language, target_languages);
    // const googleTranslateSatisfaction = await rateTranslation(text, source_language, googleTranslate, target_languages[0]);
    // translations.push({
    //   model: 'google_cloud',
    //   translation: googleTranslate,
    //   satisfaction: googleTranslateSatisfaction
    // });

    // Google AutoML Translation
    // const googleAutoMLTranslation = await googleAutoMLService.translate(text, source_language, target_languages);
    // const googleAutoMLSatisfaction = await rateTranslation(text, source_language, googleAutoMLTranslation, target_languages[0]);
    // translations.push({
    //   model: 'google_automl',
    //   translation: googleAutoMLTranslation,
    //   satisfaction: googleAutoMLSatisfaction
    // });

    res.json(translations);
  } catch (error) {
    console.error('Error during translation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  translateText,
}