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
}) => {
  const [translationResult, setTranslationResult] = useState("");
  const [time, setTime] = useState("");
  const [satisfaction, setSatisfaction] = useState<string | undefined>("");

  const [translateText, { isLoading, isSuccess, isError }] =
    useTranslateTextMutation();

  const handleTranslate = async () => {


    if (originalText && originalLanguage && outputLanguage) {
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

      {/* Display Result Card */}
      <TranslationResultCard
        className="flex-1 min-w-[150px] min-h-24"
        result={result}
        time={time}
        isLoading={isLoading} //{loading && !translationData}
      />

      {/* Display Meaning Card */}
      <JudgingCard
        className="flex-1 min-w-[150px] min-h-24"
        judgeText={judgeResult}
        judgeModel={judgeModel}
        sourceLanguage={originalLanguage}
        targetLanguage={outputLanguage}
        text={translationResult}
      />
    </div>
  );
};

export default React.memo(ModelRow);
