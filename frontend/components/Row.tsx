import React from 'react';
import TranslatoreCard from './TranslatoreCard';
import ResultCard from './ResultCard';
import MeaningCard from './Meaning';

interface TranslationContainerProps {
  service: string;
  accuracy: string;
  result: string;
  meaning: string;
}

const TranslationContainer: React.FC<TranslationContainerProps> = ({
  service,
  accuracy,
  result,
  meaning,
}) => {
  return (
    <div className="flex flex-row gap-4 flex-wrap w-full">
      <TranslatoreCard className="flex-1 min-w-[150px]" service={service} accuracy={accuracy} />
      <ResultCard className="flex-1 min-w-[150px] min-h-24" result={result} />
      <MeaningCard className="flex-1 min-w-[150px] min-h-24" Meaning={meaning} />
    </div>
  );
};

export default TranslationContainer;
