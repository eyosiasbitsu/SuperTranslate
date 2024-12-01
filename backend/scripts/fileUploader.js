const fs = require('fs');
const path = require('path');
const uploadToCloudinary = require('../utils/cloudinaryUploader');  // Import your Cloudinary utility function

// Directory containing the PDF and DOCX files
const filesDirectory = path.join(__dirname, 'files');  // Ensure this path matches your folder structure

// Function to iterate over all PDF and DOCX files in the directory and upload them
const uploadAllFiles = async () => {
  try {
    const files = fs.readdirSync(filesDirectory);
    const uploadPromises = [];

    files.forEach((file) => {
      const filePath = path.join(filesDirectory, file);

      // Check if the file has a .pdf or .docx extension
      if (['.pdf', '.docx'].includes(path.extname(file).toLowerCase())) {
        uploadPromises.push(uploadToCloudinary(filePath));  // Use the Cloudinary utility function for each file
      }
    });

    // Wait for all the uploads to complete
    const cloudinaryUrls = await Promise.all(uploadPromises);

    console.log('All files uploaded successfully!');
    return cloudinaryUrls;  // Return the array of Cloudinary URLs
  } catch (error) {
    console.error('Error uploading files:', error.message);
  }
};

// Function to trigger the upload process and handle logging
const uploader = async () => {
  try {
    const cloudinaryUrls = await uploadAllFiles();
    console.log('Uploaded file URLs:', cloudinaryUrls);
  } catch (error) {
    console.error('An error occurred during the upload process:', error.message);
  }
};

// Export the uploader function for use elsewhere if needed
module.exports = { 
    uploader 
};
