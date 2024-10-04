const { Translate } = require('@google-cloud/translate').v2;
const { getLanguageCodeForGoogle } = require('../utils/languageMapperService');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize Google Cloud Translate client
const translateV2 = new Translate();

const googleTranslateTextV2 = async (text, targetLanguage) => {
  try {
    // Get language code for Google
    const targetLanguageCode = await getLanguageCodeForGoogle(targetLanguage);

    // Perform translation
    const [translation] = await translateV2.translate(text, targetLanguageCode);
    return translation;

  } catch (error) {
    console.error('Error in Google Translate v2:', error);
    throw error;
  }
};

module.exports = {
  googleTranslateTextV2,
};
