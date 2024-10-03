'use client';

import TranslateCard from '../components/TranslateCard';
import TranslateResponseCard from '../components/TranslateResponseCard';
import TranslateResultCard from '../components/TranslateResultCard';
import LanguageSelector from '../components/SelectLanguageButton';
import { translateText } from './utils/api';
import useTranslationStore from './store/translateStore';
import { MdOutlineTranslate } from "react-icons/md";

export default function Home() {
  const { setResponseLanguage, translations, loading } = useTranslationStore();

  const handleTranslate = () => {
    translateText();
  };

  return (
    <div className="bg-white text-black grid grid-rows justify-items-center min-h-screen pb-20 gap-8 sm:p-10 font-[family-name:var(--font-geist-sans)]">

      <main className="flex flex-col items-center gap-4 min-h-screen justify-center overflow-y-auto top-1 w-[80%]">
        <h1 className="text-2xl text-black font-bold">SuperTranslate</h1>

        <TranslateCard />

        {/* Button for Response Language */}
        <div className="flex justify-start w-full -mb-3 gap-3">
          <LanguageSelector setLanguage={setResponseLanguage} placeHolder="Output Language" />
          <button
            onClick={handleTranslate}
            className="w-32 mt-2 h-8 text-center bg-[#EEEEEE] text-base rounded-3xl hover:bg-indigo-700 transition-colors flex items-center justify-between px-4"
          >
            <MdOutlineTranslate />
            Translate
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && <div className="text-lg text-blue-600">Translating...</div>}

        <div className="flex justify-start flex-wrap gap-6 w-full">
          {/* First Column */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <TranslateResponseCard className="w-full" service="Open Ai response" accuracy={Array.isArray(translations) && translations.length > 0? translations[0].satisfaction:""} />
            {Array.isArray(translations) && translations.length > 0 && (
              <TranslateResultCard className="w-full min-h-24" result={translations[0].translation} />
            )}
          </div>

          {/* Second Column */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <TranslateResponseCard className="w-full" service="Azure translator response" accuracy={Array.isArray(translations) && translations.length > 1? translations[1].satisfaction:""} />
            {Array.isArray(translations) && translations.length > 1 && (
              <TranslateResultCard className="w-full min-h-24" result={translations[1].translation} />
            )}
          </div>

          {/* Third Column */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <TranslateResponseCard className="w-full" service="Google automl response" accuracy={Array.isArray(translations) && translations.length > 2? translations[2].satisfaction:""} />
            {Array.isArray(translations) && translations.length > 2 && (
              <TranslateResultCard className="w-full min-h-24" result={translations[2].translation} />
            )}
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
