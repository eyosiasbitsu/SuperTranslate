export type translateAPIRequest = {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
};

export type translateAPIResponse = {
  model: string;
  translation: string;
  satisfaction: number;
  time: string;
};

export type TranslateCardProps = {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  setRequestLanguage: React.Dispatch<React.SetStateAction<string>>;
};

export type ModelRowProps = {
  modelLabel: string,
  modelValue: string,
  originalText: string,
  originalLanguage: string,
  outputLanguage: string,
  judgeResult: boolean,
  judgeModel: string,
  setOriginalText: React.Dispatch<React.SetStateAction<string>>;
};

export type JudgingCardProps = {
  className?: string,
  sourceLanguage: string,
  targetLanguage: string,
  text: string,
  judgeText: boolean,
  judgeModel: string,
};

export type reverseTranslateAPIRequest = {
  model: string;
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
};

export type reverseTranslateAPIResponse = {
    model: string;
    translation: string;
    satisfaction: string;
    time: string;
};

export type ModelCardProps = {
  modelName: string,
  accuracy: string,
  className?: string,
}

export type TranslationResultCardProps = {
  result: string,
  className?: string,
  time: string,
  isLoading: boolean,
}

export type JudgeSelectorProps = {
  selectedJudge: string,
  setSelectedJudge: (service: string) => void,
  // onJudgeChange: () => void
}

export type LanguageSelectorProps = {
  setLanguage: (language: string) => void;
  placeHolder: string;
};

