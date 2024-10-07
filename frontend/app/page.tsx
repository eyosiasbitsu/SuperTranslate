'use client';

import TranslateCard from '../components/TranslateCard';
import LanguageSelector from '../components/SelectLanguageButton';
import { translateText, reverseTranslate } from './utils/api';  // Import reverseTranslate
import useTranslationStore from './store/translateStore';
import { MdOutlineTranslate } from "react-icons/md";
import TranslationContainer from '../components/Row';
import MeaningSelector from '../components/MeaningSelectore';
import { useState } from 'react';

export default function Home() {
  const { setResponseLanguage, setRequestLanguage,meaning, translations = [], inputText, requestLanguage, responseLanguage, loading } = useTranslationStore(); 
  const [selectedService, setSelectedService] = useState<string>(''); 
  
  const handleTranslate = async () => {
    await translateText();  
  };
  
  const handleLanguageChange = async () => {     
    const model = getMeaningForService (selectedService)    
    const texts = translations ? translations.map(t => t.translation) : [];   
    
    await reverseTranslate( texts);  
  };

  // Function to get the meaning based on the selected service
  const getMeaningForService = (service: string) => {
    const translation = translations?.find(translation =>
      translation.model.toLowerCase().includes(service.toLowerCase())
    );
    return translation ? translation.model : '';
  };  

  return (
    <div className="grid grid-rows text-black bg-white justify-items-center min-h-screen pb-20 gap-8 sm:p-10 font-[family-name:var(--font-geist-sans)]">

      <main className="flex flex-col items-center gap-4 min-h-screen justify-center overflow-y-auto top-1 w-[80%]">
        <h1 className="text-2xl font-bold">SuperTranslate</h1>

        <TranslateCard />

        {/* Button for Response Language */}
        <div className="flex justify-start w-full -mb-3 gap-3">
          <div className="flex gap-4 w-full">
            <LanguageSelector setLanguage={setResponseLanguage} placeHolder="Output Language" />
            <button
              onClick={handleTranslate}
              className="w-32 mt-2 h-8 text-center bg-[#EEEEEE] text-base rounded-3xl hover:bg-indigo-700 transition-colors flex items-center justify-between px-4"
            >
              <MdOutlineTranslate />
              Translate
            </button>
          </div>
          <MeaningSelector 
            selectedService={selectedService} 
            setSelectedService={setSelectedService} 
            onServiceChange= {handleLanguageChange}
          />
        </div>
        {/* Loading Indicator */}
        {loading && <div className="text-lg text-blue-600">Translating...</div> }

        {/* Translations Rendering */}
        <div className="flex flex-col justify-center w-full gap-4">
          {loading ? (
            
            // Render placeholders for each translation item
            Array.from({ length: translations?.length || 3 }).map((_, index) => (
              
              <TranslationContainer
                key={index}
                service="Model"
                accuracy="Calculating"
                result="Translating..."
                meaning=""
                time="00:00"
                loading
              />
            ))
          ) : (
            // Render actual translations after loading is complete
            (translations ?? []).map((translation, index) => (
              <TranslationContainer
                key={index}
                service={translation.model || "Unknown"}
                accuracy={translation.satisfaction || "Unknown"}
                result={translation.translation || "No result"}
                meaning={meaning && meaning.length > index ? meaning[index] : "No meaning available"}
                time={new Date().toLocaleTimeString()}
                loading={loading}
              />
            ))
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
