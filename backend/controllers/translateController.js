const { openaiTranslate } = require('../services/openaiService');
const { azureTranslateText } = require('../services/azureTranslateService');
const { deeplTranslateText } = require('../services/deeplService');
const { googleTranslateTextV2 } = require('../services/googleTranslateV2Service');
const { googleTranslateTextV3 } = require('../services/googleTranslateV3Service');
const { rateTranslation } = require('../utils/accuracyCalculator');

const { 
  getLanguageCodeForAzure, 
  getLanguageCodeForDeepL, 
  getLanguageCodeForGoogle 
} = require('../utils/languageMapperService');

const { performance } = require('perf_hooks');

// OpenAI Translation Endpoint
const openaiTranslateEndpoint = async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const start = performance.now();
    const translation = await openaiTranslate(text, sourceLanguage, targetLanguage);
    const end = performance.now();
    const satisfaction = await rateTranslation(text, sourceLanguage, translation, targetLanguage);
    
    res.json({
      model: 'openai',
      translation,
      satisfaction,
      time: ((end - start) / 1000).toFixed(2) // Time in seconds
    });
  } catch (error) {
    console.error('Error in OpenAI Translation:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Azure Translation Endpoint
const azureTranslateEndpoint = async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const correctedLanguageCode = await getLanguageCodeForAzure(targetLanguage);
    
    const start = performance.now();
    const translation = await azureTranslateText(text, correctedLanguageCode);
    const end = performance.now();
    const satisfaction = await rateTranslation(text, sourceLanguage, translation, targetLanguage);

    res.json({
      model: 'azureTranslator',
      translation,
      satisfaction,
      time: ((end - start) / 1000).toFixed(2)
    });
  } catch (error) {
    console.error('Error in Azure Translation:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DeepL Translation Endpoint
const deeplTranslateEndpoint = async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const correctedLanguageCode = await getLanguageCodeForDeepL(targetLanguage);

    const start = performance.now();
    const translation = await deeplTranslateText(text, correctedLanguageCode);
    const end = performance.now();
    const satisfaction = await rateTranslation(text, sourceLanguage, translation, targetLanguage);
    
    res.json({
      model: 'deepl',
      translation,
      satisfaction,
      time: ((end - start) / 1000).toFixed(2)
    });
  } catch (error) {
    console.error('Error in DeepL Translation:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Google Translate V2 Endpoint
const googleTranslateV2Endpoint = async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const correctedLanguageCode = await getLanguageCodeForGoogle(targetLanguage);

    const start = performance.now();
    const translation = await googleTranslateTextV2(text, correctedLanguageCode);
    const end = performance.now();
    const satisfaction = await rateTranslation(text, sourceLanguage, translation, targetLanguage);
    
    res.json({
      model: 'googleTranslateV2',
      translation,
      satisfaction,
      time: ((end - start) / 1000).toFixed(2)
    });
  } catch (error) {
    console.error('Error in Google Translate V2:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Google Translate V3 Endpoint
const googleTranslateV3Endpoint = async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const correctedLanguageCode = await getLanguageCodeForGoogle(targetLanguage);

    const start = performance.now();
    const translation = await googleTranslateTextV3(text, correctedLanguageCode);
    const end = performance.now();
    const satisfaction = await rateTranslation(text, sourceLanguage, translation, targetLanguage);
    
    res.json({
      model: 'googleTranslateV3',
      translation,
      satisfaction,
      time: ((end - start) / 1000).toFixed(2)
    });
  } catch (error) {
    console.error('Error in Google Translate V3:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Model-Specific Translation Endpoint for Multiple Texts
const modelTranslateEndpoint = async (req, res) => {
  const modelMap = {
    openai: openaiTranslate,
    azure: azureTranslateText,
    deepl: deeplTranslateText,
    google_v2: googleTranslateTextV2,
    google_v3: googleTranslateTextV3,
  };

  const supportedModels = new Set(Object.keys(modelMap));

  try {
    const { model, texts, sourceLanguage, targetLanguage } = req.body;

    if (!model || !texts || !targetLanguage || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        message: 'Model, texts (as a non-empty array), and targetLanguage are required fields.',
      });
    }

    if (!supportedModels.has(model)) {
      return res.status(400).json({ message: 'Unsupported model specified.' });
    }

    let correctedLanguageCode;
    if (model === 'azure') {
      correctedLanguageCode = await getLanguageCodeForAzure(targetLanguage);
    } else if (model === 'deepl') {
      correctedLanguageCode = await getLanguageCodeForDeepL(targetLanguage);
    } else if (model === 'google_v2' || model === 'google_v3') {
      correctedLanguageCode = await getLanguageCodeForGoogle(targetLanguage);
    } else {
      correctedLanguageCode = targetLanguage;
    }

    const translateFunction = modelMap[model];

    const translations = [];
    for (const text of texts) {
      const start = performance.now();
      const translation = await translateFunction(text, correctedLanguageCode);
      const end = performance.now();
      const satisfaction = await rateTranslation(text, sourceLanguage, translation, targetLanguage);

      translations.push({
        translation
      });
    }

    res.json({
      model,
      translations,
    });
  } catch (error) {
    console.error('Error during model-specific translation:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  openaiTranslateEndpoint,
  azureTranslateEndpoint,
  deeplTranslateEndpoint,
  googleTranslateV2Endpoint,
  googleTranslateV3Endpoint,
  modelTranslateEndpoint
};
