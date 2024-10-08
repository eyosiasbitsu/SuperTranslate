const { openaiTranslate } = require('../services/openaiService');
const { azureTranslateText } = require('../services/azureTranslateService');
const { deeplTranslateText } = require('../services/deeplService');
const { googleTranslateTextV2 } = require('../services/googleTranslateV2Service');
const { googleTranslateTextV3 } = require('../services/googleTranslateV3Service');
const { rateTranslation } = require('../utils/accuracyCalculator');

const { 
  getLanguageCodeForAzure, 
  getLanguageCodeForDeepL, 
  getLanguageCodeForGoogle,
  getLanguageCodeForOpenAI
} = require('../utils/languageMapperService');

const { performance } = require('perf_hooks');

// Unified Translation Endpoint
const unifiedTranslateEndpoint = async (req, res) => {
  const modelMap = {
    openai: openaiTranslate,
    azure: azureTranslateText,
    deepl: deeplTranslateText,
    googleV2: googleTranslateTextV2,
    googleV3: googleTranslateTextV3,
  };

  const supportedModels = new Set(Object.keys(modelMap));

  try {
    const { model, text, sourceLanguage, targetLanguage } = req.body;

    if (!model || !text || !targetLanguage) {
      return res.status(400).json({ message: 'Model, text, and targetLanguage are required fields.' });
    }

    if (!supportedModels.has(model)) {
      return res.status(400).json({ message: 'Unsupported model specified.' });
    }

    // Correct language code
    let correctedLanguageCode;
    if (model === 'azure') {
      correctedLanguageCode = await getLanguageCodeForAzure(targetLanguage);
    } else if (model === 'deepl') {
      correctedLanguageCode = await getLanguageCodeForDeepL(targetLanguage);
    } else if (model === 'googleV2' || model === 'googleV3') {
      correctedLanguageCode = await getLanguageCodeForGoogle(targetLanguage);
    } else if (model === 'openai') {
      correctedLanguageCode = await getLanguageCodeForOpenAI(targetLanguage);
    }

    // Get the translation function from the model map
    const translateFunction = modelMap[model];

    // Measure time and translate
    const start = performance.now();
    const translation = await translateFunction(text, correctedLanguageCode);
    const end = performance.now();

    // Calculate satisfaction
    const satisfaction = await rateTranslation(text, sourceLanguage, translation, targetLanguage);

    // Send the response
    res.json({
      model,
      translation,
      satisfaction,
      time: ((end - start) / 1000).toFixed(2) // Time in seconds
    });
  } catch (error) {
    console.error('Error during translation:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  unifiedTranslateEndpoint
};
