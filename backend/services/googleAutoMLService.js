
const automl = require('@google-cloud/automl');

const client = new automl.PredictionServiceClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const translate = async (text, source_language, target_languages) => {
  try {
    const modelId = process.env.GOOGLE_CLOUD_AUTOML_MODEL_ID;
    const request = {
      name: client.modelPath(process.env.GOOGLE_CLOUD_PROJECT_ID, 'us-central1', modelId),
      payload: {
        textSnippet: {
          content: text,
          mimeType: 'text/plain',
        },
      },
    };

    const [response] = await client.predict(request);
    return response.payload[0].translation.translatedText;
  } catch (error) {
    console.error('Error in Google AutoML Translation:', error);
    throw error;
  }
};

module.exports = {
  translate,
};
