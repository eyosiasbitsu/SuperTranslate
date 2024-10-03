import useTranslationStore from '../store/translateStore';

export const translateText = async () => {
  const { inputText, requestLanguage, responseLanguage, setTranslations, setLoading } = useTranslationStore.getState();
  
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
    setLoading(true);  // Start loading before the API call
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
      const errorData = await response.json(); // Log error details
      console.error('Translation failed. Status:', response.status, 'Error:', errorData);
    }
  } catch (error) {
    console.error('API call error:', error);
  } finally {
    setLoading(false);  // Stop loading after the API call completes
  }
};
