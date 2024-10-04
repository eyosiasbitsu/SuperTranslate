// services/googleTranslateV2Service.js

const { Translate } = require('@google-cloud/translate').v2;
const path = require('path');
const { getLanguageCodeForGoogle } = require('../utils/languageMapperService');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../utils/supertranslate.json');

const translateV2 = new Translate();

const googleTranslateTextV2 = async (text, targetLanguage) => {
  try {
    const targetLanguageCode = await getLanguageCodeForGoogle(targetLanguage);

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
