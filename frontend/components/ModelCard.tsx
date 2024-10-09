// components/ModelCard.tsx

import { ModelCardProps } from '@/types/translator';
import { SparklesIcon } from '@heroicons/react/24/outline';



const ModelCard: React.FC<ModelCardProps> = ({ modelName, accuracy, className }) => {
  return (
    <div className={`flex flex-col gap-2 min-w-[250px] max-w-md mx-auto p-4 border border-gray-200 rounded-lg shadow-md bg-gray-300 opacity-90 ${className}`}>
      <div className="flex-shrink-0">
        <div className="h-10 w-10 bg-gray-100 p-2 rounded-full">
          <SparklesIcon className="h-6 w-6 text-gray-400" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{modelName}</h2>
      <p className="text-sm text-gray-500">{accuracy}</p>
    </div>
  );
};

export default ModelCard;
