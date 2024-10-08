import { create } from 'zustand';

type TranslationState = {
  inputText: string;
  requestLanguage: string;
  responseLanguage: string;
  model: string;
  meaning: string[];
  translations: Array<{
    model: string;
    translation: string;
    satisfaction: string;
    time: string;
  }>;
  loading: boolean;
  setInputText: (text: string) => void;
  setRequestLanguage: (language: string) => void;
  setResponseLanguage: (language: string) => void;
  setMeaning: (meaning: string[]) => void;
  setModel: (model: string) => void;
  setTranslations: (translations: Array<{
    model: string;
    translation: string;
    satisfaction: string;
    time: string;
  }>) => void;
  setLoading: (loading: boolean) => void;
};

const useTranslationStore = create<TranslationState>((set) => ({
  inputText: '',
  requestLanguage: '',
  responseLanguage: '',
  model: '',
  meaning: [],
  translations: [], // Default to an empty array
  loading: false,
  
  setInputText: (text: string) => set({ inputText: text }),
  setRequestLanguage: (language: string) => set({ requestLanguage: language }),
  setResponseLanguage: (language: string) => set({ responseLanguage: language }),
  setModel: (model: string) => set({ model }),
  setMeaning: (meaning: string[]) => set({ meaning }),
  setTranslations: (translations) => set({ translations }),
  setLoading: (loading: boolean) => set({ loading }),
}));

export default useTranslationStore;
