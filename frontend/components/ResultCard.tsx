// ResultCard.tsx
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ResultCardProps {
  result: string;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, className }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`min-w-[250px] max-w-md mx-auto p-4 pr-14 bg-[#FAFAFA] rounded-lg shadow-md relative ${className}`}>
      <div className="absolute top-2 right-2 flex items-center space-x-1 cursor-pointer" onClick={handleCopy}>
        <DocumentDuplicateIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        <span className="text-xs text-gray-500">{isCopied ? 'Copied!' : 'Copy'}</span>
      </div>
      <p className="text-gray-700 text-sm whitespace-pre-line">{result}</p>
    </div>
  );
};

export default ResultCard;