// services/deeplService.js
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { getLanguageCodeForDeepL } = require('../utils/languageMapperService'); // Import DeepL-specific mapper

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Ensure you use the pro endpoint if your account is DeepL API Pro
const deeplApiKey = process.env.DEEPL_API_KEY;
const deeplEndpoint = "https://api.deepl.com/v2/translate"; // Use pro endpoint

// List of DeepL-supported languages
const deeplSupportedLanguages = [
  'AR', 'BG', 'CS', 'DA', 'DE', 'EL', 'EN', 'ES', 'ET', 'FI', 'FR', 'HU', 'ID', 'IT', 'JA',
  'KO', 'LT', 'LV', 'NB', 'NL', 'PL', 'PT', 'RO', 'RU', 'SK', 'SL', 'SV', 'TR', 'UK', 'ZH'
];

const deeplTranslateText = async (text, targetLanguage) => {
  try {
    // Get DeepL-compatible language code
    const targetLanguageCode = await getLanguageCodeForDeepL(targetLanguage);

    // Check if the language code is supported by DeepL
    if (!deeplSupportedLanguages.includes(targetLanguageCode)) {
      return `The language "${targetLanguage}" is not supported by DeepL.`;
    }

    console.log('Target language code for DeepL:', targetLanguageCode);

    const response = await axios.post(
      deeplEndpoint,
      {
        text: [text], // Send text as an array according to DeepL requirements
        target_lang: targetLanguageCode, // Use uppercase language code
      },
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${deeplApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const translatedText = response.data.translations[0].text;
    return translatedText;
  } catch (error) {
    console.error('Error in DeepL translation:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = {
  deeplTranslateText,
};
