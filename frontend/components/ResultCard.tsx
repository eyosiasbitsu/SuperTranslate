import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ResultCardProps {
  result: string;
  className?: string;
  time: string; // Assuming time is in milliseconds
  loading: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, className, time, loading }) => {
  const [isCopied, setIsCopied] = useState(false);
  console.log("loading", loading);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Convert time from milliseconds to seconds
  const timeInSeconds = (parseFloat(time) / 1000).toFixed(2);

  return (
    <div className={`min-w-[250px] max-w-md mx-auto p-4 pr-14 rounded-lg shadow-md relative ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center mt-2">
          {loading ? (
            // Show clock when loading
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
            // Show time in seconds after loading is complete
            <span className="text-xs text-gray-600">{`It took: ${timeInSeconds} seconds`}</span>
          )}
        </div>

        {/* Copy icon and time display in the same line */}
        <div className="flex items-center space-x-2">
          <div
            className="cursor-pointer flex items-center space-x-1"
            onClick={handleCopy}
          >
            <DocumentDuplicateIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            <span className="text-xs text-gray-500">{isCopied ? 'Copied!' : 'Copy'}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 text-sm whitespace-pre-line pt-3 flex justify-center">{result}</p>
    </div>
  );
};

export default ResultCard;
