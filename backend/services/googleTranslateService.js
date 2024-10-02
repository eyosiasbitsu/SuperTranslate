
const { Translate } = require('@google-cloud/translate').v2;

const translateClient = new Translate({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  key: process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY,
});

const translate = async (text, source_language, target_languages) => {
  try {
    const [translatedText] = await translateClient.translate(text, target_languages[0]); // Use the first target language
    return translatedText;
  } catch (error) {
    console.error('Error in Google Translate:', error);
    throw error;
  }
};

module.exports = {
  translate,
};
