// services/deeplService.js
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { getLanguageCode } = require('../utils/languageMapperService'); // Use OpenAI for language mapping

dotenv.config({ path: path.join(__dirname, '../../.env') });

const deeplApiKey = process.env.DEEPL_API_KEY;
const deeplEndpoint = "https://api-free.deepl.com/v2/translate"; // Use "https://api.deepl.com/v2/translate" for pro accounts

const deeplTranslateText = async (text, targetLanguage) => {
  try {
    // Get ISO language code using OpenAI
    const targetLanguageCode = await getLanguageCode(targetLanguage);

    const response = await axios.post(
      deeplEndpoint,
      null, // No body required, only params
      {
        headers: {
          'Authorization': `DeepL-Auth-Key ${deeplApiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          text: text,
          target_lang: targetLanguageCode.toUpperCase(), // DeepL uses uppercase language codes
        }
      }
    );

    // Extract the translated text from the response
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
