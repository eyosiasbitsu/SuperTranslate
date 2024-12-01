import React, { useEffect, useState } from "react";
import ModelCard from "./ModelCard";
import TranslationResultCard from "./TranslationResultCard";
import MeaningCard from "./JudgingCard";
import JudgingCard from "./JudgingCard";
import { ModelRowProps } from "@/types/translator";
import { useTranslateTextMutation } from "@/app/Redux/translateAPI";
import { text } from "stream/consumers";

const ModelRow: React.FC<ModelRowProps> = ({
  modelLabel,
  modelValue,
  originalText,
  originalLanguage,
  outputLanguage,
  judgeResult,
  judgeModel,
  setOriginalText,
  imageUrl
}) => {
  const [translationResult, setTranslationResult] = useState("");
  const [time, setTime] = useState("");
  const [satisfaction, setSatisfaction] = useState<string | undefined>("");

  const [translateText, { isLoading, isSuccess, isError }] =
    useTranslateTextMutation();

  const handleTranslate = async () => {
    if (imageUrl){

      const res = await translateText({
        model: modelValue,
        text: originalText,
        sourceLanguage: originalLanguage,
        targetLanguage: outputLanguage,
      });
      setTranslationResult(res.data?.translation as string);
      setTime(res.data?.time as string);
      setSatisfaction(res.data?.satisfaction);
      setOriginalText("");

    }

    else if (originalText && originalLanguage && outputLanguage) {
      const res = await translateText({
        model: modelValue,
        text: originalText,
        sourceLanguage: originalLanguage,
        targetLanguage: outputLanguage,
      });
      setTranslationResult(res.data?.translation as string);
      setTime(res.data?.time as string);
      setSatisfaction(res.data?.satisfaction);
      setOriginalText("");
    }
  };

  useEffect(() => {
    handleTranslate();
  }, [originalText, originalLanguage, outputLanguage]);

  let result = "Waiting for translation!";
  if (isLoading) {
    result = "Translating...";
  } else if (isError) {
    result = "Couldn't translate!";
  } else if (isSuccess) {
    result = translationResult;
  }

  return (
    <div className="flex flex-row gap-4 flex-wrap w-full items-center">
      {/* Display Model Details */}
      <div className="w-1/3 ">
      <ModelCard
        className="flex-1 min-w-[150px]"
        modelName={modelLabel}
        accuracy={
          isLoading
            ? "Calculating..."
            : isSuccess
            ? (satisfaction as string)
            : "Waiting for translation"
        }
      />
      </div>
      

      {/* Display Result Card */}
      {!imageUrl && (
        <TranslationResultCard
        className="flex-1 min-w-[150px] min-h-24"
        result={result}
        time={time}
        isLoading={isLoading} //{loading && !translationData}
      />

      )}
      {imageUrl && (
        <div className="w-1/2 mx-auto mt-6 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Translation Output</h2>
      
        {/* Output content */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
          <p className="text-lg text-gray-700">
            {/* Translation result will go here */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non libero eget magna fermentum ultrices ac in enim.
          </p>
        </div>
      
        {/* Action buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition duration-200">
            Download
          </button>
        </div>
      </div>
      
      )}
      

      {/* Display Meaning Card */}
      {!imageUrl && (
        <JudgingCard
        className="flex-1 min-w-[150px] min-h-24"
        judgeText={judgeResult}
        judgeModel={judgeModel}
        sourceLanguage={originalLanguage}
        targetLanguage={outputLanguage}
        text={translationResult}
      />

      )}
      
    </div>
  );
};

export default React.memo(ModelRow);
