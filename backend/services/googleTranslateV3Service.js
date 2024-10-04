const { TranslationServiceClient } = require('@google-cloud/translate').v3;
const path = require('path');
const { getLanguageCodeForGoogle } = require('../utils/languageMapperService');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize the Translation Service Client
const translationClientV3 = new TranslationServiceClient();
const googleProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'supertranslate';
const location = 'global'; // You can change this to your specific location if needed

/**
 * Translates text using Google Cloud Translate v3 API.
 *
 * @param {string} text - The text to translate.
 * @param {string} targetLanguage - The target language for translation.
 * @returns {Promise<string>} - The translated text.
 */
const googleTranslateTextV3 = async (text, targetLanguage) => {
  try {
    // Get the correct language code for Google Translate
    const targetLanguageCode = await getLanguageCodeForGoogle(targetLanguage);

    // Prepare the request object
    const request = {
      parent: `projects/${googleProjectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain', // Could also be 'text/html' if your input is HTML
      targetLanguageCode,
    };

    // Send the request to Google Cloud Translate
    const [response] = await translationClientV3.translateText(request);
    const translatedText = response.translations[0].translatedText;

    return translatedText;

  } catch (error) {
    // Log and throw the error for further handling
    console.error('Error in Google Translate v3:', error.message || error);
    throw error;
  }
};

module.exports = {
  googleTranslateTextV3,
};
