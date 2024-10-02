// services/openaiService.js
const OpenAIApi = require("openai");
const dotenv = require("dotenv");
const path = require('path');

// Configure dotenv to load the .env file from the correct path
dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIApi({
  apiKey: apiKey,
});

const translate = async (text, source_language, target_language) => {
  try {
    // Construct a prompt for the translation
    const prompt = `Translate the following text from ${source_language} to ${target_language}: "${text}"`;

    // Make a request to the OpenAI model
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use the desired model
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
    });

    // Extract and return the translated text from the response
    const translatedText = response.choices[0].message.content.trim();

    return translatedText;
  } catch (error) {
    console.error("Error in OpenAI translation:", error);
    throw error;
  }
};

module.exports = {
  translate,
};
