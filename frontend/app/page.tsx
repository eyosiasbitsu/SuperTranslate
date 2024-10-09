"use client";

import React, { useState } from "react";
import TranslateCard from "../components/TranslateCard";
import LanguageSelector from "../components/LanguageSelector";
import { MdOutlineTranslate } from "react-icons/md";
import JudgeSelector from "../components/JudgeSelector";
import ModelRow from "@/components/ModelRow";
import { GrValidate } from "react-icons/gr";
import bgImage from '@/public/images/super-translator-bg.svg';
import Image from "next/image";

// Define your models
const models = [
  { model: "openai", label: "OpenAI" },
  { model: "azure", label: "Azure Translator" },
  { model: "deepl", label: "DeepL" },
  { model: "googleV2", label: "Google V2" },
  { model: "googleV3", label: "Google V3" },
];

export default function Home() {
  const [selectedJudge, setSelectedJudge] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [requestLanguage, setRequestLanguage] = useState("");
  const [responseLanguage, setResponseLanguage] = useState("");
  const [errors, setErrors] = useState({
    inputText: "",
    sourceLanguage: "",
    targetLanguage: "",
  });
  const [judgeResult, setJudgeResult] = useState<boolean>(false); // Track if translate button is clicked

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    if (inputText.trim().length === 0) {
      newErrors.inputText = "Please enter text to translate!";
      valid = false;
    } else {
      newErrors.inputText = "";
    }
    if (requestLanguage.trim().length === 0) {
      newErrors.sourceLanguage = "Please choose source language!";
      valid = false;
    } else {
      newErrors.sourceLanguage = "";
    }
    if (responseLanguage.trim().length === 0) {
      newErrors.targetLanguage = "Please choose output language!";
      valid = false;
    } else {
      newErrors.targetLanguage = "";
    }
    setErrors(newErrors);
    return valid;
  };

  const handleTranslate = () => {
    // Reset state on each click
    // setHasTranslated(true);
    // setLoading(true);
    // setTranslations([]); // Clear previous translations before making a new request

    // await translateText();
    // setLoading(false);
    if (validateForm()) {
      setOriginalText(inputText);
    }
  };

  const handleJudge = () => {
    setJudgeResult(!judgeResult);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src={bgImage} // Update with your image path
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        {/* Optional Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 overflow-y-auto min-h-screen">
        <div className="grid grid-rows text-black justify-items-center min-h-screen pb-20 gap-8 sm:p-10 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col items-center gap-4 min-h-screen justify-center w-[80%]">
            <h1 className="text-2xl font-bold text-white">SuperTranslate</h1>
            {errors.inputText && (
              <div className="flex justify-start w-full">
                <p className="text-red-500">{errors.inputText}</p>
              </div>
            )}
            <TranslateCard
              inputText={inputText}
              setInputText={setInputText}
              setRequestLanguage={setRequestLanguage}
            />
            {errors.sourceLanguage && (
              <div className="flex justify-start w-full">
                <p className="text-red-500">{errors.sourceLanguage}</p>
              </div>
            )}

            {/* Language and Service Selectors */}
            <div className="flex justify-start w-full my-4 gap-3">
              <div className="flex items-center gap-4 w-full">
                <LanguageSelector
                  setLanguage={setResponseLanguage}
                  placeHolder="Output Language"
                />
                <button
                  onClick={handleTranslate}
                  className="px-12 py-2 text-center bg-[#EEEEEE] text-base rounded-2xl hover:bg-[#B0ACAC] transition-colors flex items-center justify-between"
                >
                  <MdOutlineTranslate />
                  <span className="ml-2">Translate</span>
                </button>
              </div>
              <div className="flex gap-4">
                <JudgeSelector
                  selectedJudge={selectedJudge}
                  setSelectedJudge={setSelectedJudge}
                />
                <button
                  onClick={handleJudge}
                  className="px-12 py-2 text-center bg-[#EEEEEE] text-base rounded-2xl hover:bg-[#B0ACAC] disabled:hover:bg-[#EEEEEE] transition-colors flex items-center justify-between"
                  disabled={selectedJudge === ""}
                >
                  <GrValidate />
                  <span className="ml-2">Validate</span>
                </button>
              </div>
            </div>
            {errors.targetLanguage && (
              <div className="flex justify-start w-full">
                <p className="text-red-500">{errors.targetLanguage}</p>
              </div>
            )}

            {/* Translations Rendering */}
            <div className="flex flex-col justify-center w-full gap-4">
              {models.map((model, idx) => (
                <ModelRow
                  key={idx}
                  originalText={originalText}
                  originalLanguage={requestLanguage}
                  outputLanguage={responseLanguage}
                  judgeResult={judgeResult}
                  judgeModel={selectedJudge}
                  modelLabel={model.label}
                  modelValue={model.model}
                  setOriginalText={setOriginalText}
                />
              ))}
            </div>
          </main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
        </div>
      </div>
    </div>
  
  );
}
