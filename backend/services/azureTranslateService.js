
const axios = require('axios');
const dotenv = require("dotenv");
const path = require('path');
const { getLanguageCodeForAzure } = require('../utils/languageMapperService');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.AZURE_TRANSLATOR_API_KEY;
const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
const region = process.env.AZURE_REGION;

const azureTranslateText = async (text, targetLanguage) => {
  try {

    const targetLanguageCode = await getLanguageCodeForAzure(targetLanguage);

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

    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Error in Azure Translator:', error);
    throw error;
  }
};

module.exports = {
  azureTranslateText,
};
