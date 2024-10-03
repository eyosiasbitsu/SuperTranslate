import { create } from 'zustand';

type TranslationState = {
  inputText: string;
  requestLanguage: string;
  responseLanguage: string;
  translations: Array<{
    model: string;
    translation: string;
    satisfaction: string;
  }> | null;
  loading: boolean;  // Added loading state
  setInputText: (text: string) => void;
  setRequestLanguage: (language: string) => void;
  setResponseLanguage: (language: string) => void;
  setTranslations: (translations: Array<{
    model: string;
    translation: string;
    satisfaction: string;
  }> | null) => void;
  setLoading: (loading: boolean) => void;  // Added setter for loading state
};

const useTranslationStore = create<TranslationState>((set) => ({
  inputText: '',
  requestLanguage: 'English',
  responseLanguage: 'French',
  translations: null,
  loading: false,  // Initialize loading state to false
  
  setInputText: (text: string) => set({ inputText: text }),
  setRequestLanguage: (language: string) => set({ requestLanguage: language }),
  setResponseLanguage: (language: string) => set({ responseLanguage: language }),
  setTranslations: (translations) => set({ translations }),
  setLoading: (loading: boolean) => set({ loading }),  // Function to set loading state
}));

export default useTranslationStore;
