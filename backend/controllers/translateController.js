const { openaiTranslate } = require('../services/openaiService');
const { azureTranslateText } = require('../services/azureTranslateService');
const { deeplTranslateText } = require('../services/deeplService');
const { googleTranslateTextV2 } = require('../services/googleTranslateV2Service');
const { googleTranslateTextV3 } = require('../services/googleTranslateV3Service');
const { rateTranslation } = require('../utils/accuracyCalculator');
const { getLanguageCodeForAzure, getLanguageCodeForDeepL, getLanguageCodeForGoogle, getLanguageCodeForOpenAI } = require('../utils/languageMapperService');
const { performance } = require('perf_hooks');

const { downloadFileFromCloudinary } = require('../utils/cloudinaryDownloader');
const { splitPdfIntoPages, splitDocxIntoPages } = require('../utils/documentSplitter');
const uploadToCloudinary = require('../utils/cloudinaryUploader');
const fs = require('fs').promises;
const { PDFDocument, rgb } = require('pdf-lib');

// Unified Translation Endpoint for text
const unifiedTranslateEndpoint = async (req, res) => {
  const modelMap = {
    openai: openaiTranslate,
    azure: azureTranslateText,
    deepl: deeplTranslateText,
    googleV2: googleTranslateTextV2,
    googleV3: googleTranslateTextV3,
  };

  const supportedModels = new Set(Object.keys(modelMap));

  try {
    const { model, text, sourceLanguage, targetLanguage } = req.body;

    if (!model || !text || !targetLanguage) {
      return res.status(400).json({ message: 'Model, text, and targetLanguage are required fields.' });
    }

    if (!supportedModels.has(model)) {
      return res.status(400).json({ message: 'Unsupported model specified.' });
    }

    // Correct language code
    let correctedLanguageCode;
    try {
      if (model === 'azure') {
        correctedLanguageCode = await getLanguageCodeForAzure(targetLanguage);
      } else if (model === 'deepl') {
        correctedLanguageCode = await getLanguageCodeForDeepL(targetLanguage);
      } else if (model === 'googleV2' || model === 'googleV3') {
        correctedLanguageCode = await getLanguageCodeForGoogle(targetLanguage);
      } else if (model === 'openai') {
        correctedLanguageCode = await getLanguageCodeForOpenAI(targetLanguage);
      }
    } catch (error) {
      return res.status(400).json({ message: `Error getting language code: ${error.message}` });
    }

    // Get the translation function from the model map
    const translateFunction = modelMap[model];

    // Measure time and translate
    const start = performance.now();
    let translation;
    try {
      translation = await translateFunction(text, correctedLanguageCode);
    } catch (error) {
      return res.status(500).json({ message: `Translation error: ${error.message}` });
    }
    const end = performance.now();

    // Calculate satisfaction
    let satisfaction;
    try {
      satisfaction = await rateTranslation(text, sourceLanguage, translation, targetLanguage);
    } catch (error) {
      console.error('Error calculating satisfaction:', error.message);
      satisfaction = 'N/A';
    }

    // Send the response
    res.json({
      model,
      translation,
      satisfaction,
      time: ((end - start) / 1000).toFixed(2) // Time in seconds
    });
  } catch (error) {
    console.error('Error during translation:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Translate PDF or DOCX File
const translateDocument = async (req, res) => {
  try {
    const { cloudinaryUrl, sourceLanguage, destinationLanguage } = req.body;
    const fileType = cloudinaryUrl.endsWith('.pdf') ? 'pdf' : 'docx';

    // Step 1: Download the file
    let downloadedFilePath;
    try {
      downloadedFilePath = await downloadFileFromCloudinary(cloudinaryUrl, fileType);
    } catch (error) {
      return res.status(500).json({ message: `Error downloading file: ${error.message}` });
    }

    // Step 2: Split the document into pages
    let pagesText;
    try {
      if (fileType === 'pdf') {
        pagesText = await splitPdfIntoPages(downloadedFilePath);
      } else {
        pagesText = await splitDocxIntoPages(downloadedFilePath);
      }
    } catch (error) {
      return res.status(500).json({ message: `Error splitting document: ${error.message}` });
    }

    // Step 3: Translate each page
    const translatedPages = [];
    for (const page of pagesText) {
      try {
        const translatedPage = await openaiTranslate(page, sourceLanguage, destinationLanguage);
        translatedPages.push(translatedPage);
      } catch (error) {
        return res.status(500).json({ message: `Error translating page: ${error.message}` });
      }
    }

    // Step 4: Create a PDF with the translated text
    let pdfBytes;
    try {
      const pdfDoc = await PDFDocument.create();
      for (const translatedPage of translatedPages) {
        const page = pdfDoc.addPage();
        page.drawText(translatedPage, {
          x: 50,
          y: 750,
          size: 12,
          color: rgb(0, 0, 0),
        });
      }
      pdfBytes = await pdfDoc.save();
    } catch (error) {
      return res.status(500).json({ message: `Error creating PDF: ${error.message}` });
    }

    const translatedPdfPath = `./downloads/translated_${Date.now()}.pdf`;
    try {
      await fs.writeFile(translatedPdfPath, pdfBytes);
    } catch (error) {
      return res.status(500).json({ message: `Error saving PDF: ${error.message}` });
    }

    // Step 5: Upload translated PDF to Cloudinary
    let uploadedUrl;
    try {
      uploadedUrl = await uploadToCloudinary(translatedPdfPath);
    } catch (error) {
      return res.status(500).json({ message: `Error uploading to Cloudinary: ${error.message}` });
    }

    // Step 6: Return Cloudinary URL
    return res.json({ success: true, cloudinaryUrl: uploadedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  unifiedTranslateEndpoint,
  translateDocument
};
