// utils/languageMapperService.js
const OpenAIApi = require("openai");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIApi({
  apiKey: apiKey,
});

const getLanguageCodeForPrompt = async (languageName, targetService) => {
  try {
    // Customize the prompt for different services
    let prompt = '';

    if (targetService === 'azure') {
      prompt = `Provide the ISO 639-1 language code for the language "${languageName}". Ensure that your response is only the lowercase language code, without any additional text or explanation.`;
    } else if (targetService === 'deepl') {
      prompt = `Provide the correct language code for the language "${languageName}" that is supported by DeepL. Ensure that your response is only the capital letter language code, without any additional text or explanation.`;
    } else if (targetService === 'google') {
      prompt = `Provide the ISO 639-1 language code for the language "${languageName}". Ensure that your response is only the lowercase language code, without any additional text or explanation. This code will be used for Google Translate services.`;
    } else if (targetService === 'openai') {
      // For OpenAI, we don't need to get an ISO code, we just return the language name itself
      return languageName;
    } else {
      throw new Error('Invalid target service specified.');
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      max_tokens: 10,
      temperature: 0.3,
    });

    const languageCode = response.choices[0].message.content.trim();

    // Ensure the response is a valid two-letter code
    if (languageCode.length === 2) {
      return languageCode;
    } else {
      console.error(`Unexpected response for language code: ${languageCode}`);
      throw new Error(`Could not determine ISO code for: ${languageName}`);
    }
  } catch (error) {
    console.error('Error in getting language code:', error);
    throw error;
  }
};

// Function for getting language code for Azure
const getLanguageCodeForAzure = async (languageName) => {
  return await getLanguageCodeForPrompt(languageName, 'azure');
};

// Function for getting language code for DeepL
const getLanguageCodeForDeepL = async (languageName) => {
  return (await getLanguageCodeForPrompt(languageName, 'deepl')).toUpperCase(); // DeepL requires uppercase codes
};

// Function for getting language code for Google
const getLanguageCodeForGoogle = async (languageName) => {
  return await getLanguageCodeForPrompt(languageName, 'google');
};

// Function for getting language code for OpenAI
const getLanguageCodeForOpenAI = async (languageName) => {
  return languageName; // For OpenAI, return the language name itself
};

module.exports = {
  getLanguageCodeForAzure,
  getLanguageCodeForDeepL,
  getLanguageCodeForGoogle,
  getLanguageCodeForOpenAI,
};
