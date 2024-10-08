
const OpenAIApi = require("openai");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIApi({
  apiKey: apiKey,
});

const openaiTranslate = async (text, target_language) => {
  try {

    const prompt = `Translate the following text to ${target_language}: "${text}"`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
    });


    const translatedText = response.choices[0].message.content.trim();

    return translatedText;
  } catch (error) {
    console.error("Error in OpenAI translation:", error);
    throw error;
  }
};

module.exports = {
  openaiTranslate,
};
