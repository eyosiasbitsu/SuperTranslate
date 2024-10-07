import React from 'react';
import TranslatoreCard from './TranslatoreCard';
import ResultCard from './ResultCard';
import MeaningCard from './Meaning';

interface TranslationContainerProps {
  service: string;
  accuracy: string;
  result: string;
  meaning: string;
  time:string;
  loading:boolean;
}

const TranslationContainer: React.FC<TranslationContainerProps> = ({
  service,
  accuracy,
  result,
  meaning,
  time,
  loading
}) => {
  return (
    <div className="flex flex-row gap-4 flex-wrap w-full items-center">
      <TranslatoreCard className="flex-1 min-w-[150px]" service={service} accuracy={accuracy} />
      <div className="flex justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-8 h-8 text-gray-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 12h16m-4-4l4 4-4 4"
          />
        </svg>
      </div>
      <ResultCard className="flex-1 min-w-[150px] min-h-24" result={result} time={time} loading={loading} />
      <MeaningCard className="flex-1 min-w-[150px] min-h-24" Meaning={meaning} />
    </div>
  );
};

export default TranslationContainer;
