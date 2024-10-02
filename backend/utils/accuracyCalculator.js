// utils/accuracyCalculator.js
const OpenAIApi = require("openai");
const dotenv = require("dotenv");
const path = require('path');

// Configure dotenv to load the .env file from the correct path
dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAIApi({
  apiKey: apiKey,
});

// Predefined satisfaction levels
const satisfactionLevels = [
  "Very Unsatisfied",
  "Unsatisfied",
  "Neutral",
  "Satisfied",
  "Very Satisfied"
];

const rateTranslation = async (originalText, originalLanguage, translatedText, targetLanguage) => {
  try {
    // Construct a prompt for rating the translation
    const prompt = `Rate the following translation on a scale from 1 (Very Unsatisfied) to 5 (Very Satisfied) based on its accuracy and meaning preservation:
    
    Original Text (${originalLanguage}): "${originalText}"
    Translated Text (${targetLanguage}): "${translatedText}"
    
    Please provide a satisfaction rating as one of the following: Very Unsatisfied, Unsatisfied, Neutral, Satisfied, or Very Satisfied.`;

    // Make a request to the OpenAI model
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Switch to the appropriate model
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      max_tokens: 60, // Adjust token limit as necessary
      temperature: 0.3, // Low temperature for more deterministic output
    });

    // Extract the rating from the model's response
    const satisfactionRating = response.choices[0].message.content.trim();

    // Validate and return the rating
    if (satisfactionLevels.includes(satisfactionRating)) {
      return satisfactionRating;
    } else {
      console.error(`Unexpected rating from model: ${satisfactionRating}`);
      return "Neutral"; // Fallback to a default rating if the response is unexpected
    }
  } catch (error) {
    console.error('Error in rating translation:', error);
    return "Neutral"; // Return a default satisfaction rating in case of error
  }
};

module.exports = {
  rateTranslation,
};
