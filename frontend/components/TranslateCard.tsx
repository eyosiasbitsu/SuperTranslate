"use client";

import { PaperClipIcon, XCircleIcon } from "@heroicons/react/24/outline";
import LanguageSelector from "./LanguageSelector";
import { TranslateCardProps } from "@/types/translator";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";


// Declare a global interface to add the webkitSpeechRecognition property to the Window object
declare global {
  interface Window {
    webkitSpeechRecognition: SpeechRecognition;
  }
}

// yourFile.ts

import { languageMap } from './languageMap'; // Adjust the path according to your file structure

function getLanguageTag(language: string): string {
  const normalizedLanguage = language.trim().toLowerCase();

  const matchedLanguageTag = Object.keys(languageMap).find(
    key => key.toLowerCase() === normalizedLanguage
  );

  return matchedLanguageTag ? languageMap[matchedLanguageTag] : "en-US";
}


const TranslateCard: React.FC<TranslateCardProps> = ({
  inputText,
  setInputText,
  setRequestLanguage,
  imageUrl,
  setImageUrl,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileType, setFileType] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Upload Image or File
  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
      setFileType(fileInput.files[0].type);
      formData.append("upload_preset", "my-uploads"); // Your Cloudinary upload preset

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/ddwwi0vjk/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setImageUrl(data.secure_url); // Store the uploaded image URL
          console.log("Cloudinary response:", data);
        } else {
          console.error("Upload failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
      }

      setIsUploading(false);
    }
  };

  // Remove the uploaded image
  const removeImage = () => {
    setImageUrl(""); // Clear the image URL
  };
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  console.log(selectedLanguage) // Default language is English
  const [manualText, setManualText] = useState(""); 
  // Voice-to-Text functionality
  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = selectedLanguage; // Use your selected language

    let fullTranscript = "";

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          fullTranscript += result[0].transcript; // Append final result
        } else {
          interimTranscript += result[0].transcript; // Append interim result
        }
      }
      
      
      // Merge manual edits and recorded transcript
      setInputText(manualText + fullTranscript + interimTranscript);
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecordingComplete(true);
      setIsRecording(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Cleanup effect when the component unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newManualText = e.target.value;
    
    setManualText(newManualText);
   
    setInputText(newManualText ); // Combine with transcript
  };
  return (
    <div className="max-w-2xl w-full mx-auto p-2 bg-[#EDEFF3] rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between  items-center mb-3">
        {/* PaperClipIcon triggers file input */}
        <div className="flex pb-3 pt-2">
          <label htmlFor="file-upload" className="flex items-center cursor-pointer">
            <PaperClipIcon className="h-5 w-7 text-gray-500" />
            <h6>Give me something to translate</h6>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt,image/*"
            className="hidden"
            onChange={uploadImage}
          />
        </div>

        {/* Recording Microphone Button */}
        <div >
        <button
          onClick={handleToggleRecording}
          className={`mr-10 m-auto flex items-center justify-center rounded-full w-10 h-10 focus:outline-none ${
            isRecording ? "bg-red-400" : "bg-blue-400"
          } hover:bg-blue-500`}
        >
          {isRecording ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
            >
              <path
                fill="currentColor"
                d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
              />
            </svg>
          )}
        </button>
        </div>
      </div>

      {/* Show uploaded image */}
      {imageUrl && (
        <div className="relative mb-3 flex justify-center">
          {fileType.startsWith("image/") ? (
            <img
              src={imageUrl}
              alt="Uploaded file"
              className="max-h-40 object-contain"
            />
          ) : fileType === "application/pdf" ? (
            <iframe
              src={imageUrl}
              className="max-h-40 object-contain"
              title="Uploaded PDF"
            />
          ) : (
            <div className="max-h-40 w-full flex items-center justify-center">
              <p>File type not previewable</p>
            </div>
          )}
          <div className="relative">
            <XCircleIcon
              onClick={removeImage}
              className="absolute top-0 left-0 h-6 w-6 text-gray-500 cursor-pointer hover:text-red-500"
            />
          </div>
        </div>
      )}

      {/* Text area for input */}
      {!imageUrl && (
        <textarea
          id="text"
          value={inputText || transcript}
          onChange={handleTextChange} 
          rows={4}
          className="w-full p-4 pb-1 text-lg rounded-md focus:outline-none bg-[#FAFAFA] resize-none overflow-y-hidden"
          placeholder="Give me something to translate"
        />
      )}

      {/* Language selector */}
      <LanguageSelector
  setLanguage={(languageCode) => {
    setRequestLanguage(languageCode);
    setSelectedLanguage(languageCode); // Set the selected language for voice recognition
  }}
  placeHolder="Source Language"
/>

      {/* Show upload status */}
      {isUploading && <p>Uploading file...</p>}
    </div>
  );
};

export default TranslateCard;
