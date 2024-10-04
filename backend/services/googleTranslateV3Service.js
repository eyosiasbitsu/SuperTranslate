const { TranslationServiceClient } = require('@google-cloud/translate').v3;
const { getLanguageCodeForGoogle } = require('../utils/languageMapperService');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize Google Cloud Translation client
const translationClientV3 = new TranslationServiceClient();
const googleProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = 'global';

const googleTranslateTextV3 = async (text, targetLanguage) => {
  try {
    // Get language code for Google
    const targetLanguageCode = await getLanguageCodeForGoogle(targetLanguage);

    // Construct translation request
    const request = {
      parent: `projects/${googleProjectId}/locations/${location}`,
      contents: [text],
      mimeType: 'text/plain', // Mime type of the input text
      targetLanguageCode,
    };

    // Perform translation
    const [response] = await translationClientV3.translateText(request);
    const translatedText = response.translations[0].translatedText;
    return translatedText;

  } catch (error) {
    console.error('Error in Google Translate v3:', error);
    throw error;
  }
};

module.exports = {
  googleTranslateTextV3,
};
