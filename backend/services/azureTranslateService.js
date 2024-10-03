// services/azureTranslateService.js
const axios = require('axios');
const dotenv = require("dotenv");
const path = require('path');
const { getLanguageCode } = require('../utils/languageMapperService'); // Use OpenAI for language mapping

// Configure dotenv to load the .env file from the correct path
dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.AZURE_TRANSLATOR_API_KEY;
const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT; // Ensure this does not have a trailing slash
const region = process.env.AZURE_REGION; // Add region to .env file

const azureTranslateText = async (text, targetLanguage) => {
  try {
    // Get ISO language code using OpenAI
    const targetLanguageCode = await getLanguageCode(targetLanguage);

    const response = await axios.post(
      `${endpoint}/translate`,
      [{ "Text": text }],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Ocp-Apim-Subscription-Region': region,
          'Content-Type': 'application/json'
        },
        params: {
          'api-version': '3.0',
          'to': targetLanguageCode
        }
      }
    );

    // Return the translated text
    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Error in Azure Translator:', error);
    throw error;
  }
};

module.exports = {
  azureTranslateText,
};
