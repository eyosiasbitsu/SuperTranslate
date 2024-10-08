import useTranslationStore from '@/app/store/translateStore';
import React from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';

// Define the type for the service option
type ServiceOption = {
  value: string;
  label: string;
};

// Define the available services
const services: ServiceOption[] = [
  { value: 'azure', label: 'Azure' },
  { value: 'deepL', label: 'DeepL' },
  { value: 'google_v2', label: 'Google V2' },
  { value: 'google_v3', label: 'Google V3' }
];

// Custom styles for react-select
const customStyles: StylesConfig<ServiceOption, false> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#fff' : '#B0ACAC',
    border: state.isFocused ? '1px solid #000' : 'none',
    boxShadow: 'none',
    color: '#000',
    padding: '2px',
    borderRadius: '14px',
    cursor: 'pointer',
    height: '40px', // Increased height for better usability
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#fff',
    fontSize: '10px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#B0ACAC',
    color: '#fff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#4A90E2' : '#2C3E50',
    color: '#fff',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#4A90E2',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
};

interface MeaningSelectorProps {
  selectedService: string; // The selected service
  setSelectedService: (service: string) => void; // Function to update the selected service
  onServiceChange: () => void; // Function to call when the service changes
}

const MeaningSelector: React.FC<MeaningSelectorProps> = ({
  selectedService,
  setSelectedService,
  onServiceChange,
}) => {

  const {model, setModel} = useTranslationStore();
  
  // Handle change event when a service is selected
  const handleChange = (selectedOption: SingleValue<ServiceOption>) => {
    if (selectedOption) {
      console.log('Selected meaning service:', selectedOption);
      setModel(selectedOption.value); 
      setSelectedService(selectedOption.value); // Update the selected service

      // Call the service change callback
      onServiceChange(); 

      // Trigger blur to remove focus and change background color back
      (document.activeElement as HTMLElement)?.blur(); // This ensures the focused element loses focus
    }
  };
  return (
    <div className="w-[150px]">
      <Select
        options={services}
        onChange={handleChange}
        value={services.find(service => service.value === selectedService) || null} // Display the selected service as the current value
        placeholder={selectedService ? selectedService : "Select a Judge"} // Placeholder changes to the selected value
        isSearchable
        styles={customStyles}
        components={{
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
};

export default MeaningSelector;
