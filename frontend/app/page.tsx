'use client';

import React, { useState } from 'react';
import TranslateCard from '../components/TranslateCard';
import LanguageSelector from '../components/SelectLanguageButton';
import { translateText, reverseTranslate } from './utils/api';
import useTranslationStore from './store/translateStore';
import { MdOutlineTranslate } from "react-icons/md";
import ResultCard from '../components/ResultCard';
import MeaningSelector from '../components/MeaningSelectore';
import TranslatoreCard from '../components/TranslatoreCard';
import MeaningCard from '../components/Meaning';

// Define your models
const models = [
  { model: 'openai', label: 'OpenAI' },
  { model: 'azure_translator', label: 'Azure Translator' },
  { model: 'deepl', label: 'DeepL' },
  { model: 'google_translate_v2', label: 'Google V2' },
  { model: 'google_translate_v3', label: 'Google V3' },
];

export default function Home() {
  const { setResponseLanguage, setRequestLanguage, meaning, translations = [], loading, setLoading, setTranslations } = useTranslationStore(); 
  const [selectedService, setSelectedService] = useState<string>(''); 
  const [hasTranslated, setHasTranslated] = useState<boolean>(false); // Track if translate button is clicked

  const handleTranslate = async () => {
    // Reset state on each click
    setHasTranslated(true);
    setLoading(true);
    setTranslations([]); // Clear previous translations before making a new request
    
    await translateText();  
    setLoading(false);
  };
  
  const handleLanguageChange = async () => {     
    const texts = translations ? translations.map(t => t.translation) : [];   
    await reverseTranslate(texts);  
  };

  return (
    <div className="grid grid-rows text-black bg-white justify-items-center min-h-screen pb-20 gap-8 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center gap-4 min-h-screen justify-center overflow-y-auto top-1 w-[80%]">
        <h1 className="text-2xl font-bold">SuperTranslate</h1>

        <TranslateCard />

        {/* Language and Service Selectors */}
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
            onServiceChange={handleLanguageChange}
          />
        </div>

        {/* Translations Rendering */}
        <div className="flex flex-col justify-center w-full gap-4">
          {models.map((modelObj, index) => {
            // Find the translation data for the current model
            const translationData = translations?.find((translation) => translation.model === modelObj.model);

            // Determine accuracy and result based on loading and data availability
            const accuracy = translationData ? translationData.satisfaction : 'Calculating';
            const result = translationData ? translationData.translation : 'Translating...';
            const time = translationData ? translationData.time : '00:00';
            const meaningText = meaning && meaning.length > index ? meaning[index] : "Please select a judge";

            // Display default state before translation
            if (!hasTranslated) {
              return (
                <div key={index} className="flex flex-row gap-4 flex-wrap w-full items-center">
                  {/* Display Model Details */}
                  <TranslatoreCard className="flex-1 min-w-[150px]" service={modelObj.label} accuracy="Waiting for translation..." />
                  {/* Display empty result and meaning cards */}
                  <ResultCard className="flex-1 min-w-[150px] min-h-24" result="" time="" loading={false} />
                  <MeaningCard className="flex-1 min-w-[150px] min-h-24" Meaning="" />
                </div>
              );
            }

            // Display loading or translation data once translation has started
            return (
              <div key={index} className="flex flex-row gap-4 flex-wrap w-full items-center">
                {/* Display Model Details */}
                <TranslatoreCard className="flex-1 min-w-[150px]" service={modelObj.label} accuracy={accuracy} />

                {/* Display Result Card */}
                <ResultCard className="flex-1 min-w-[150px] min-h-24" result={result} time={time} loading={loading && !translationData} />
                
                {/* Display Meaning Card */}
                <MeaningCard className="flex-1 min-w-[150px] min-h-24" Meaning={meaningText} />
              </div>
            );
          })}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
