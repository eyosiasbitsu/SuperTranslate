import { MicrophoneIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import LanguageSelector from "./LanguageSelector";
import { TranslateCardProps } from "@/types/translator";

const TranslateCard: React.FC<TranslateCardProps> = ({
  inputText,
  setInputText,
  setRequestLanguage,
}) => {
  return (
    <div className="max-w-2xl w-full mx-auto p-2 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div className="flex pb-3">
          <PaperClipIcon className="h-5 w-7 text-gray-500" />
          <h6> Give me something to translate</h6>
        </div>
        <MicrophoneIcon className="h-5 w-7 text-gray-500 mr-4" />
      </div>

      {/* Text area for input */}
      <textarea
        id="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        rows={4}
        className="w-full p-4 pb-1 text-lg rounded-md focus:outline-none bg-[#FAFAFA] resize-none overflow-y-hidden"
        placeholder="Give me something to translate"
      />

      {/* Language selector */}
      <LanguageSelector
        setLanguage={setRequestLanguage}
        placeHolder="Source Language"
      />
    </div>
  );
};

export default TranslateCard;
