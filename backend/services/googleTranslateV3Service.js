const { TranslationServiceClient } = require('@google-cloud/translate').v3;
const path = require('path');
const { getLanguageCodeForGoogle } = require('../utils/languageMapperService');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const translationClientV3 = new TranslationServiceClient();
const googleProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'supertranslate';
const location = 'global';

/**
 * @param {string} text - The text to translate.
 * @param {string} targetLanguage - The target language for translation.
 * @returns {Promise<string>} - The translated text.
 */
const googleTranslateTextV3 = async (text, targetLanguage) => {
  try {

    const targetLanguageCode = await getLanguageCodeForGoogle(targetLanguage);

    const request = {
      parent: `projects/${googleProjectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain',
      targetLanguageCode,
    };

    const [response] = await translationClientV3.translateText(request);
    const translatedText = response.translations[0].translatedText;

    return translatedText;

  } catch (error) {
    console.error('Error in Google Translate v3:', error.message || error);
    throw error;
  }
};

module.exports = {
  googleTranslateTextV3,
};
