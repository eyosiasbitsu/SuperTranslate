import React from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import localeCodes from 'locale-codes';
import { LanguageSelectorProps } from '@/types/translator';

// Define the type for the language option
type LanguageOption = {
  value: string;
  label: string;
};

// Function to get all languages in the required format
const getAllLanguages = (): LanguageOption[] => {
  
  return localeCodes.all.map((language) => ({
    value: language.name,
    label: language.name,
  }));
};

// Custom styles for react-select with specific types
const customStyles: StylesConfig<LanguageOption, false> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#fff' : '#B0ACAC', // White background when focused
    border: state.isFocused ? '1px solid #000' : 'none', // Add border when focused
    boxShadow: 'none',
    color: '#000', // Text color black when focused
    padding: '2px',
    borderRadius: '14px',
    cursor: 'pointer',
    height: '17px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#000',
    fontSize: '10px', // Placeholder text color
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000', // Selected option text color
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#B0ACAC', // Dropdown background color
    color: '#fff', // Dropdown text color
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#4A90E2' : '#2C3E50',
    color: '#fff',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#4A90E2', // Hover state color
    },
  }),
  indicatorSeparator: () => ({
    display: 'none', // This hides the "|" symbol
  }),
};

// Language Selector component

function removeDuplicates(array: { label: string; value: string }[]): { label: string; value: string }[] {
  const seen = new Set<string>();
  return array.filter((obj) => {
    const key = `${obj.label}-${obj.value}`;
    if (seen.has(key)) {
      return false; // Duplicate found, exclude from the new array
    } else {
      seen.add(key); // Not a duplicate, add the key to the set
      return true;   // Include in the new array
    }
  });
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ setLanguage, placeHolder }) => {
  const allLanguages = removeDuplicates(getAllLanguages());
  
  

  // Handle change event when a language is selected
  const handleChange = (selectedOption: SingleValue<LanguageOption>) => {
    if (selectedOption) {
      setLanguage(selectedOption.value);
    }
  };

  return (
    <div className="w-[150px]">
      <Select
        options={allLanguages}
        onChange={handleChange}
        placeholder={placeHolder}
        isSearchable
        styles={customStyles} // Apply custom styles
        components={{
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
};

export default LanguageSelector;
