// utils/languageMapperService.js
const OpenAIApi = require("openai");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIApi({
  apiKey: apiKey,
});

const getLanguageCode = async (languageName) => {
  try {
    const prompt = `Provide the ISO 639-1 language code for the language "${languageName}". Ensure that your response is only the two-letter language code, without any additional text or explanation.`;

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

    // Ensure the response is a two-letter code (basic validation)
    if (languageCode.length === 2) {
      return languageCode.toLowerCase();
    } else {
      console.error(`Unexpected response for language code: ${languageCode}`);
      throw new Error(`Could not determine ISO code for: ${languageName}`);
    }
  } catch (error) {
    console.error('Error in getting language code:', error);
    throw error;
  }
};

module.exports = {
  getLanguageCode,
};
