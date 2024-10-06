
const { openaiTranslate } = require('../services/openaiService');
const { azureTranslateText } = require('../services/azureTranslateService');
const { deeplTranslateText } = require('../services/deeplService');
const { googleTranslateTextV2 } = require('../services/googleTranslateV2Service');
const { googleTranslateTextV3 } = require('../services/googleTranslateV3Service');
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
    const azureTranslation = await azureTranslateText(text, target_language);
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

    // Google Cloud Translate v2
    try {
      const googleV2Translation = await googleTranslateTextV2(text, target_language);
      const googleV2Satisfaction = await rateTranslation(text, source_language, googleV2Translation, target_language);
      translations.push({
        model: 'google_translate_v2',
        translation: googleV2Translation,
        satisfaction: googleV2Satisfaction
      });
    } catch (error) {
      console.error('Error in Google Translate v2:', error.message);
      translations.push({
        model: 'google_translate_v2',
        translation: 'Error in translation',
        satisfaction: 'N/A'
      });
    }

    // Google Cloud Translate v3
    try {
      const googleV3Translation = await googleTranslateTextV3(text, target_language);
      const googleV3Satisfaction = await rateTranslation(text, source_language, googleV3Translation, target_language);
      translations.push({
        model: 'google_translate_v3',
        translation: googleV3Translation,
        satisfaction: googleV3Satisfaction
      });
    } catch (error) {
      console.error('Error in Google Translate v3:', error.message);
      translations.push({
        model: 'google_translate_v3',
        translation: 'Error in translation',
        satisfaction: 'N/A'
      });
    }

    // Send the response
    res.json(translations);
  } catch (error) {
    console.error('Error during translation:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const translateTextByModel = async (req, res) => {
  const modelMap = {
    "openai": openaiTranslate,
    "azure": azureTranslateText,
    "deepl": deeplTranslateText,
    "google_v2": googleTranslateTextV2,
    "google_v3": googleTranslateTextV3,
  };

  const supportedModels = new Set(Object.keys(modelMap));

  try {
    const { model, text, source_language, target_language } = req.body;

    if (!model || !text || !target_language) {
      return res.status(400).json({ message: 'Model, text, and target_language are required fields.' });
    }

    if (!supportedModels.has(model)) {
      return res.status(400).json({ message: 'Unsupported model specified.' });
    }

    let correctedLanguageCode;
    if (model === "azure") {
      correctedLanguageCode = await getLanguageCodeForAzure(target_language);
    } else if (model === "deepl") {
      correctedLanguageCode = await getLanguageCodeForDeepL(target_language);
    } else if (model === "google_v2" || model === "google_v3") {
      correctedLanguageCode = await getLanguageCodeForGoogle(target_language);
    } else {
      correctedLanguageCode = target_language;
    }

    const translateFunction = modelMap[model];

    const translation = await translateFunction(text, correctedLanguageCode);
    const satisfaction = await rateTranslation(text, source_language, translation, target_language);

    res.json({
      model,
      translation,
      satisfaction
    });
  } catch (error) {
    console.error('Error during translation:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  translateText,
  translateTextByModel
};
