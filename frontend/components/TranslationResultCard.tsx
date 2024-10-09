// components/TranslationResultCard.tsx

import { TranslationResultCardProps } from "@/types/translator";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";

const TranslationResultCard: React.FC<TranslationResultCardProps> = ({
  result,
  className,
  time,
  isLoading,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Convert time from seconds string to a formatted string only if it's valid
  const timeInSeconds = !isLoading && time ? parseFloat(time).toFixed(2) : null;

  return (
    <div
      className={`min-w-[250px] max-w-md mx-auto p-4 rounded-lg shadow-md relative ${className} bg-gray-300 opacity-90`}
    >
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center mt-2">
          {isLoading ? (
            // Show spinner while loading
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 animate-spin-slow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" />
              <line x1="12" y1="6" x2="12" y2="12" stroke="currentColor" />
              <line x1="12" y1="12" x2="16" y2="12" stroke="currentColor" />
            </svg>
          ) : (
            // Show time once translation is complete and only if time is valid
            timeInSeconds && (
              <span className="text-xs text-gray-600">{`This model took: ${timeInSeconds} seconds`}</span>
            )
          )}
        </div>

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

export default TranslationResultCard;
