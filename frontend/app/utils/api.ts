import useTranslationStore from '../store/translateStore';

export const translateText = async () => {
  const { inputText, requestLanguage, responseLanguage, setTranslations, setLoading, setMeaning } = useTranslationStore.getState();
  
  console.log('Translating with the following data:');
  console.log('Input Text:', inputText);
  console.log('Request Language:', requestLanguage);
  console.log('Response Language:', responseLanguage);

  const apiUrl = 'https://supertranslate.onrender.com/api/translate';
  const payload = {
    text: inputText,
    source_language: requestLanguage,
    target_language: responseLanguage,
  };

  console.log('Payload for API call:', payload);

  try {
    setLoading(true);  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('API request sent to:', apiUrl);

    if (response.ok) {
      console.log('Received successful response from API.');
      const data = await response.json();
      console.log('Response data from API:', data);
      setTranslations(data);
      console.log('Translations updated in store:', data);
    } else {
      const errorData = await response.json();
      console.error('Translation failed. Status:', response.status, 'Error:', errorData);
      throw new Error(`Translation failed: ${errorData.message || 'Unknown error'}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('API call error in translateText:', error.message);
    } else {
      console.error('Unknown error in translateText');
    }
  } finally {
    setLoading(false);  
  }
};

export const reverseTranslate = async (texts:string[]) => {
  const { requestLanguage, responseLanguage, setMeaning, model } = useTranslationStore.getState();

  console.log('Reverse translating with the following data:');
  console.log('Model:', model);
  console.log('Request Language:', responseLanguage);
  console.log('Response Language:', requestLanguage);
  console.log('Texts:', texts);

  const apiUrl = 'https://supertranslate.onrender.com/api/translate/bymodel';
  const payload = {
    model: model,
    source_language: responseLanguage,
    target_language: requestLanguage,
    texts: texts,
  };

  try {
    // Sending POST request to the API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Error in reverseTranslate:');
      const errorData = await response.json();
      throw new Error(`Error: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    // Parsing the response data
    const data = await response.json();
    console.log('Translation response:', data);

    // Extracting translations from the data
    const meanings = data.map((item: { translation: string }) => item.translation);
    console.log('Extracted meanings:', meanings);

    // Setting the meanings
    setMeaning(meanings);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in reverseTranslate:', error.message);
    } else {
      console.error('Unknown error in reverseTranslate');
    }
  }
};
