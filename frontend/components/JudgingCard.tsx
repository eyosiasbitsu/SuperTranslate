// components/JudgingCard.tsx

import { useTranslateTextMutation } from "@/app/Redux/translateAPI";
import { JudgingCardProps } from "@/types/translator";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";

const JudgingCard: React.FC<JudgingCardProps> = ({
  className,
  sourceLanguage,
  targetLanguage,
  text,
  judgeText,
  judgeModel,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [judgeResult, setJudgeResult] = useState("");
  const [reverseTranslateText, { isLoading, isSuccess, isError }] =
    useTranslateTextMutation();

  const handleReverseTranslate = async () => {
    if (text) {
      const res = await reverseTranslateText({
        model: judgeModel,
        sourceLanguage: targetLanguage,
        targetLanguage: sourceLanguage,
        text: text,
      });
      setJudgeResult(res.data?.translation as string);
     
    }
  };

  useEffect(() => {
    handleReverseTranslate();
  }, [judgeText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(judgeResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  let result = "No result to validate!";
  if (isLoading) {
    result = "Validating...";
  } else if (isError) {
    result = "Couldn't validate!";
  } else if (isSuccess) {
    result = judgeResult;
  }

  return (
    <div
      className={`min-w-[250px] max-w-md mx-auto p-4 rounded-lg shadow-md relative bg-gray-300 opacity-90 ${className}`}
    >
      <div className="flex justify-end items-center">
        {/* Copy functionality */}
        <div className="flex items-center space-x-2">
          <div
            className="cursor-pointer flex items-center space-x-1"
            onClick={handleCopy}
          >
            {isCopied && (
              <IoMdCheckmark className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            )}
            {!isCopied && (
              <DocumentDuplicateIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            )}{" "}
            <span className="text-xs text-gray-500">
              {isCopied ? "Copied!" : "Copy"}
            </span>
          </div>
        </div>
      </div>

      {/* Display the result */}
      <p className="text-gray-700 text-sm whitespace-pre-line pt-3 flex justify-center">
        {result}
      </p>
    </div>
  );
};

export default React.memo(JudgingCard);
