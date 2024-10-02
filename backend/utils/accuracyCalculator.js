
const OpenAIApi = require("openai");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIApi({
  apiKey: apiKey,
});

const satisfactionLevels = [
  "Very Unsatisfied",
  "Unsatisfied",
  "Neutral",
  "Satisfied",
  "Very Satisfied"
];

const rateTranslation = async (originalText, originalLanguage, translatedText, targetLanguage) => {
  try {

    const prompt = `Rate the following translation on a scale from 1 (Very Unsatisfied) to 5 (Very Satisfied) based on its accuracy and meaning preservation:
    
    Original Text (${originalLanguage}): "${originalText}"
    Translated Text (${targetLanguage}): "${translatedText}"
    
    Please provide a satisfaction rating as one of the following: Very Unsatisfied, Unsatisfied, Neutral, Satisfied, or Very Satisfied.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4', 
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      max_tokens: 120,
      temperature: 0.3,
    });

    const satisfactionRating = response.choices[0].message.content.trim();

    if (satisfactionLevels.includes(satisfactionRating)) {
      return satisfactionRating;
    } else {
      console.error(`Unexpected rating from model: ${satisfactionRating}`);
      return "Neutral";
    }
  } catch (error) {
    console.error('Error in rating translation:', error);
    return "Neutral";
  }
};

module.exports = {
  rateTranslation,
};
